'use client';

import { useState } from 'react';
import type { FAQ as FAQType } from '@/types/shared';

interface FAQProps {
  items: FAQType[];
  title?: string;
}

export default function FAQ({ items, title = 'Frequently Asked Questions' }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-[#1C1C1C] mb-6">{title}</h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="border border-gray-200 rounded-lg bg-white">
            <button
              className="w-full text-left px-5 py-4 flex justify-between items-center gap-4 hover:bg-[#F8F9FA] transition-colors"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              aria-expanded={openIndex === i}
            >
              <span className="font-medium text-[#1C1C1C]">{item.question}</span>
              <span className="text-[#2E86C1] text-xl flex-shrink-0">{openIndex === i ? '−' : '+'}</span>
            </button>
            {openIndex === i && (
              <div className="px-5 pb-4 text-[#555555] leading-relaxed">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
