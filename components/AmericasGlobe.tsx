"use client";

export default function AmericasGlobe() {
  return (
    <svg
      width="45"
      height="45"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="americas-globe"
    >
      <defs>
        {/* Gradiente para el océano - azul brillante */}
        <radialGradient id="oceanGradient" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#00A8E8" stopOpacity="1" />
          <stop offset="70%" stopColor="#0077BE" stopOpacity="1" />
          <stop offset="100%" stopColor="#005A8C" stopOpacity="0.95" />
        </radialGradient>

        {/* Gradiente para América del Norte - verde esmeralda */}
        <linearGradient id="northAmericaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00D084" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#00A868" stopOpacity="1" />
        </linearGradient>

        {/* Gradiente para América Central - verde lima */}
        <linearGradient id="centralAmericaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7FFF00" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#66CC00" stopOpacity="1" />
        </linearGradient>

        {/* Gradiente para América del Sur - verde tropical */}
        <linearGradient id="southAmericaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00C853" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#00A344" stopOpacity="1" />
        </linearGradient>

        {/* Sombra y profundidad */}
        <filter id="shadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
          <feOffset dx="1" dy="1" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Brillo highlight */}
        <radialGradient id="highlight" cx="35%" cy="35%">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Esfera base (océano) */}
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="url(#oceanGradient)"
        filter="url(#shadow)"
      />

      {/* América del Norte */}
      <path
        d="M 35,20
           L 42,18 L 50,16 L 58,18 L 63,22
           L 65,28 L 63,33 L 58,36 L 52,38
           L 47,36 L 42,33 L 38,28 Z"
        fill="url(#northAmericaGradient)"
        stroke="white"
        strokeWidth="0.5"
        opacity="0.95"
      />

      {/* Alaska (pequeño detalle) */}
      <ellipse
        cx="28"
        cy="18"
        rx="4"
        ry="3"
        fill="url(#northAmericaGradient)"
        stroke="white"
        strokeWidth="0.3"
        opacity="0.9"
      />

      {/* Groenlandia (pequeño detalle) */}
      <ellipse
        cx="68"
        cy="15"
        rx="5"
        ry="4"
        fill="url(#northAmericaGradient)"
        stroke="white"
        strokeWidth="0.3"
        opacity="0.85"
      />

      {/* México y América Central */}
      <path
        d="M 47,38
           L 50,40 L 53,43 L 54,47
           L 53,50 L 51,52 L 48,53
           L 45,51 L 44,48 L 45,44 Z"
        fill="url(#centralAmericaGradient)"
        stroke="white"
        strokeWidth="0.5"
        opacity="0.95"
      />

      {/* Istmo centroamericano */}
      <path
        d="M 48,53 L 50,56 L 51,59 L 50,61 L 48,62 L 46,60 L 45,57 Z"
        fill="url(#centralAmericaGradient)"
        stroke="white"
        strokeWidth="0.4"
        opacity="0.92"
      />

      {/* América del Sur */}
      <path
        d="M 48,62
           L 52,65 L 56,70 L 58,76
           L 58,82 L 56,88 L 52,92
           L 46,95 L 40,94 L 36,90
           L 34,84 L 34,77 L 36,70
           L 40,65 L 44,63 Z"
        fill="url(#southAmericaGradient)"
        stroke="white"
        strokeWidth="0.5"
        opacity="0.95"
      />

      {/* Brasil (extensión este) */}
      <ellipse
        cx="52"
        cy="80"
        rx="8"
        ry="12"
        fill="url(#southAmericaGradient)"
        stroke="white"
        strokeWidth="0.4"
        opacity="0.9"
      />

      {/* Islas del Caribe */}
      <circle cx="58" cy="48" r="1.5" fill="url(#centralAmericaGradient)" stroke="white" strokeWidth="0.3" />
      <circle cx="62" cy="47" r="1.2" fill="url(#centralAmericaGradient)" stroke="white" strokeWidth="0.3" />
      <circle cx="60" cy="50" r="1" fill="url(#centralAmericaGradient)" stroke="white" strokeWidth="0.3" />
      <ellipse cx="65" cy="49" rx="2" ry="1.5" fill="url(#centralAmericaGradient)" stroke="white" strokeWidth="0.3" />

      {/* Efecto de brillo superior */}
      <ellipse
        cx="40"
        cy="35"
        rx="25"
        ry="20"
        fill="url(#highlight)"
        opacity="0.5"
      />

      {/* Borde del globo */}
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.5"
      />

      <style jsx>{`
        .americas-globe {
          animation: rotate-globe 20s linear infinite;
          filter: drop-shadow(0 2px 8px rgba(0, 119, 190, 0.4));
        }

        @keyframes rotate-globe {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </svg>
  );
}
