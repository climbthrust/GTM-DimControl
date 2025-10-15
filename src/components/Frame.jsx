import React from 'react';

const Frame = ({ children }) => {
  return (
    <div className='border w-full h-full border-gtm-gray-300 rounded p-4'>
      {children}
    </div>
  );
};

export default Frame;
