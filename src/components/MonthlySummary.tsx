import React, { useState } from 'react';
import { DailyClosing } from '../types';

interface MonthlySummaryProps {
  dailyClosings: DailyClosing[];
  onResetCalendar?: () => void;
  adminCode: string;
}

const MonthlySummary: React.FC<MonthlySummaryProps> = ({ dailyClosings, onResetCalendar, adminCode }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showResetModal, setShowResetModal] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [codeError, setCodeError] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDay = firstDayOfMonth.getDay();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const getClosingForDate = (day: number): DailyClosing | undefined => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dailyClosings.find(c => c.date === dateStr);
  };

  const monthlyTotal = dailyClosings
    .filter(c => {
      const [y, m] = c.date.split('-').map(Number);
      return y === year && m === month + 1;
    })
    .reduce((sum, c) => sum + c.totalAmount, 0);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleResetClick = () => {
    setShowResetModal(true);
    setInputCode('');
    setCodeError(false);
  };

  const handleConfirmReset = () => {
    if (inputCode === adminCode) {
      if (onResetCalendar) {
        onResetCalendar();
      }
      setShowResetModal(false);
      setInputCode('');
      setCodeError(false);
      alert('Calendario restablecido correctamente. Total del mes: 0.00 Bs');
    } else {
      setCodeError(true);
    }
  };

  const handleCancelReset = () => {
    setShowResetModal(false);
    setInputCode('');
    setCodeError(false);
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-16" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const closing = getClosingForDate(day);
      const hasData = closing && closing.totalAmount > 0;
      const today = new Date();
      const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

      days.push(
        <div
          key={day}
          className={`h-16 p-1 border border-gray-100 rounded-lg transition-colors ${
            hasData ? 'bg-green-50 border-green-200' : 'bg-white'
          } ${isToday ? 'ring-2 ring-green-500' : ''}`}
        >
          <div className="flex flex-col h-full">
            <span className={`text-xs font-bold ${isToday ? 'text-green-600' : 'text-gray-600'}`}>
              {day}
            </span>
            {hasData && (
              <span className="text-xs font-bold text-green-600 mt-auto">
                {closing.totalAmount.toFixed(0)} Bs
              </span>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Resumen Mensual</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ←
          </button>
          <span className="font-bold text-gray-700 min-w-[140px] text-center">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-bold text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {renderCalendarDays()}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-gray-700">Total del Mes:</span>
          <span className="text-3xl font-black text-green-600">{monthlyTotal.toFixed(2)} Bs</span>
        </div>
        
        {/* Botón Restablecer Calendario */}
        <button
          onClick={handleResetClick}
          className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Restablecer Calendario
        </button>
      </div>

      {/* Modal de confirmación con código de administrador */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Restablecer Calendario</h3>
              <p className="text-gray-600 text-sm">
                Esta acción eliminará todos los registros del calendario y restablecerá el total del mes a <strong>0.00 Bs</strong>.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Código de Administrador
              </label>
              <input
                type="password"
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value);
                  setCodeError(false);
                }}
                placeholder="Ingrese el código..."
                className={`w-full px-4 py-3 border-2 rounded-xl text-center text-lg font-bold tracking-widest focus:outline-none transition-colors ${
                  codeError 
                    ? 'border-red-500 bg-red-50 focus:border-red-500' 
                    : 'border-gray-300 focus:border-green-500'
                }`}
                autoFocus
              />
              {codeError && (
                <p className="text-red-500 text-sm mt-2 text-center font-medium">
                  ❌ Código incorrecto. Intente nuevamente.
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelReset}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmReset}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MonthlySummary;
