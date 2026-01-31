import React from 'react';

interface RegisterControlsProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const RegisterControls: React.FC<RegisterControlsProps> = ({ isOpen, onOpen, onClose }) => {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isOpen ? 'bg-green-100' : 'bg-red-100'}`}>
        <div className={`w-3 h-3 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
        <span className={`font-bold text-sm ${isOpen ? 'text-green-700' : 'text-red-700'}`}>
          {isOpen ? 'CAJA ABIERTA' : 'CAJA CERRADA'}
        </span>
      </div>

      {!isOpen ? (
        <button
          onClick={onOpen}
          className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors"
        >
          Abrir Caja
        </button>
      ) : (
        <button
          onClick={onClose}
          className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
        >
          Cerrar Caja
        </button>
      )}
    </div>
  );
};

export default RegisterControls;
