'use client';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    consent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Симуляция отправки формы
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-card p-8">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-3xl font-bold gradient-text mb-4">
              Сообщение отправлено!
            </h1>
            <p className="text-gray-300 mb-6">
              Спасибо за ваше сообщение. Мы ответим в течение 24 часов.
            </p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Отправить новое сообщение
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold gradient-text mb-8 text-center">
          Связаться с нами
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card p-8">
            <h2 className="text-2xl font-semibold mb-6">Напишите нам</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Имя *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ваше имя"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Тема *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Выберите тему</option>
                  <option value="support">Техническая поддержка</option>
                  <option value="billing">Вопросы по оплате</option>
                  <option value="feature">Предложение функции</option>
                  <option value="bug">Сообщение об ошибке</option>
                  <option value="other">Другое</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Сообщение *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Опишите ваш вопрос или предложение..."
                />
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="consent"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  required
                  className="mt-1 w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500"
                />
                <label htmlFor="consent" className="text-sm text-gray-300">
                  Я согласен на обработку персональных данных *
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !formData.consent}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Отправляем...' : 'Отправить сообщение'}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4">Быстрая связь</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-purple-300 mb-2">Telegram</h4>
                  <a 
                    href="https://t.me/lifeundo_support" 
                    className="text-gray-300 hover:text-purple-300 transition-colors"
                  >
                    @lifeundo_support
                  </a>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-300 mb-2">Email</h4>
                  <a 
                    href="mailto:support@getlifeundo.com" 
                    className="text-gray-300 hover:text-purple-300 transition-colors"
                  >
                    support@getlifeundo.com
                  </a>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4">Время ответа</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>• Техническая поддержка: до 24 часов</p>
                <p>• Вопросы по оплате: до 12 часов</p>
                <p>• Предложения функций: до 3 дней</p>
                <p>• Telegram: обычно в течение часа</p>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4">Часто задаваемые вопросы</h3>
              <div className="space-y-3 text-sm">
                <a href="/ru/support" className="block text-purple-300 hover:text-purple-200 transition-colors">
                  → Перейти к FAQ
                </a>
                <a href="/ru/support" className="block text-purple-300 hover:text-purple-200 transition-colors">
                  → Известные проблемы
                </a>
                <a href="/ru/support" className="block text-purple-300 hover:text-purple-200 transition-colors">
                  → Статус сервисов
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}