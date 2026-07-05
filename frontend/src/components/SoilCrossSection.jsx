import React from "react";

const SoilCrossSection = () => (
  <svg viewBox="0 0 420 420" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FCF4E1" />
        <stop offset="100%" stopColor="#EFD394" />
      </linearGradient>
    </defs>

    <rect x="0" y="0" width="420" height="110" fill="url(#sky)" />
    {/* sun */}
    <circle cx="340" cy="55" r="28" fill="#D9AB3C" opacity="0.85" />

    {/* simple crop rows on surface */}
    {[40, 110, 180, 250, 320].map((x, i) => (
      <g key={i}>
        <line x1={x} y1="108" x2={x} y2="78" stroke="#2A4F32" strokeWidth="4" strokeLinecap="round" />
        <circle cx={x} cy="74" r="9" fill="#3D6B45" />
      </g>
    ))}

    {/* Topsoil */}
    <rect x="0" y="110" width="420" height="90" fill="#A75D3A" />
    <text x="20" y="160" fontFamily="JetBrains Mono, monospace" fontSize="13" fill="#FAF6EE" opacity="0.85">
      Topsoil — N · P · K
    </text>

    {/* Subsoil */}
    <rect x="0" y="200" width="420" height="110" fill="#8A4A2C" />
    <text x="20" y="260" fontFamily="JetBrains Mono, monospace" fontSize="13" fill="#FAF6EE" opacity="0.85">
      Subsoil — pH · Moisture
    </text>

    {/* Bedrock */}
    <rect x="0" y="310" width="420" height="110" fill="#162C20" />
    <text x="20" y="370" fontFamily="JetBrains Mono, monospace" fontSize="13" fill="#EFD394" opacity="0.9">
      Bedrock — Soil Grade A
    </text>

    {/* root system */}
    <path
      d="M210 78 C 205 130, 230 150, 215 200 C 205 240, 235 260, 225 305"
      stroke="#F4E7C6"
      strokeWidth="3"
      fill="none"
      opacity="0.7"
    />
    <path
      d="M210 78 C 215 130, 190 150, 205 200"
      stroke="#F4E7C6"
      strokeWidth="2.5"
      fill="none"
      opacity="0.55"
    />
  </svg>
);

export default SoilCrossSection;
