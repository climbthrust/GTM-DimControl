import { precisionConfig } from '../config/precisionConfig';

function inferDecimals(n, maxDigits = precisionConfig.maxDecimals) {
  if (n == null || !isFinite(n)) return 0;
  let d = 0;
  while (d < maxDigits) {
    const scaled = n * Math.pow(10, d);
    if (Math.abs(scaled - Math.round(scaled)) < 1e-10) return d;
    d += 1;
  }
  return maxDigits;
}

export function getPrecisionSettings(tolPlus, tolMinus) {
  const dPlus = inferDecimals(Math.abs(tolPlus || 0));
  const dMinus = inferDecimals(Math.abs(tolMinus || 0));
  let displayDecimals = Math.max(dPlus, dMinus);
  const inputDecimals = displayDecimals + precisionConfig.inputExtraPrecision;
  const step = Math.pow(10, -inputDecimals);
  displayDecimals = inputDecimals; // Testweise die Anzeige genauso genau wie Input
  return { displayDecimals, inputDecimals, step };
}
