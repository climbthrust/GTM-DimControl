import React from 'react';
import Frame from './Frame';

const MainGrid = () => {
  return (
    <div className='grid grid-rows-2 gap-4 p-4 w-screen h-screen'>
      <Frame />
      <Frame />
    </div>
  );
};

export default MainGrid;
