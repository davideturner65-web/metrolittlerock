interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  color?: 'primary' | 'accent' | 'warm' | 'success';
}

const colorMap = {
  primary: 'border-[#1B4F72]',
  accent: 'border-[#2E86C1]',
  warm: 'border-[#D4740A]',
  success: 'border-[#1E8449]',
};

export default function StatCard({ label, value, subtext, color = 'primary' }: StatCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border-t-4 ${colorMap[color]} p-4`}>
      <p className="text-sm text-[#555555] uppercase tracking-wide font-medium">{label}</p>
      <p className="text-2xl font-bold text-[#1C1C1C] mt-1">{value}</p>
      {subtext && <p className="text-xs text-[#555555] mt-1">{subtext}</p>}
    </div>
  );
}
