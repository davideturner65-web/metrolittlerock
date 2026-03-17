interface MiniMapProps {
  lat: number;
  lng: number;
  label?: string;
  zoom?: number;
  height?: number;
}

export default function MiniMap({ lat, lng, label, zoom = 14, height = 300 }: MiniMapProps) {
  const src = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200">
      {label && (
        <div className="bg-[#F0F4F8] px-4 py-2 text-sm font-medium text-[#1C1C1C]">
          {label}
        </div>
      )}
      <iframe
        src={src}
        width="100%"
        height={height}
        style={{ border: 0 }}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={label ?? 'Map'}
      />
    </div>
  );
}
