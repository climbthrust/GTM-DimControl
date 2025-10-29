import React from 'react';
import Frame from './Frame';
import GTMButton from './basics/GTMButton';

const SaveReport = ({ highlighted, mode }) => {
  return (
    <div>
      <Frame highlighted={highlighted}>
        <div className='flex justify-center items-center'>
          <GTMButton active={mode == 'save'} disabled={mode == 'product'}>
            Messungen speichern
          </GTMButton>
        </div>
      </Frame>
    </div>
  );
};

export default SaveReport;
