'use client';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  filters: FilterOption[];
  active: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function FilterBar({ filters, active, onChange, label }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {label && <span className="text-sm text-[#555555] font-medium mr-1">{label}:</span>}
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            active === f.value
              ? 'bg-[#1B4F72] text-white'
              : 'bg-[#F0F4F8] text-[#555555] hover:bg-[#E2E8F0]'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
