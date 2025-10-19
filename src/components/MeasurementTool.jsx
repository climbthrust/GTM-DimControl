import React from 'react';
import {
  Bluetooth,
  BluetoothOff,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import GTMImage from './GTMImage';

const MeasurementTool = ({
  tool,
  connectedDeviceId, // aktuelle Bluetooth-ID (vom System oder State)
}) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const {
    name,
    bluetooth_id,
    device_type,
    calibration_date,
    valid_until,
    notes,
    image_file_name,
  } = tool;

  const imgUrl =
    BASE_URL && image_file_name
      ? `${BASE_URL}/tools_images/${encodeURIComponent(image_file_name)}`
      : null;

  // --- Kalibrierung gültig? ---
  const isValid =
    valid_until &&
    (() => {
      const [d, m, y] = valid_until.split('.').map(Number);
      return new Date(y, m - 1, d) >= new Date(new Date().setHours(0, 0, 0, 0));
    })();

  // --- Bluetooth-Status ---
  let btStatus = 'none'; // none | correct | wrong
  if (connectedDeviceId) {
    btStatus = connectedDeviceId === bluetooth_id ? 'correct' : 'wrong';
  }

  return (
    <div className='w-full h-auto p-3 text-lg text-gtm-gray-300 rounded-md border border-gtm-gray-700 bg-gtm-gray-800 flex gap-4 items-center'>
      {/* linke Seite: Info */}
      <div className='flex flex-col w-1/2 items-start justify-center gap-2'>
        <div className='flex items-center gap-2'>
          <span className='text-xl font-semibold'>{name || '–'}</span>

          {/* Bluetooth Status Icon */}
          {btStatus === 'correct' && (
            <Bluetooth className='w-5 h-5 text-gtm-blue-500' />
          )}
          {btStatus === 'wrong' && (
            <Bluetooth className='w-5 h-5 text-gtm-fail-500' />
          )}
          {btStatus === 'none' && (
            <BluetoothOff className='w-5 h-5 text-gtm-fail-500' />
          )}
        </div>

        {/* Kalibrierung */}
        <div className='flex items-center gap-2'>
          {isValid ? (
            <CheckCircle className='w-4 h-4 text-gtm-ok-500' />
          ) : (
            <AlertCircle className='w-4 h-4 text-gtm-fail-500' />
          )}
          <span
            className={`font-medium ${
              isValid ? 'text-gtm-ok-500' : 'text-gtm-fail-500'
            }`}
          >
            {valid_until ? `gültig bis ${valid_until}` : '–'}
          </span>
        </div>

        {/* optional: Notes */}
        {notes && (
          <div className='text-sm text-gtm-gray-400 italic'>{notes}</div>
        )}
      </div>

      {/* rechte Seite: Bild */}
      <div className='w-1/2'>
        <GTMImage width='w-full' imgUrl={imgUrl} name={name} bordered={false} />
      </div>
    </div>
  );
};

export default MeasurementTool;
