import Link from 'next/link';
import NewsletterSignup from '@/components/shared/NewsletterSignup';

interface SidebarProps {
  showNewsletter?: boolean;
  showNeighborhoods?: boolean;
  showTools?: boolean;
}

const featuredNeighborhoods = [
  { slug: 'the-heights', name: 'The Heights' },
  { slug: 'chenal-valley', name: 'Chenal Valley' },
  { slug: 'downtown', name: 'Downtown' },
  { slug: 'soma', name: 'SoMa District' },
  { slug: 'conway', name: 'Conway' },
];

const tools = [
  { href: '/tools/mortgage-calculator', label: 'Mortgage Calculator' },
  { href: '/tools/affordability-calculator', label: 'Affordability Calculator' },
  { href: '/tools/neighborhood-quiz', label: 'Neighborhood Quiz' },
  { href: '/tools/home-value-estimator', label: 'Home Value Estimator' },
];

export default function Sidebar({ showNewsletter = true, showNeighborhoods = true, showTools = true }: SidebarProps) {
  return (
    <aside className="space-y-6">
      {showNeighborhoods && (
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h3 className="font-semibold text-[#1C1C1C] mb-3">Explore Neighborhoods</h3>
          <ul className="space-y-1.5">
            {featuredNeighborhoods.map(({ slug, name }) => (
              <li key={slug}>
                <Link href={`/neighborhoods/${slug}`} className="text-sm text-[#2E86C1] hover:text-[#1B4F72] transition-colors">
                  {name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/neighborhoods" className="text-sm font-medium text-[#1B4F72] hover:underline">
                All neighborhoods →
              </Link>
            </li>
          </ul>
        </div>
      )}

      {showTools && (
        <div className="bg-[#F0F4F8] rounded-lg p-5">
          <h3 className="font-semibold text-[#1C1C1C] mb-3">Real Estate Tools</h3>
          <ul className="space-y-1.5">
            {tools.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-sm text-[#2E86C1] hover:text-[#1B4F72] transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showNewsletter && (
        <div className="bg-[#1B4F72] text-white rounded-lg p-5">
          <h3 className="font-semibold mb-1">Weekly digest</h3>
          <p className="text-blue-200 text-sm mb-3">Events, new spots, and the market — every week.</p>
          <NewsletterSignup variant="inline" />
        </div>
      )}
    </aside>
  );
}
