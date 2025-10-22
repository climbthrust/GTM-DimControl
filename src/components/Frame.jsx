import React from 'react';

const Frame = ({ children, highlighted = false }) => {
  return (
    <div
      className={
        'w-full h-full rounded p-4 transition-all duration-200 ' +
        (highlighted
          ? 'border-4 border-gtm-accent-400'
          : 'border border-gtm-gray-700')
      }
    >
      {children}
    </div>
  );
};

export default Frame;
