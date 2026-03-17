interface ComparisonMetric {
  category: string;
  a_value: string;
  b_value: string;
  winner: 'a' | 'b' | 'tie';
  notes: string;
}

interface ComparisonTableProps {
  name_a: string;
  name_b: string;
  metrics: ComparisonMetric[];
}

export default function ComparisonTable({ name_a, name_b, metrics }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#1B4F72] text-white">
            <th className="text-left px-4 py-3 w-1/4">Category</th>
            <th className="text-left px-4 py-3 w-1/3">{name_a}</th>
            <th className="text-left px-4 py-3 w-1/3">{name_b}</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((m, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FA]'}>
              <td className="px-4 py-3 font-medium text-[#1C1C1C]">{m.category}</td>
              <td className={`px-4 py-3 ${m.winner === 'a' ? 'font-semibold text-[#1E8449]' : 'text-[#555555]'}`}>
                {m.winner === 'a' && <span className="mr-1">★</span>}{m.a_value}
              </td>
              <td className={`px-4 py-3 ${m.winner === 'b' ? 'font-semibold text-[#1E8449]' : 'text-[#555555]'}`}>
                {m.winner === 'b' && <span className="mr-1">★</span>}{m.b_value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
