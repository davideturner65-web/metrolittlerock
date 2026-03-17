interface BadgeProps {
  label: string;
  variant?: 'primary' | 'accent' | 'warm' | 'success' | 'neutral';
}

const variantMap = {
  primary: 'bg-[#1B4F72] text-white',
  accent: 'bg-[#2E86C1] text-white',
  warm: 'bg-[#D4740A] text-white',
  success: 'bg-[#1E8449] text-white',
  neutral: 'bg-[#F0F4F8] text-[#555555]',
};

export default function Badge({ label, variant = 'neutral' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantMap[variant]}`}>
      {label}
    </span>
  );
}
