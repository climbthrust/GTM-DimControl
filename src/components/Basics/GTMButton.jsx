import React from 'react';
import {
  RotateCcw,
  Check,
  ChevronUp,
  ChevronDown,
  X,
  Plus,
  Minus,
} from 'lucide-react';

/**
 * GTMButton
 * Einheitlicher Button für DimControl
 *
 * Props:
 * - icon: 'reset' | 'ok' | 'up' | 'down' | 'delete' | 'plus' | 'minus'
 * - active: bool (leuchtet in Accentfarbe, z. B. bei OK-Button aktiv)
 * - disabled: bool (deaktiviert Interaktion)
 * - title: string (Tooltip)
 * - onClick: function
 * - size: number (optional, default = 36) → nur für Icon-Buttons
 * - children: Textinhalt (wenn vorhanden, wird kein Icon gezeigt)
 * - ...rest: alle weiteren Event-Handler (z. B. onMouseDown, onTouchStart)
 */
export default function GTMButton({
  icon = 'reset',
  active = false,
  disabled = false,
  title = '',
  onClick,
  size = 36,
  children,
  ...rest
}) {
  const icons = {
    reset: RotateCcw,
    ok: Check,
    up: ChevronUp,
    down: ChevronDown,
    delete: X,
    plus: Plus,
    minus: Minus,
  };
  const IconComponent = icons[icon] || RotateCcw;

  const base =
    'flex items-center justify-center border rounded-md select-none transition duration-300 font-semibold ';
  const stateClass = disabled
    ? 'border-gtm-gray-700 text-gtm-gray-700 cursor-auto'
    : active
    ? 'bg-gtm-accent-500 hover:bg-gtm-accent-300 hover:shadow-lg text-gtm-gray-900 border-gtm-accent-500 active:translate-x-0.5 active:translate-y-0.5'
    : 'border-gtm-gray-700 text-gtm-gray-700 hover:bg-gtm-accent-500 hover:text-gtm-gray-900 hover:shadow-lg active:translate-x-0.5 active:translate-y-0.5';

  const textMode = !!children;
  const textClasses = textMode ? 'text-xl px-6 py-3' : '';
  const style = textMode ? {} : { width: size, height: size };

  return (
    <button
      type='button'
      title={title}
      disabled={disabled}
      onClick={onClick}
      {...rest}
      className={`${base} ${stateClass} ${textClasses}  `}
      style={style}
    >
      {textMode ? children : <IconComponent size={18} />}
    </button>
  );
}
