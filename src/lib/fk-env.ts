// FreeKassa Environment Configuration
// Нормализованные имена переменных с бэкенд-совместимостью

export const FK_ENABLED = String(process.env.NEXT_PUBLIC_FK_ENABLED ?? "").toLowerCase() === "true";

export const FK_MERCHANT_ID =
  process.env.FREEKASSA_MERCHANT_ID || process.env.FK_API_KEY || "";

export const FK_SECRET1 =
  process.env.FREEKASSA_SECRET1 || process.env.FK_SECRET_1 || "";

export const FK_SECRET2 =
  process.env.FREEKASSA_SECRET2 || process.env.FK_SECRET_2 || "";

export const FK_PAYMENT_URL =
  process.env.FREEKASSA_PAYMENT_URL || "https://pay.freekassa.ru/";

// Проверка конфигурации
export const FK_CONFIGURED = !!(FK_MERCHANT_ID && FK_SECRET1 && FK_SECRET2);

// Продуктовые ID и суммы
export const FK_PRODUCTS = {
  getlifeundo_pro: "599.00",
  getlifeundo_vip: "9990.00", 
  getlifeundo_team: "2990.00"
} as const;

export type FKProductId = keyof typeof FK_PRODUCTS;
