import React from 'react';

const GTMImage = ({ width, imgUrl, name, bordered = true }) => {
  return (
    <div
      className={`${width} ${
        bordered && 'border border-gtm-gray-700  bg-gtm-gray-800'
      } rounded-md flex items-center justify-center overflow-hidden`}
    >
      {imgUrl ? (
        <img
          src={imgUrl}
          alt={name || 'Produktbild'}
          className='max-w-full max-h-full object-contain rounded'
        />
      ) : (
        <p className='text-gtm-text-400'>Kein Bild</p>
      )}
    </div>
  );
};

export default GTMImage;
