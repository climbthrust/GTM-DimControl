import React from 'react';
import { RotateCcw, Check, ChevronUp, ChevronDown } from 'lucide-react';

/**
 * GTMButton
 * Einheitlicher Button für DimControl
 *
 * Props:
 * - icon: 'reset' | 'ok' | 'up' | 'down'
 * - active: bool (leuchtet in Accentfarbe, z. B. bei OK-Button aktiv)
 * - disabled: bool (deaktiviert Interaktion)
 * - title: string (Tooltip)
 * - onClick: function
 * - size: number (optional, default = 36)
 * - ...rest: alle weiteren Event-Handler (z. B. onMouseDown, onTouchStart)
 */
export default function GTMButton({
  icon = 'reset',
  active = false,
  disabled = false,
  title = '',
  onClick,
  size = 36,
  ...rest
}) {
  const icons = {
    reset: RotateCcw,
    ok: Check,
    up: ChevronUp,
    down: ChevronDown,
  };
  const IconComponent = icons[icon] || RotateCcw;

  const base =
    'flex items-center justify-center border rounded-md select-none transition duration-300';
  const stateClass = disabled
    ? 'border-gtm-gray-700 text-gtm-gray-700'
    : active
    ? 'bg-gtm-accent-500 hover:bg-gtm-accent-600 text-gtm-text-900 border-gtm-accent-500'
    : 'border-gtm-gray-700 text-gtm-gray-700 hover:bg-gtm-accent-600';

  return (
    <button
      type='button'
      title={title}
      disabled={disabled}
      onClick={onClick}
      {...rest} // ⬅️ alle weiteren Events (mouse/touch)
      className={`${base} ${stateClass}`}
      style={{ width: size, height: size }}
    >
      <IconComponent size={18} />
    </button>
  );
}
