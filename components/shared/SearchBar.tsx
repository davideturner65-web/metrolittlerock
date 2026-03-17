'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  placeholder?: string;
  size?: 'sm' | 'lg';
}

export default function SearchBar({ placeholder = 'Search neighborhoods, guides, events...', size = 'sm' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const isLarge = size === 'lg';

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${isLarge ? 'max-w-xl' : 'max-w-sm'}`}>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={`flex-1 border border-gray-300 rounded-lg bg-white text-[#1C1C1C] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2E86C1] focus:border-transparent ${
          isLarge ? 'px-5 py-3 text-base' : 'px-4 py-2 text-sm'
        }`}
      />
      <button
        type="submit"
        className={`bg-[#1B4F72] hover:bg-[#2E86C1] text-white font-medium rounded-lg transition-colors ${
          isLarge ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm'
        }`}
      >
        Search
      </button>
    </form>
  );
}
