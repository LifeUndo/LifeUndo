'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';

export default function CreatorApplyPage() {
  const t = useTranslations('creator');
  const locale = useLocale();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    channel_url: '',
    audience: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/creator/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          locale: locale
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', channel_url: '', audience: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
              {locale === 'ru' ? 'Партнёрская программа' : 'Creator Partnership Program'}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {locale === 'ru' 
                ? 'Присоединяйтесь к нашей партнёрской программе и получите ранний доступ к GetLifeUndo, реферальные проценты и эксклюзивные материалы.'
                : 'Join our creator partnership program and get early access to GetLifeUndo, referral commissions, and exclusive materials.'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Benefits */}
            <div className="space-y-8">
              <div className="bg-blue-50 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {locale === 'ru' ? 'Что мы предлагаем' : 'What we offer'}
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="text-blue-500 mr-3 mt-1">🚀</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {locale === 'ru' ? 'Ранний доступ' : 'Early Access'}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {locale === 'ru' 
                          ? 'Первыми получайте новые версии и функции'
                          : 'Be the first to get new versions and features'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-blue-500 mr-3 mt-1">💰</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {locale === 'ru' ? 'Реферальные проценты' : 'Referral Commissions'}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {locale === 'ru' 
                          ? 'Получайте процент с каждого приведённого пользователя после запуска Pro'
                          : 'Get commission from every referred user after Pro launch'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-blue-500 mr-3 mt-1">🎨</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {locale === 'ru' ? 'Эксклюзивные материалы' : 'Exclusive Materials'}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {locale === 'ru' 
                          ? 'Брендированные материалы, скриншоты, демо-видео'
                          : 'Branded materials, screenshots, demo videos'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-blue-500 mr-3 mt-1">📢</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {locale === 'ru' ? 'Упоминания и реклама' : 'Mentions and Promotion'}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {locale === 'ru' 
                          ? 'Мы будем упоминать вас в наших каналах'
                          : 'We will mention you in our channels'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {locale === 'ru' ? 'Кого мы ищем' : 'Who we are looking for'}
                </h2>
                
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">•</span>
                    {locale === 'ru' 
                      ? 'Блогеры и авторы контента о продуктивности, приватности, браузерах'
                      : 'Bloggers and content creators about productivity, privacy, browsers'
                    }
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">•</span>
                    {locale === 'ru' 
                      ? 'YouTube каналы с аудиторией от 1K подписчиков'
                      : 'YouTube channels with 1K+ subscribers'
                    }
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">•</span>
                    {locale === 'ru' 
                      ? 'Telegram каналы и чаты о технологиях'
                      : 'Telegram channels and chats about technology'
                    }
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">•</span>
                    {locale === 'ru' 
                      ? 'Веб-сайты и блоги о софте и гаджетах'
                      : 'Websites and blogs about software and gadgets'
                    }
                  </li>
                </ul>
              </div>
            </div>

            {/* Application Form */}
            <div className="bg-gray-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {locale === 'ru' ? 'Подать заявку' : 'Submit Application'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === 'ru' ? 'Имя' : 'Name'}
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
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="channel_url" className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === 'ru' ? 'Ссылка на канал/сайт' : 'Channel/Website URL'}
                  </label>
                  <input
                    type="url"
                    id="channel_url"
                    name="channel_url"
                    value={formData.channel_url}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://your-channel.com"
                  />
                </div>

                <div>
                  <label htmlFor="audience" className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === 'ru' ? 'Размер аудитории' : 'Audience Size'}
                  </label>
                  <select
                    id="audience"
                    name="audience"
                    value={formData.audience}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">
                      {locale === 'ru' ? 'Выберите размер аудитории' : 'Select audience size'}
                    </option>
                    <option value="1k-10k">1K - 10K</option>
                    <option value="10k-100k">10K - 100K</option>
                    <option value="100k-1m">100K - 1M</option>
                    <option value="1m+">1M+</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === 'ru' ? 'Расскажите о себе' : 'Tell us about yourself'}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    placeholder={locale === 'ru' 
                      ? 'Расскажите о вашем контенте и как вы планируете продвигать GetLifeUndo...'
                      : 'Tell us about your content and how you plan to promote GetLifeUndo...'
                    }
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="text-green-500 mr-3 mt-0.5">✓</div>
                      <p className="text-green-800 text-sm">
                        {locale === 'ru' 
                          ? 'Заявка получена! Мы свяжемся с вами по e-mail.'
                          : 'Application received! We\'ll contact you by email.'
                        }
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
                          ? 'Ошибка при отправке заявки. Попробуйте еще раз.'
                          : 'Error submitting application. Please try again.'
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
                    ? (locale === 'ru' ? 'Отправляем...' : 'Submitting...')
                    : (locale === 'ru' ? 'Подать заявку' : 'Submit Application')
                  }
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}