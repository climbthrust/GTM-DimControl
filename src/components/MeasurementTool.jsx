import React from 'react';
import {
  Bluetooth,
  BluetoothOff,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import GTMImage from './GTMImage';

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
  let btStatus = 'none'; // none | correct | wrong
  if (connectedDeviceId) {
    btStatus = connectedDeviceId === bluetooth_id ? 'correct' : 'wrong';
  }

  return (
    <div className='w-full h-full p-3 text-lg text-gtm-gray-300 rounded-md border border-gtm-gray-700 bg-gtm-gray-800 flex flex-col gap-4 items-center'>
      {/* Name */}
      <div className='text-xl font-semibold'>{name || '–'}</div>

      {/* Hauptbereich */}
      <div className='flex w-full h-full items-center gap-4'>
        {/* linke Seite: Status */}
        <div className='flex flex-col items-start justify-center gap-2 min-w-[120px]'>
          {/* Bluetooth Status */}
          <div className='flex items-center gap-2'>
            {btStatus === 'correct' && (
              <Bluetooth className='w-5 h-5 text-gtm-blue-500' />
            )}
            {btStatus === 'wrong' && (
              <Bluetooth className='w-5 h-5 text-gtm-fail-500' />
            )}
            {btStatus === 'none' && (
              <BluetoothOff className='w-5 h-5 text-gtm-fail-500' />
            )}
            <span className='text-sm'>
              {btStatus === 'correct'
                ? 'Verbunden'
                : btStatus === 'wrong'
                ? 'Falsches Gerät'
                : 'Keine Verbindung'}
            </span>
          </div>

          {/* Kalibrierung */}
          <div className='flex items-center gap-2'>
            {isValid ? (
              <CheckCircle className='w-4 h-4 text-gtm-ok-500' />
            ) : (
              <AlertCircle className='w-4 h-4 text-gtm-fail-500' />
            )}
            <span
              className={`font-medium text-sm ${
                isValid ? 'text-gtm-ok-500' : 'text-gtm-fail-500'
              }`}
            >
              {valid_until || '–'}
            </span>
          </div>

          {/* optional: Notes */}
          <div className='text-sm text-gtm-gray-400 italic min-h-[1em]'>
            {notes || ''}
          </div>
        </div>

        {/* rechte Seite: Bild (immer Platzhalter zeigen, falls kein Bild) */}
        <div className='flex-grow'>
          <GTMImage
            width='w-full'
            imgUrl={imgUrl}
            name={name}
            bordered={false}
          />
        </div>
      </div>
    </div>
  );
};

export default MeasurementTool;
