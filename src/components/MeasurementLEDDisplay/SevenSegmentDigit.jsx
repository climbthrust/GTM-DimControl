import React from 'react';

export default function SevenSegmentDigit({ char, color = '#f20d0d' }) {
  const active = getActiveSegments(char); // => Set mit Buchstaben 'A'..'G'

  return (
    <svg
      width='80'
      height='140'
      viewBox='0 0 253 447'
      xmlns='http://www.w3.org/2000/svg'
      style={{ display: 'block' }}
    >
      <g transform='matrix(1,0,0,1,-130.836,-32.6263)'>
        {/* A (oben, horizontal) */}
        <path
          d='M317.786,90.791L196.993,90.791L144.517,38.315C149.029,35.462 154.292,33.913 159.715,33.913L355.063,33.913C360.486,33.913 365.75,35.462 370.262,38.315L317.786,90.791Z'
          fill={color}
          fillOpacity={active.has('A') ? 1 : 0.1}
          stroke='none'
        />
        {/* B (oben rechts, vertikal) */}
        <g transform='matrix(6.00146e-17,1,-1,6.00146e-17,415.591,-99.2025)'>
          <path
            d='M347.194,61.382L317.786,90.791L196.993,90.791L144.517,38.315C149.029,35.462 154.292,33.913 159.715,33.913L319.725,33.913L347.194,61.382Z'
            fill={color}
            fillOpacity={active.has('B') ? 1 : 0.1}
            stroke='none'
          />
        </g>
        {/* C (oben links, vertikal) */}
        <g transform='matrix(-6.00146e-17,1,1,6.00146e-17,98.2093,-99.2025)'>
          <path
            d='M347.194,61.382L317.786,90.791L196.993,90.791L144.517,38.315C149.029,35.462 154.292,33.913 159.715,33.913L319.725,33.913L347.194,61.382Z'
            fill={color}
            fillOpacity={active.has('C') ? 1 : 0.1}
            stroke='none'
          />
        </g>
        {/* D (unten, horizontal) */}
        <g transform='matrix(1,0,0,-1,0,511.992)'>
          <path
            d='M317.786,90.791L196.993,90.791L144.517,38.315C149.029,35.462 154.292,33.913 159.715,33.913L355.063,33.913C360.486,33.913 365.75,35.462 370.262,38.315L317.786,90.791Z'
            fill={color}
            fillOpacity={active.has('D') ? 1 : 0.1}
            stroke='none'
          />
        </g>
        {/* E (unten rechts, vertikal) */}
        <g transform='matrix(6.00146e-17,-1,-1,-6.00146e-17,415.591,611.194)'>
          <path
            d='M347.194,61.382L317.786,90.791L196.993,90.791L144.517,38.315C149.029,35.462 154.292,33.913 159.715,33.913L319.725,33.913L347.194,61.382Z'
            fill={color}
            fillOpacity={active.has('E') ? 1 : 0.1}
            stroke='none'
          />
        </g>
        {/* F (unten links, vertikal) */}
        <g transform='matrix(-6.00146e-17,-1,1,-6.00146e-17,98.2093,611.194)'>
          <path
            d='M347.194,61.382L317.786,90.791L196.993,90.791L144.517,38.315C149.029,35.462 154.292,33.913 159.715,33.913L319.725,33.913L347.194,61.382Z'
            fill={color}
            fillOpacity={active.has('F') ? 1 : 0.1}
            stroke='none'
          />
        </g>
        {/* G (Mitte, horizontal) */}
        <g transform='matrix(-1,-1.23682e-16,1.23682e-16,-1,513.793,317.391)'>
          <path
            d='M347.186,61.391L317.786,90.791L196.993,90.791L167.593,61.391L196.993,31.991L317.786,31.991L347.186,61.391Z'
            fill={color}
            fillOpacity={active.has('G') ? 1 : 0.1}
            stroke='none'
          />
        </g>
      </g>
    </svg>
  );
}

/** Liefert ein Set der aktiven Segmente ('A'..'G') für das übergebene Zeichen. */
function getActiveSegments(char) {
  const map = {
    0: ['A', 'B', 'C', 'D', 'E', 'F'],
    1: ['B', 'E'],
    2: ['A', 'B', 'D', 'F', 'G'],
    3: ['A', 'B', 'D', 'E', 'G'],
    4: ['B', 'C', 'E', 'G'],
    5: ['A', 'C', 'D', 'E', 'G'],
    6: ['A', 'C', 'D', 'E', 'F', 'G'],
    7: ['A', 'B', 'E'],
    8: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    9: ['A', 'B', 'C', 'D', 'E', 'G'],
    '-': ['G'],
    ' ': [],
  };
  const key = String(char ?? '').trim();
  return new Set(map[key] ?? []);
}
