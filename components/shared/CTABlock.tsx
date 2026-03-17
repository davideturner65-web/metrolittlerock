interface CTABlockProps {
  heading: string;
  body: string;
  button_text: string;
  href?: string;
  variant?: 'primary' | 'warm';
}

export default function CTABlock({ heading, body, button_text, href = '/contact', variant = 'primary' }: CTABlockProps) {
  const bg = variant === 'warm' ? 'bg-[#D4740A]' : 'bg-[#1B4F72]';
  const btn = variant === 'warm' ? 'bg-white text-[#D4740A] hover:bg-gray-100' : 'bg-[#D4740A] text-white hover:bg-[#B8620A]';

  return (
    <div className={`${bg} text-white rounded-xl p-8`}>
      <h2 className="text-2xl font-bold mb-3">{heading}</h2>
      <p className="text-blue-100 mb-6 max-w-xl">{body}</p>
      <a
        href={href}
        className={`inline-block px-6 py-3 font-semibold rounded-lg transition-colors ${btn}`}
      >
        {button_text}
      </a>
    </div>
  );
}
