import Link from 'next/link';

const neighborhoods = [
  { slug: 'the-heights', name: 'The Heights' },
  { slug: 'west-little-rock', name: 'West Little Rock' },
  { slug: 'downtown', name: 'Downtown' },
  { slug: 'maumelle', name: 'Maumelle' },
  { slug: 'chenal-valley', name: 'Chenal Valley' },
  { slug: 'north-little-rock', name: 'North Little Rock' },
  { slug: 'conway', name: 'Conway' },
  { slug: 'bryant', name: 'Bryant' },
  { slug: 'cabot', name: 'Cabot' },
  { slug: 'soma', name: 'SoMa District' },
];

const quickLinks = [
  { href: '/guides/moving-to-little-rock', label: 'Moving to Little Rock' },
  { href: '/guides/best-neighborhoods-for-families', label: 'Best Neighborhoods for Families' },
  { href: '/tools/mortgage-calculator', label: 'Mortgage Calculator' },
  { href: '/tools/neighborhood-quiz', label: 'Find Your Neighborhood' },
  { href: '/events', label: 'Upcoming Events' },
  { href: '/newsletter', label: 'Newsletter' },
];

export default function Footer() {
  return (
    <footer className="bg-[#1C1C1C] text-gray-400 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-white font-bold text-lg">Metro Little Rock</Link>
            <p className="mt-3 text-sm leading-relaxed">
              Your guide to living, working, and playing in central Arkansas.
            </p>
            <p className="mt-4 text-sm">
              Built by{' '}
              <a href="https://exprealty.com" target="_blank" rel="noopener noreferrer" className="text-[#2E86C1] hover:text-white transition-colors">
                David · EXP Realty
              </a>
            </p>
            <p className="mt-1 text-xs">Arkansas License #</p>
          </div>

          {/* Neighborhoods */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Neighborhoods</h3>
            <ul className="space-y-1.5">
              {neighborhoods.map(({ slug, name }) => (
                <li key={slug}>
                  <Link href={`/neighborhoods/${slug}`} className="text-sm hover:text-white transition-colors">
                    {name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/neighborhoods" className="text-sm text-[#2E86C1] hover:text-white transition-colors">
                  All 20 neighborhoods →
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-1.5">
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">About David</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Get in Touch</Link>
              </li>
              <li>
                <a href="tel:+15015550100" className="hover:text-white transition-colors">(501) 555-0100</a>
              </li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a href="#" aria-label="Facebook" className="text-gray-500 hover:text-white transition-colors text-lg">f</a>
              <a href="#" aria-label="Instagram" className="text-gray-500 hover:text-white transition-colors text-lg">ig</a>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} Metro Little Rock. All rights reserved.</p>
          <p>
            Real estate services provided by David · EXP Realty · Equal Housing Opportunity
          </p>
        </div>
      </div>
    </footer>
  );
}
