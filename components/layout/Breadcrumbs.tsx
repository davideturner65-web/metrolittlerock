import Link from 'next/link';

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  crumbs: Crumb[];
}

export default function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-[#555555]">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-[#1B4F72] transition-colors">Home</Link>
        </li>
        {crumbs.map((crumb, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <span className="text-gray-300">/</span>
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-[#1B4F72] transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-[#1C1C1C] font-medium">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
