'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';

export default function ContactPage() {
  const t = useTranslations('contact');
  const locale = useLocale();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/assistant/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          locale: window.location.pathname.split('/')[1] || 'en'
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {locale === 'ru' 
                ? 'Есть вопросы или предложения? Мы будем рады услышать от вас!'
                : 'Have questions or suggestions? We\'d love to hear from you!'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gray-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {locale === 'ru' ? 'Написать нам' : 'Send us a message'}
              </h2>
              
              {/* Assistant Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <div className="text-blue-500 mr-3 mt-0.5">ℹ️</div>
                  <p className="text-blue-800 text-sm">
                    {t('assistant.note')}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={locale === 'ru' ? 'Ваше имя' : 'Your name'}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={locale === 'ru' ? 'your@email.com' : 'your@email.com'}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    placeholder={locale === 'ru' ? 'Ваше сообщение...' : 'Your message...'}
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="text-green-500 mr-3 mt-0.5">✓</div>
                      <p className="text-green-800 text-sm">
                        {t('form.success')}
                      </p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="text-red-500 mr-3 mt-0.5">✗</div>
                      <p className="text-red-800 text-sm">
                        {locale === 'ru' 
                          ? 'Произошла ошибка при отправке сообщения. Попробуйте еще раз.'
                          : 'An error occurred while sending the message. Please try again.'
                        }
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting 
                    ? (locale === 'ru' ? 'Отправляем...' : 'Sending...')
                    : t('form.submit')
                  }
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {locale === 'ru' ? 'Контактная информация' : 'Contact Information'}
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="text-blue-500 mr-3 mt-1">📧</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">legal@getlifeundo.com</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {locale === 'ru' 
                          ? 'Для технической поддержки и общих вопросов'
                          : 'For technical support and general questions'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-blue-500 mr-3 mt-1">🕒</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {locale === 'ru' ? 'Время ответа' : 'Response Time'}
                      </h3>
                      <p className="text-gray-600">
                        {locale === 'ru' ? '24-48 часов' : '24-48 hours'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {locale === 'ru' 
                          ? 'Мы отвечаем на все сообщения в течение 1-2 рабочих дней'
                          : 'We respond to all messages within 1-2 business days'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-blue-500 mr-3 mt-1">🌐</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {locale === 'ru' ? 'Языки поддержки' : 'Supported Languages'}
                      </h3>
                      <p className="text-gray-600">Русский, English</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {locale === 'ru' 
                          ? 'Мы отвечаем на русском и английском языках'
                          : 'We respond in Russian and English'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {locale === 'ru' ? 'Часто задаваемые вопросы' : 'Frequently Asked Questions'}
                </h3>
                
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {locale === 'ru' ? 'Как установить расширение?' : 'How to install the extension?'}
                    </h4>
                    <p className="text-gray-600">
                      {locale === 'ru' 
                        ? 'Перейдите на страницу "Скачать" и нажмите "Получить на AMO".'
                        : 'Go to the "Downloads" page and click "Get on AMO".'
                      }
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {locale === 'ru' ? 'Безопасно ли расширение?' : 'Is the extension safe?'}
                    </h4>
                    <p className="text-gray-600">
                      {locale === 'ru' 
                        ? 'Да, все данные хранятся локально на вашем устройстве.'
                        : 'Yes, all data is stored locally on your device.'
                      }
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {locale === 'ru' ? 'Когда выйдет Desktop версия?' : 'When will the Desktop version be released?'}
                    </h4>
                    <p className="text-gray-600">
                      {locale === 'ru' 
                        ? 'Мы работаем над MVP версией. Следите за обновлениями!'
                        : 'We\'re working on the MVP version. Stay tuned for updates!'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}