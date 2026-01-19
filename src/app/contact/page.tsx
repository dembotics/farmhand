'use client';

import { useState } from 'react';
import { Mail, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Send to backend/email service
      console.log('Contact form:', formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="card text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Message Sent!</h1>
          <p className="text-muted">
            Thanks for reaching out. We&apos;ll get back to you as soon as possible.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Contact Us</h1>
        <p className="text-muted">
          Have a question or feedback? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="label">Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          <div>
            <label htmlFor="email" className="label">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          <div>
            <label htmlFor="subject" className="label">Subject *</label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="input"
            >
              <option value="">Select a topic</option>
              <option value="general">General Question</option>
              <option value="account">Account Help</option>
              <option value="billing">Billing / Subscription</option>
              <option value="report">Report a Problem</option>
              <option value="feedback">Feedback / Suggestion</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="label">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              required
              className="input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm text-muted text-center">
            You can also reach us at{' '}
            <a href="mailto:support@farmhand.ca" className="text-primary hover:underline">
              support@farmhand.ca
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
