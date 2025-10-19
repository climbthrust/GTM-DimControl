import React from 'react';

const Notes = ({ notes }) => {
  return (
    <div className='w-full h-auto p-2 text-lg text-gtm-gray-300 rounded-md border-gtm-gray-700 bg-gtm-gray-800 border'>
      {notes}
    </div>
  );
};

export default Notes;
