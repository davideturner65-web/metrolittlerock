'use client';

import { useState } from 'react';

interface NewsletterSignupProps {
  variant?: 'inline' | 'card';
}

export default function NewsletterSignup({ variant = 'card' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E86C1]"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-4 py-2 text-sm bg-[#D4740A] hover:bg-[#B8620A] text-white font-medium rounded-lg transition-colors disabled:opacity-60"
        >
          {status === 'loading' ? '...' : 'Subscribe'}
        </button>
      </form>
    );
  }

  return (
    <div className="bg-[#1B4F72] text-white rounded-xl p-8 text-center">
      <h2 className="text-2xl font-bold mb-2">Stay in the Loop</h2>
      <p className="text-blue-200 mb-6 max-w-md mx-auto">
        Weekend picks, new restaurant openings, and the market report — delivered weekly.
        No spam. Unsubscribe anytime.
      </p>
      {status === 'success' ? (
        <p className="text-green-300 font-medium">You&apos;re in. Check your inbox.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="flex-1 px-4 py-3 rounded-lg text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#D4740A]"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-3 bg-[#D4740A] hover:bg-[#B8620A] text-white font-semibold rounded-lg transition-colors disabled:opacity-60"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      )}
      {status === 'error' && (
        <p className="text-red-300 mt-2 text-sm">Something went wrong. Try again.</p>
      )}
    </div>
  );
}
