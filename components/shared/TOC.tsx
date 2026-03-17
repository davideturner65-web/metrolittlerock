'use client';

import { useEffect, useState } from 'react';

interface TOCItem {
  id: string;
  heading: string;
}

interface TOCProps {
  items: TOCItem[];
}

export default function TOC({ items }: TOCProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-20% 0% -70% 0%' }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="bg-[#F0F4F8] rounded-lg p-4 sticky top-6">
      <p className="text-xs font-semibold text-[#555555] uppercase tracking-wider mb-3">On This Page</p>
      <ul className="space-y-1">
        {items.map(({ id, heading }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`block text-sm py-1 px-2 rounded transition-colors ${
                activeId === id
                  ? 'text-[#1B4F72] font-medium bg-white'
                  : 'text-[#555555] hover:text-[#1B4F72]'
              }`}
            >
              {heading}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
