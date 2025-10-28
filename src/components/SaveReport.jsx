import React from 'react';
import Frame from './Frame';

const SaveReport = ({ highlighted,mode }) => {
  return (
    <div>
      <Frame highlighted={highlighted}>
        <div className='flex justify-center items-center'>
          <button
            className={`text-xl px-6 py-3 rounded-lg transition-colors cursor-pointer duration-300 ${
              mode == 'save'
                ? ' bg-gtm-accent-500 hover:bg-gtm-accent-400 text-gtm-gray-900'
                : ' bg-gtm-gray-900 text-gtm-gray-300 border border-gtm-accent-500 hover:bg-gtm-accent-500 hover:text-gtm-gray-800'
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
