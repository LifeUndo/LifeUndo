-- SMTP Relay: логирование попыток отправки и расширение email_outbox
DO $$ BEGIN
    CREATE TYPE relay_status AS ENUM ('SENT', 'FAILED', 'RETRY', 'PENDING');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Лог попыток релэя
CREATE TABLE IF NOT EXISTS email_relay_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  outbox_id uuid NOT NULL REFERENCES email_outbox(id) ON DELETE CASCADE,
  relay_host text NOT NULL,
  relay_status relay_status NOT NULL,
  response_code int,
  response_message text,
  attempted_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Добавляем колонки к email_outbox для релэя
DO $$ 
BEGIN
  -- relay_message_id - ID сообщения от SMTP сервера
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_outbox' AND column_name = 'relay_message_id') THEN
    ALTER TABLE email_outbox ADD COLUMN relay_message_id text;
  END IF;

  -- relay_last_attempt_at - время последней попытки отправки
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_outbox' AND column_name = 'relay_last_attempt_at') THEN
    ALTER TABLE email_outbox ADD COLUMN relay_last_attempt_at timestamptz;
  END IF;

  -- relay_attempts - количество попыток отправки (если уже есть, не меняем)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_outbox' AND column_name = 'relay_attempts') THEN
    ALTER TABLE email_outbox ADD COLUMN relay_attempts int NOT NULL DEFAULT 0;
  END IF;

  -- relay_next_attempt_at - время следующей попытки (для backoff)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_outbox' AND column_name = 'relay_next_attempt_at') THEN
    ALTER TABLE email_outbox ADD COLUMN relay_next_attempt_at timestamptz;
  END IF;

  -- relay_error_message - последняя ошибка релэя
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_outbox' AND column_name = 'relay_error_message') THEN
    ALTER TABLE email_outbox ADD COLUMN relay_error_message text;
  END IF;
END $$;

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS email_relay_log_outbox_idx ON email_relay_log(outbox_id);
CREATE INDEX IF NOT EXISTS email_relay_log_status_attempted_idx ON email_relay_log(relay_status, attempted_at DESC);
CREATE INDEX IF NOT EXISTS email_relay_log_attempted_at_idx ON email_relay_log(attempted_at DESC);

-- Индекс для поиска писем готовых к отправке
CREATE INDEX IF NOT EXISTS email_outbox_relay_next_attempt_idx ON email_outbox(relay_next_attempt_at) 
WHERE status = 'APPROVED' AND relay_attempts < 5;

-- Индекс для поиска писем с ошибками релэя
CREATE INDEX IF NOT EXISTS email_outbox_relay_error_idx ON email_outbox(relay_error_message) 
WHERE status = 'FAILED' AND relay_error_message IS NOT NULL;

-- Функция для обновления статуса после релэя
CREATE OR REPLACE FUNCTION update_email_relay_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Обновляем основную запись в email_outbox
  IF NEW.relay_status = 'SENT' THEN
    UPDATE email_outbox 
    SET 
      status = 'SENT',
      relay_message_id = NEW.response_message, -- В response_message может быть Message-ID
      relay_last_attempt_at = NEW.attempted_at,
      relay_attempts = relay_attempts + 1,
      relay_error_message = NULL
    WHERE id = NEW.outbox_id;
  ELSIF NEW.relay_status = 'FAILED' THEN
    UPDATE email_outbox 
    SET 
      status = 'FAILED',
      relay_last_attempt_at = NEW.attempted_at,
      relay_attempts = relay_attempts + 1,
      relay_error_message = NEW.response_message
    WHERE id = NEW.outbox_id;
  ELSIF NEW.relay_status = 'RETRY' THEN
    -- Для RETRY обновляем только счетчик попыток и время следующей попытки
    UPDATE email_outbox 
    SET 
      relay_last_attempt_at = NEW.attempted_at,
      relay_attempts = relay_attempts + 1,
      relay_next_attempt_at = now() + interval '1 minute' * power(2, relay_attempts) -- Exponential backoff
    WHERE id = NEW.outbox_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для автоматического обновления статуса
DROP TRIGGER IF EXISTS trg_update_email_relay_status ON email_relay_log;
CREATE TRIGGER trg_update_email_relay_status
  AFTER INSERT ON email_relay_log
  FOR EACH ROW EXECUTE FUNCTION update_email_relay_status();

-- Функция для очистки старых логов (можно вызывать по крону)
CREATE OR REPLACE FUNCTION cleanup_old_relay_logs()
RETURNS void AS $$
BEGIN
  -- Удаляем логи старше 30 дней
  DELETE FROM email_relay_log 
  WHERE attempted_at < now() - interval '30 days';
END;
$$ LANGUAGE plpgsql;

-- Функция для получения статистики релэя
CREATE OR REPLACE FUNCTION get_relay_stats(org_id_param uuid, days_param int DEFAULT 7)
RETURNS TABLE (
  total_attempts bigint,
  sent_count bigint,
  failed_count bigint,
  retry_count bigint,
  success_rate numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_attempts,
    COUNT(*) FILTER (WHERE erl.relay_status = 'SENT') as sent_count,
    COUNT(*) FILTER (WHERE erl.relay_status = 'FAILED') as failed_count,
    COUNT(*) FILTER (WHERE erl.relay_status = 'RETRY') as retry_count,
    CASE 
      WHEN COUNT(*) > 0 THEN 
        ROUND((COUNT(*) FILTER (WHERE erl.relay_status = 'SENT')::numeric / COUNT(*)::numeric) * 100, 2)
      ELSE 0
    END as success_rate
  FROM email_relay_log erl
  JOIN email_outbox eo ON erl.outbox_id = eo.id
  WHERE eo.org_id = org_id_param 
    AND erl.attempted_at >= now() - (days_param || ' days')::interval;
END;
$$ LANGUAGE plpgsql;


