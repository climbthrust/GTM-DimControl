import React from 'react';

const Frame = ({ children, highlighted = false }) => {
  return (
    <div
      className={
        'relative w-full h-full rounded p-4 border-4 transition-all duration-200 ' +
        (highlighted
          ? 'border-gtm-accent-400'
          : 'border-transparent before:content-[""] before:absolute before:inset-[-3px] before:rounded before:border before:border-gtm-gray-700 before:pointer-events-none')
      }
    >
      {children}
    </div>
  );
};

export default Frame;
