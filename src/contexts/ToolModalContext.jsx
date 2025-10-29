import { createContext, useContext } from 'react';

export const ToolModalContext = createContext(null);

export function useToolModal() {
  const ctx = useContext(ToolModalContext);
  if (!ctx) {
    throw new Error(
      'useToolModal muss innerhalb von <ToolModalProvider> verwendet werden.'
    );
  }
  return ctx;
}
