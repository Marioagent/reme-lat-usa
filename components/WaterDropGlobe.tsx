"use client";

export default function WaterDropGlobe() {
  return (
    <div
      className="fixed top-24 right-4 sm:right-8 md:right-12 z-50 pointer-events-none animate-float"
      style={{
        filter: "drop-shadow(0 10px 30px rgba(59, 130, 246, 0.8))",
      }}
    >
      <svg
        width="150"
        height="170"
        viewBox="0 0 180 200"
        xmlns="http://www.w3.org/2000/svg"
        className="sm:w-[180px] sm:h-[200px] md:w-[220px] md:h-[250px]"
      >
        <defs>
          {/* Gradiente de agua */}
          <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="1" />
          </linearGradient>

          {/* Gradiente para el continente */}
          <linearGradient id="continentGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#059669" stopOpacity="1" />
          </linearGradient>

          {/* Filtro de brillo acuoso */}
          <filter id="waterGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Máscara de gota */}
          <clipPath id="dropClip">
            <path d="M90,10
                     C90,10 140,70 140,110
                     C140,145 118,170 90,170
                     C62,170 40,145 40,110
                     C40,70 90,10 90,10 Z" />
          </clipPath>
        </defs>

        {/* Forma de gota de agua con degradado */}
        <path
          d="M90,10
             C90,10 140,70 140,110
             C140,145 118,170 90,170
             C62,170 40,145 40,110
             C40,70 90,10 90,10 Z"
          fill="url(#waterGradient)"
          filter="url(#waterGlow)"
          opacity="0.95"
        />

        {/* Contenido dentro de la gota - Continente Americano simplificado */}
        <g clipPath="url(#dropClip)">
          {/* América del Norte */}
          <path
            d="M75,45 L85,42 L95,40 L105,42 L110,48 L108,55 L100,58 L95,60 L90,58 L85,56 L80,52 L75,48 Z"
            fill="url(#continentGradient)"
            opacity="0.85"
          />

          {/* América Central (istmo) */}
          <path
            d="M90,60 L92,65 L93,70 L92,75 L90,78 Z"
            fill="url(#continentGradient)"
            opacity="0.85"
          />

          {/* América del Sur */}
          <path
            d="M88,78 L95,82 L100,90 L102,100 L100,110 L95,120 L88,128 L82,132 L75,130 L72,122 L70,110 L72,100 L75,90 L80,82 Z"
            fill="url(#continentGradient)"
            opacity="0.85"
          />

          {/* Puntos de brillo acuoso (efecto de luz) */}
          <circle cx="70" cy="50" r="8" fill="white" opacity="0.4">
            <animate
              attributeName="opacity"
              values="0.3;0.6;0.3"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="55" cy="70" r="5" fill="white" opacity="0.3">
            <animate
              attributeName="opacity"
              values="0.2;0.5;0.2"
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* Borde brillante de la gota */}
        <path
          d="M90,10
             C90,10 140,70 140,110
             C140,145 118,170 90,170
             C62,170 40,145 40,110
             C40,70 90,10 90,10 Z"
          fill="none"
          stroke="white"
          strokeWidth="2"
          opacity="0.6"
        />

        {/* Reflejo de luz superior */}
        <ellipse
          cx="85"
          cy="35"
          rx="15"
          ry="10"
          fill="white"
          opacity="0.4"
          clipPath="url(#dropClip)"
        />
      </svg>
    </div>
  );
}
