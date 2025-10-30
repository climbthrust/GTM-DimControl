import React, { useMemo, useEffect } from 'react';
import MeasurementTool from './MeasurementTool';
import { getPrecisionSettings } from '../../utils/getPrecisionSettings';
import MeasurementDisplay from './MeasurementDisplay';

export default function MeasurementFrame({
  dim,
  onSave,
  onNext,
  measurementTools = [],
}) {
  // Falls dim null, undefined oder leer → mit Defaults füllen
  if (!dim || Object.keys(dim).length === 0) {
    dim = {
      id: null,
      nominal: 0,
      tol_plus: 0.1,
      tol_minus: 0.1,
      measuredValue: '',
      unit: '',
      measurement_tool_id: null,
    };
  }

  const {
    id,
    nominal,
    tol_plus,
    tol_minus,
    measuredValue,
    unit,
    measurement_tool_id,
  } = dim;

  // === Anzeigepräzision ====================================================
  const { displayDecimals } = useMemo(() => {
    try {
      return getPrecisionSettings(tol_plus, tol_minus);
    } catch {
      return { displayDecimals: 3 };
    }
  }, [tol_plus, tol_minus]);

  // === Hilfsfunktionen =====================================================
  function getDecimalCount(num) {
    if (!isFinite(num)) return 0;
    let e = 1,
      p = 0;
    while (Math.round(num * e) / e !== num) {
      e *= 10;
      p++;
      if (p > 10) break;
    }
    return p;
  }

  function getStep() {
    const tp = Math.abs(tol_plus ?? 0);
    const tm = Math.abs(tol_minus ?? 0);
    if ((!isFinite(tp) || tp <= 0) && (!isFinite(tm) || tm <= 0)) return 0.001;
    const dp = getDecimalCount(tp);
    const dm = getDecimalCount(tm);
    return Math.pow(10, -(Math.max(dp, dm) + 1));
  }

  const handleConfirm = confirmedValue => {
    onSave?.(id, confirmedValue);
    onNext?.();
  };

  const handleReset = () => {
    onSave?.(id, null);
  };

  return (
    <div className='grid grid-cols-[1fr_minmax(240px,1fr)] w-full h-64 gap-2'>
      <div
        className='flex flex-col justify-between p-4 border border-gtm-gray-700 rounded-sm bg-gtm-gray-900'
        // onKeyDown={handleKeyDown}
      >
        <MeasurementDisplay
          nominal={nominal}
          tolPlus={tol_plus}
          tolMinus={tol_minus}
          value={measuredValue === null ? '' : String(measuredValue)}
          unit={unit}
          step={getStep()}
          onConfirm={handleConfirm}
          displayDecimals={displayDecimals}
          onReset={handleReset}
          disabled={!dim || !dim.id}
        />
      </div>

      <MeasurementTool
        tool={measurementTools.find(t => t.id === measurement_tool_id) || null}
        connectedDeviceId={null}
        dimension={dim}
      />
    </div>
  );
}
