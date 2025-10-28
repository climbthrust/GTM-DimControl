import React, { useMemo } from 'react';
import SevenSegmentDigit from './SevenSegmentDigit';
import DecimalPoint from './DecimalPoint';

export default function MeasurementLedPanel({
  nominal,
  tolPlus,
  tolMinus,
  value,
  state,
  width,
}) {
  // === Layout-Konstanten (zentral änderbar) ================================
  const PANEL_WIDTH = width; // px
  const PANEL_HEIGHT = 100; // px
  const CONTENT_WIDTH = 0.9; // 90 % des Panels
  const CONTENT_HEIGHT = 0.7; // 70 % des Panels
  const DIGIT_GAP_REM = 0.6; // Abstand zwischen Ziffern in rem
  const BORDER_COLOR = '#3f3f46'; // gtm-gray-700
  const BOX_SHADOW = 'inset 0 0 20px rgba(255,255,255,0.05)';

  // === Farben je nach Zustand ==============================================
  const ledColor =
    state === 'ok' ? '#00ff66' : state === 'fail' ? '#ff3333' : '#a0a0a0';

  // === Formatierte Anzeige ==================================================
  const formatted = useMemo(() => {
    const num = Number.isFinite(value) ? value : 0;
    const fixed = num.toFixed(3);
    const [L, R] = fixed.split('.');
    return {
      left: (L ?? '').padStart(4, ' '),
      right: (R ?? '').padEnd(3, '0'),
    };
  }, [value]);

  // === Render ===============================================================
  return (
    // <div className='flex items-center justify-center w-full h-full'>
    <div
      className='relative bg-black rounded-md flex items-center justify-center overflow-hidden'
      style={{
        width: `${PANEL_WIDTH}px`,
        height: `${PANEL_HEIGHT}px`,
        border: `1px solid ${BORDER_COLOR}`,
        boxShadow: BOX_SHADOW,
      }}
    >
      <div
        className='flex items-center justify-center'
        style={{
          gap: `${DIGIT_GAP_REM}rem`,
          width: `${CONTENT_WIDTH * 100}%`,
          height: `${CONTENT_HEIGHT * 100}%`,
        }}
      >
        {formatted.left.split('').map((char, i) => (
          <SevenSegmentDigit key={`L${i}`} char={char} color={ledColor} />
        ))}
        <DecimalPoint color={ledColor} />
        {formatted.right.split('').map((char, i) => (
          <SevenSegmentDigit key={`R${i}`} char={char} color={ledColor} />
        ))}
      </div>
    </div>
    // </div>
  );
}
