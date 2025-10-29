import React, { useState, useRef, useEffect } from 'react';

const Notes = ({ children, emphasized = true }) => {
  const [showFull, setShowFull] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef(null);

  // === Truncation check mit kleinem Delay + ResizeObserver ===
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const checkTruncation = () => {
      const truncated = el.scrollHeight > el.clientHeight + 1;
      setIsTruncated(truncated);
    };

    // kurz nach Layoutänderung prüfen (Browser braucht ein Repaint)
    const id = setTimeout(checkTruncation, 50);
    const observer = new ResizeObserver(checkTruncation);
    observer.observe(el);

    return () => {
      clearTimeout(id);
      observer.disconnect();
    };
  }, [children]);

  // === Hover-Events ===
  const handleMouseEnter = () => {
    // if (!isTruncated) return;
    const id = setTimeout(() => setShowFull(true), 600); // 0.6 s Verzögerung
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutId);
    setShowFull(false);
  };

  return (
    <div
      className='relative w-full'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ellipsis-Anzeige */}
      <div
        ref={textRef}
        className={`w-full p-2 text-lg text-gtm-gray-300 rounded-sm border border-gtm-gray-700
          ${emphasized ? 'bg-gtm-gray-800' : ''}
          overflow-hidden line-clamp-2 cursor-default`}
      >
        {children}
      </div>

      {/* Popup mit vollem Text */}
      {showFull && isTruncated && (
        <div className='absolute text-lg left-0 top-0 z-50 w-full bg-gtm-gray-800 border border-gtm-gray-700 rounded-sm p-2 shadow-xl text-gtm-gray-300 whitespace-pre-wrap'>
          {children}
        </div>
      )}
    </div>
  );
};

export default Notes;
