export default function OfferPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
            <h1 className="text-3xl md:text-4xl font-semibold text-white mb-8">
              Публичная оферта на предоставление простой (неисключительной) лицензии на ПО «GetLifeUndo»
            </h1>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 mb-6">
                <strong>Правообладатель:</strong> ООО «GetLifeUndo», ИНН xxx, ОГРН xxx, адрес: xxx.
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">1. Предмет</h2>
              <p className="text-gray-300 mb-4">
                1.1. Правообладатель предоставляет Пользователю неисключительную непередаваемую лицензию на программное обеспечение «GetLifeUndo» (далее — «ПО»), а Пользователь принимает условия настоящей Оферты.
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">2. Лицензия и ограничения</h2>
              <p className="text-gray-300 mb-4">
                2.1. Лицензия предоставляется на условиях простой (неисключительной) лицензии, без права сублицензирования, на территории всего мира, на срок оплаченного периода (для бессрочной лицензии — бессрочно).
              </p>
              <p className="text-gray-300 mb-4">
                2.2. Запрещается: декомпиляция, модификация исходного кода, обход технических средств защиты, распространение копий, за исключением случаев, разрешённых законом.
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">3. Тарифы и оплата</h2>
              <p className="text-gray-300 mb-4">
                3.1. Стоимость и состав тарифов указаны на странице https://getlifeundo.com/ru/pricing.
              </p>
              <p className="text-gray-300 mb-4">
                3.2. Оплату обрабатывает платёжный провайдер. Момент оплаты является акцептом Оферты.
              </p>
              <p className="text-gray-300 mb-4">
                3.3. Документы, подтверждающие оплату, формирует платёжный провайдер.
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">4. Обновления и поддержка</h2>
              <p className="text-gray-300 mb-4">
                4.1. ПО может обновляться автоматически.
              </p>
              <p className="text-gray-300 mb-4">
                4.2. Поддержка оказывается по адресу support@getlifeundo.com в срок до 2 (двух) рабочих дней.
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">5. Конфиденциальность и данные</h2>
              <p className="text-gray-300 mb-4">
                5.1. ПО работает локально; телеметрия не ведётся. Персональные данные, передаваемые при оплате, обрабатываются провайдером платежей.
              </p>
              <p className="text-gray-300 mb-4">
                5.2. Дополнительные условия обработки персональных данных содержатся в Политике обработки персональных данных: https://getlifeundo.com/ru/legal/pdp.
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">6. Ответственность</h2>
              <p className="text-gray-300 mb-4">
                6.1. Ответственность Правообладателя ограничена суммой 3 (трёх) месяцев стоимости соответствующего тарифа Пользователя.
              </p>
              <p className="text-gray-300 mb-4">
                6.2. Правообладатель не отвечает за невозможность использования ПО по причинам, зависящим от Пользователя, третьих лиц, форс-мажора.
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">7. Прекращение</h2>
              <p className="text-gray-300 mb-4">
                7.1. Договор прекращается по окончании оплаченного периода либо при нарушении условий Оферты.
              </p>
              <p className="text-gray-300 mb-4">
                7.2. Правообладатель вправе в одностороннем порядке изменить условия Оферты путём публикации новой редакции.
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">8. Применимое право и споры</h2>
              <p className="text-gray-300 mb-4">
                8.1. Применимое право — Российская Федерация.
              </p>
              <p className="text-gray-300 mb-4">
                8.2. Споры подлежат рассмотрению в суде по месту нахождения Правообладателя, при соблюдении претензионного порядка (срок ответа — 10 рабочих дней).
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">9. Реквизиты Правообладателя</h2>
              <p className="text-gray-300 mb-4">
                ООО «GetLifeUndo», ИНН xxx, ОГРН xxx<br/>
                Адрес: xxx<br/>
                Банк: xxx, БИК xxx<br/>
                Счёт: xxx, Корр. счёт: xxx<br/>
                E-mail: support@getlifeundo.com
              </p>

              <p className="text-gray-400 text-sm mt-8">
                <em>Дата обновления: 2025-10-04</em>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
