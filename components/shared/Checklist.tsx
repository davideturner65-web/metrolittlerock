'use client';

import { useState } from 'react';

interface ChecklistProps {
  items: string[];
  title?: string;
}

export default function Checklist({ items, title }: ChecklistProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) { next.delete(i); } else { next.add(i); }
      return next;
    });
  };

  return (
    <div className="bg-[#F0F4F8] rounded-lg p-5">
      {title && <h3 className="font-semibold text-[#1C1C1C] mb-3">{title}</h3>}
      <p className="text-xs text-[#555555] mb-3">{checked.size}/{items.length} completed</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <button
              onClick={() => toggle(i)}
              className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors ${
                checked.has(i)
                  ? 'bg-[#1E8449] border-[#1E8449] text-white'
                  : 'border-gray-400 bg-white'
              }`}
              aria-label={checked.has(i) ? 'Uncheck' : 'Check'}
            >
              {checked.has(i) && <span className="text-xs">✓</span>}
            </button>
            <span className={`text-sm leading-relaxed ${checked.has(i) ? 'line-through text-[#555555]' : 'text-[#1C1C1C]'}`}>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
