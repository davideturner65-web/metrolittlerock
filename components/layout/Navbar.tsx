'use client';

import Link from 'next/link';
import { useState } from 'react';

const navLinks = [
  { href: '/neighborhoods', label: 'Neighborhoods' },
  { href: '/events', label: 'Events' },
  { href: '/eat-drink', label: 'Eat & Drink' },
  { href: '/guides', label: 'Guides' },
  { href: '/tools', label: 'Tools' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[#1B4F72] font-bold text-lg leading-tight">
              Metro<br className="hidden sm:block" /><span className="sm:text-base">Little Rock</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-3 py-2 text-sm font-medium text-[#555555] hover:text-[#1B4F72] hover:bg-[#F0F4F8] rounded-md transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/newsletter"
              className="text-sm text-[#555555] hover:text-[#1B4F72] font-medium transition-colors"
            >
              Newsletter
            </Link>
            <Link
              href="/contact"
              className="text-sm bg-[#1B4F72] hover:bg-[#2E86C1] text-white font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Contact David
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-[#555555] hover:bg-[#F0F4F8]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-3 space-y-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-[#1C1C1C] hover:bg-[#F0F4F8] rounded-md"
              >
                {label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-100 mt-2 space-y-1">
              <Link
                href="/newsletter"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-[#1C1C1C] hover:bg-[#F0F4F8] rounded-md"
              >
                Newsletter
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm font-semibold text-white bg-[#1B4F72] rounded-md"
              >
                Contact David
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
