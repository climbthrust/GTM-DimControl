import React from 'react';

export default function DecimalPoint({ color = '#f20d0d' }) {
  return (
    <svg
      viewBox='0 0 84 447'
      xmlns='http://www.w3.org/2000/svg'
      preserveAspectRatio='xMidYMid meet'
      style={{
        display: 'block',
        width: '33.3%', // ← füllt Parent aus
        height: '100%', // ← skaliert mit Höhe
        flex: '1 1 auto', // ← lässt sich flexibel dehnen
      }}
    >
      {/* Dezimalpunkt */}

      <circle cx='45' cy='412' r='32' fill={color} opacity='1' />
    </svg>
  );
}
