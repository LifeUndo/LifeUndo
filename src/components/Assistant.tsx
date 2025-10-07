'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface AssistantProps {
  className?: string;
}

export default function Assistant({ className = '' }: AssistantProps) {
  const params = useParams();
  const locale = params.locale as string || 'en';
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    
    try {
      // Отправляем на legal@getlifeundo.com
      const response = await fetch('/api/assistant/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          locale,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }),
      });

      if (response.ok) {
        setMessage('');
        alert(locale === 'ru' ? 'Сообщение отправлено. Ответ придёт на e-mail.' : 'Message sent. Reply will come via e-mail.');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Assistant error:', error);
      alert(locale === 'ru' ? 'Ошибка отправки. Попробуйте позже.' : 'Send error. Please try later.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceholder = () => {
    switch (locale) {
      case 'ru': return 'Задайте вопрос о LifeUndo...';
      case 'hi': return 'LifeUndo के बारे में प्रश्न पूछें...';
      case 'zh': return '询问 LifeUndo 相关问题...';
      case 'ar': return 'اسأل عن LifeUndo...';
      default: return 'Ask about LifeUndo...';
    }
  };

  const getButtonText = () => {
    switch (locale) {
      case 'ru': return 'Отправить';
      case 'hi': return 'भेजें';
      case 'zh': return '发送';
      case 'ar': return 'إرسال';
      default: return 'Send';
    }
  };

  return (
    <>
      {/* Floating Assistant Button */}
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          aria-label="Open AI Assistant"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </div>

      {/* Assistant Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {locale === 'ru' ? 'AI Ассистент' : 
                 locale === 'hi' ? 'AI सहायक' :
                 locale === 'zh' ? 'AI 助手' :
                 locale === 'ar' ? 'مساعد الذكاء الاصطناعي' :
                 'AI Assistant'}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {locale === 'ru' ? 'Задайте вопрос о LifeUndo или оставьте отзыв. Ответ по email. Онлайн-чат в разработке.' :
                 locale === 'hi' ? 'LifeUndo के बारे में प्रश्न पूछें या फीडबैक दें। ईमेल द्वारा उत्तर। ऑनलाइन चैट विकास में।' :
                 locale === 'zh' ? '询问 LifeUndo 相关问题或留下反馈。通过电子邮件回复。在线聊天正在开发中。' :
                 locale === 'ar' ? 'اسأل عن LifeUndo أو اترك تعليقًا. الرد عبر البريد الإلكتروني. الدردشة عبر الإنترنت قيد التطوير.' :
                 'Ask about LifeUndo or leave feedback. Reply by email. Online chat in development.'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={getPlaceholder()}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows={4}
                  required
                />
                
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    {locale === 'ru' ? 'Отмена' :
                     locale === 'hi' ? 'रद्द करें' :
                     locale === 'zh' ? '取消' :
                     locale === 'ar' ? 'إلغاء' :
                     'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !message.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? '...' : getButtonText()}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}