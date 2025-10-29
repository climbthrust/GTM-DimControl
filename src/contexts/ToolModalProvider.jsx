import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { ToolModalContext } from './ToolModalContext';
import MeasurementToolModal from './MeasurementToolModal'; // siehe unten

export default function ToolModalProvider({
  children,
  measurementTools,
  onToolChanged,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dimension, setDimension] = useState(null);

  // --- Öffnen / Schließen -----------------------------------------------
  const openModal = dim => {
    setDimension(dim);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setDimension(null);
  };

  // --- Auswahl eines Werkzeugs -------------------------------------------
  const selectTool = async toolId => {
    if (!dimension) return;
    try {
      await invoke('update_dimension_tool', {
        dimensionId: dimension.id,
        toolId,
      });
      onToolChanged?.(dimension.id, toolId);
    } catch (err) {
      console.error('Fehler beim Aktualisieren des Messwerkzeugs:', err);
    } finally {
      closeModal();
    }
  };

  // --- Render ------------------------------------------------------------
  return (
    <ToolModalContext.Provider value={{ openModal }}>
      {children}
      {isOpen && (
        <MeasurementToolModal
          tools={measurementTools}
          dimension={dimension}
          onSelect={selectTool}
          onClose={closeModal}
        />
      )}
    </ToolModalContext.Provider>
  );
}
