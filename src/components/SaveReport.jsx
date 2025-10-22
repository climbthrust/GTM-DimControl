import React from 'react';
import Frame from './Frame';

const SaveReport = ({ mode }) => {
  return (
    <div>
      <Frame>
        <div className='flex justify-center items-center'>
          <button
            className={`text-xl px-6 py-3 rounded-lg transition-colors ${
              mode == 'save'
                ? ' bg-gtm-accent-500 hover:bg-gtm-accent-400 cursor-pointer text-gtm-text-900'
                : ' bg-gtm-gray-900 text-gtm-gray-700 cursor-default border border-gtm-gray-700'
            } `}
          >
            Messungen speichern
          </button>
        </div>
      </Frame>
    </div>
  );
};

export default SaveReport;
