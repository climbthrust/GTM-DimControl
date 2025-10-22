import React from 'react';

const Notes = ({ children, emphasized = true, compact = false }) => {
  return (
    <div
      className={`${
        compact ? 'w-fit' : 'w-full'
      } h-auto p-2 text-lg text-gtm-gray-300 rounded-sm border-gtm-gray-700 ${
        emphasized && 'bg-gtm-gray-800'
      }  border`}
    >
      {children}
    </div>
  );
};

export default Notes;
