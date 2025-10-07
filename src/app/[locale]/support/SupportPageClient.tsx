'use client';

import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const FAQ = [
  {
    q: "Не пришло письмо с лицензией. Что делать?",
    a: "Проверьте папку «Спам», вкладку «Промоакции» и корректность email в заказе. Если письма нет — отправьте нам тикет с указанием order_id, мы вышлем ключ повторно."
  },
  {
    q: "Можно сменить тариф?",
    a: "Да. Напишите нам, укажите текущий план и желаемый. Мы предложим наиболее выгодный вариант."
  }
];

export default function SupportPageClient({ params }: { params: { locale: string } }) {
  const searchParams = useSearchParams();
  const order_id = searchParams.get('order_id') || '';
  const plan = searchParams.get('plan') || '';
  const email = searchParams.get('email') || '';

  const [ticketData, setTicketData] = useState({
    order_id,
    plan,
    email,
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/support/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData)
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        setTicketData(prev => ({ ...prev, subject: '', message: '' }));
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFAQ = useMemo(() => {
    return FAQ.filter(item => 
      item.q.toLowerCase().includes(ticketData.subject.toLowerCase()) ||
      item.a.toLowerCase().includes(ticketData.subject.toLowerCase())
    );
  }, [ticketData.subject]);

  return (
    <>
      <Head>
        <title>Support - GetLifeUndo</title>
        <meta name="description" content="Get help with GetLifeUndo. Submit a support ticket or browse our FAQ." />
      </Head>
      
      <div className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold gradient-text mb-8 text-center">
              Support Center
            </h1>
            
            {/* FAQ Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {FAQ.map((item, index) => (
                  <div key={index} className="glass-card p-6">
                    <h3 className="text-lg font-semibold mb-2">{item.q}</h3>
                    <p className="text-gray-300">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Ticket Form */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-semibold mb-6">Submit Support Ticket</h2>
              
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300">
                  Ticket submitted successfully! We'll get back to you within 24 hours.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
                  Failed to submit ticket. Please try again or contact us directly.
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Order ID</label>
                    <input
                      type="text"
                      value={ticketData.order_id}
                      onChange={(e) => setTicketData(prev => ({ ...prev, order_id: e.target.value }))}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                      placeholder="Enter order ID if applicable"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Plan</label>
                    <select
                      value={ticketData.plan}
                      onChange={(e) => setTicketData(prev => ({ ...prev, plan: e.target.value }))}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    >
                      <option value="">Select plan</option>
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
                      <option value="vip">VIP</option>
                      <option value="team">Team</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={ticketData.email}
                    onChange={(e) => setTicketData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    value={ticketData.subject}
                    onChange={(e) => setTicketData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    value={ticketData.message}
                    onChange={(e) => setTicketData(prev => ({ ...prev, message: e.target.value }))}
                    rows={6}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                    placeholder="Describe your issue in detail..."
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
