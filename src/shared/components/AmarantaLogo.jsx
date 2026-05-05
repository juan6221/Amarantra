export default function AmarantaLogo({ size = 'md', variant = 'full' }) {
  const sizes = {
    sm: { icon: 28, text: 'text-lg' },
    md: { icon: 40, text: 'text-2xl' },
    lg: { icon: 56, text: 'text-3xl md:text-4xl' },
    xl: { icon: 80, text: 'text-4xl md:text-5xl' },
  }
  const s = sizes[size] || sizes.md

  return (
    <div className="flex items-center gap-3">
      <svg width={s.icon} height={s.icon} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" />
            <stop offset="50%" stopColor="#f3d97a" />
            <stop offset="100%" stopColor="#b8960c" />
          </linearGradient>
        </defs>
        {/* Pétalo superior */}
        <ellipse cx="28" cy="14" rx="5" ry="11" fill="url(#goldGrad)" opacity="0.9" transform="rotate(0 28 28)" />
        {/* Pétalo superior-derecha */}
        <ellipse cx="28" cy="14" rx="5" ry="11" fill="url(#goldGrad)" opacity="0.85" transform="rotate(45 28 28)" />
        {/* Pétalo derecha */}
        <ellipse cx="28" cy="14" rx="5" ry="11" fill="url(#goldGrad)" opacity="0.8" transform="rotate(90 28 28)" />
        {/* Pétalo inferior-derecha */}
        <ellipse cx="28" cy="14" rx="5" ry="11" fill="url(#goldGrad)" opacity="0.75" transform="rotate(135 28 28)" />
        {/* Pétalo inferior */}
        <ellipse cx="28" cy="14" rx="5" ry="11" fill="url(#goldGrad)" opacity="0.9" transform="rotate(180 28 28)" />
        {/* Pétalo inferior-izquierda */}
        <ellipse cx="28" cy="14" rx="5" ry="11" fill="url(#goldGrad)" opacity="0.85" transform="rotate(225 28 28)" />
        {/* Pétalo izquierda */}
        <ellipse cx="28" cy="14" rx="5" ry="11" fill="url(#goldGrad)" opacity="0.8" transform="rotate(270 28 28)" />
        {/* Pétalo superior-izquierda */}
        <ellipse cx="28" cy="14" rx="5" ry="11" fill="url(#goldGrad)" opacity="0.75" transform="rotate(315 28 28)" />
        {/* Centro */}
        <circle cx="28" cy="28" r="6" fill="url(#goldGrad)" />
        <circle cx="28" cy="28" r="3" fill="#fdf8e7" opacity="0.6" />
      </svg>
      {variant === 'full' && (
        <span className={`font-serif font-bold tracking-widest ${s.text} text-transparent bg-clip-text`}
          style={{ backgroundImage: 'linear-gradient(135deg, #d4af37 0%, #f3d97a 50%, #b8960c 100%)' }}>
          AMARANTA
        </span>
      )}
    </div>
  )
}
