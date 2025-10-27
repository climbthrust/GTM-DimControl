import React, { useMemo } from 'react';
import MeasurementTool from './MeasurementTool';
import { getPrecisionSettings } from '../../utils/getPrecisionSettings';
import MeasurementDisplay from './MeasurementDisplay';

export default function MeasurementFrame({
  dim,
  onSave,
  onNext,
  measurementTools,
  onMoveUp,
  onMoveDown,
}) {
  // === Anzeigepräzision (falls benötigt) ==================================
  const { displayDecimals } = useMemo(
    () => getPrecisionSettings(dim.tol_plus, dim.tol_minus),
    [dim.tol_plus, dim.tol_minus]
  );

  // === Hilfsfunktion: Dezimalstellen zählen ===============================
  function getDecimalCount(num) {
    if (!isFinite(num)) return 0;
    let e = 1;
    let p = 0;
    while (Math.round(num * e) / e !== num) {
      e *= 10;
      p++;
      if (p > 10) break; // Sicherheitsgrenze
    }
    return p;
  }

  // === Schrittweite bestimmen =============================================
  function getStep(dim) {
    const tp = Math.abs(dim.tol_plus ?? 0);
    const tm = Math.abs(dim.tol_minus ?? 0);
    if ((!isFinite(tp) || tp <= 0) && (!isFinite(tm) || tm <= 0)) return 0.001;

    const dp = getDecimalCount(tp);
    const dm = getDecimalCount(tm);

    const finerDecimals = Math.max(dp, dm); // mehr Dezimalstellen = feinere Toleranz
    const step = Math.pow(10, -(finerDecimals + 1));
    return step;
  }

  // === Tastatursteuerung ==================================================
  const handleKeyDown = e => {
    switch (e.key) {
      case 'Enter':
      case 'Tab':
        e.preventDefault();
        onNext && onNext();
        break;
      case 'ArrowDown':
        e.preventDefault();
        onMoveDown && onMoveDown();
        break;
      case 'ArrowUp':
        e.preventDefault();
        onMoveUp && onMoveUp();
        break;
      default:
        break;
    }
  };

  // === Confirm-Handler ====================================================
  const handleConfirm = confirmedValue => {
    onSave(dim.id, confirmedValue);
  };

  return (
    <div className='grid grid-cols-[1fr_minmax(240px,1fr)] w-full h-64 gap-2'>
      <div
        className='flex flex-col justify-between p-4 border border-gtm-gray-700 rounded-sm bg-gtm-gray-900'
        onKeyDown={handleKeyDown}
      >
        <MeasurementDisplay
          nominal={dim.nominal}
          tolPlus={dim.tol_plus}
          tolMinus={dim.tol_minus}
          value={
            dim.measuredValue === null || dim.measuredValue === undefined
              ? ''
              : String(dim.measuredValue)
          }
          unit={dim.unit}
          step={getStep(dim)} // ✅ genaue Schrittweite aus der Regel
          onConfirm={handleConfirm}
          displayDecimals={displayDecimals}
          onReset={() => onSave(dim.id, null)}
        />
      </div>

      <MeasurementTool
        tool={measurementTools.find(t => t.id === dim.measurement_tool_id)}
        connectedDeviceId={null}
      />
    </div>
  );
}
