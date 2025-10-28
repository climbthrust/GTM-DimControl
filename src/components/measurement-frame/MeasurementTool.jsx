// ToDo: Measurement Tool wird zu groß angezeigt und verschiebt StatusBar
import React from 'react';
import {
  Bluetooth,
  BluetoothOff,
  CheckCircle,
  AlertCircle,
  SquarePen,
} from 'lucide-react';
import Notes from '../Notes';
import GTMImage from '../GTMImage';

const MeasurementTool = ({ tool, connectedDeviceId }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // --- sicheres Destructuring ---
  const {
    name = '–',
    bluetooth_id = null,
    device_type = '–',
    calibration_date = null,
    valid_until = null,
    notes = '',
    image_file_name = null,
  } = tool || {};

  // --- sicheres Image-URL ---
  const imgUrl =
    BASE_URL && image_file_name
      ? `${BASE_URL}/tools_images/${encodeURIComponent(image_file_name)}`
      : null;

  // --- Kalibrierung gültig? ---
  let isValid = false;
  if (valid_until && /^\d{2}\.\d{2}\.\d{4}$/.test(valid_until)) {
    const [d, m, y] = valid_until.split('.').map(Number);
    const parsedDate = new Date(y, m - 1, d);
    if (!isNaN(parsedDate)) {
      const today = new Date(new Date().setHours(0, 0, 0, 0));
      isValid = parsedDate >= today;
    }
  }

  // --- Bluetooth-Status ---
  let btStatus = 'correct'; // none | correct | wrong
  if (connectedDeviceId) {
    btStatus = connectedDeviceId === bluetooth_id ? 'correct' : 'wrong';
  }

  return (
    <div className='relative w-full h-full text-lg text-gtm-gray-300 rounded-sm border border-gtm-gray-700 flex flex-col items-center gap-2'>
      {tool ? (
        <div className='flex flex-col h-full w-full items-center justify-between p-2'>
          <div className='text-xl text-center font-semibold mb-2'>
            {name || '–'}
          </div>

          {/* Bild (immer Platzhalter zeigen, falls kein Bild) */}
          <div className='h-28 flex items-center justify-center '>
            {imgUrl ? (
              <img
                src={imgUrl}
                alt={name || 'Bild Mess-Instrument'}
                className='h-full w-auto max-w-full object-contain rounded'
              />
            ) : (
              <p className='text-gtm-gray-400'>Kein Bild</p>
            )}
          </div>
        </div>
      ) : (
        <div className='grow w-full h-full flex items-center justify-center text-gtm-gray-600 italic text-base rounded-sm'>
          Kein Messgerät zugeordnet
        </div>
      )}

      {/* StatusBar */}
      <div className=' bg-gtm-gray-800 w-full p-2 border-t border-gtm-gray-700'>
        <div className='flex items-center justify-between gap-2 w-full'>
          {tool && (
            <div className='flex gap-2'>
              {/* Bluetooth Status */}
              <div className='flex items-center gap-2'>
                {btStatus === 'correct' && (
                  <Bluetooth
                    className='w-5 h-5 rounded-full text-gtm-gray-500 hover:text-gtm-gray-300 hover:bg-gtm-blue-500'
                    strokeWidth={1.5}
                  />
                )}
                {btStatus === 'wrong' && (
                  <BluetoothOff
                    className='w-5 h-5 bg-gtm-fail-600 text-gtm-gray-300 rounded-full border border-gtm-gray-300'
                    strokeWidth={1.5}
                  />
                )}
                {btStatus === 'none' && (
                  <BluetoothOff
                    className='w-5 h-5 bg-gtm-fail-600 text-gtm-gray-300 rounded-full border border-gtm-gray-300'
                    strokeWidth={1.5}
                  />
                )}
              </div>

              {/* Kalibrierung */}
              <div
                className='flex items-center gap-2 '
                title={
                  valid_until
                    ? `Kalibrierung gültig bis ${valid_until}`
                    : 'Kalibrierung abgelaufen'
                }
              >
                {isValid ? (
                  <CheckCircle
                    className='w-5 h-5 rounded-full text-gtm-gray-500 hover:text-gtm-gray-300 hover:bg-gtm-ok-600 '
                    strokeWidth={1.5}
                  />
                ) : (
                  <AlertCircle
                    className='w-5 h-5 bg-gtm-fail-500 text-gtm-gray-300'
                    strokeWidth={1.5}
                  />
                )}
                {/* <span
                className={`font-medium text-sm ${
                  isValid ? 'text-gtm-gray-500' : 'text-gtm-fail-500'
                }`}
              >
                {valid_until || '–'}
              </span> */}
              </div>
            </div>
          )}

          <div className='w-full flex items-center justify-end gap-2'>
            <SquarePen
              className='w-5 h-5 cursor-pointer text-gtm-gray-500 hover:text-gtm-gray-100'
              strokeWidth={1.5}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeasurementTool;
