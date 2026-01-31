import React, { useState } from 'react';
import { CatalogItem, Employee, Sale } from '../types';

interface SaleRegistrationProps {
  isOpen: boolean;
  services: CatalogItem[];
  products: CatalogItem[];
  employees: Employee[];
  onRegister: (sale: Omit<Sale, 'id' | 'timestamp'>) => void;
}

const SaleRegistration: React.FC<SaleRegistrationProps> = ({
  isOpen,
  services,
  products,
  employees,
  onRegister,
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedItems, setSelectedItems] = useState<{ itemId: string; quantity: number }[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
  const [notes, setNotes] = useState('');

  const allItems = [...services, ...products];

  const handleAddItem = (itemId: string) => {
    const existing = selectedItems.find(i => i.itemId === itemId);
    if (existing) {
      setSelectedItems(selectedItems.map(i => 
        i.itemId === itemId ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setSelectedItems([...selectedItems, { itemId, quantity: 1 }]);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    const existing = selectedItems.find(i => i.itemId === itemId);
    if (existing && existing.quantity > 1) {
      setSelectedItems(selectedItems.map(i => 
        i.itemId === itemId ? { ...i, quantity: i.quantity - 1 } : i
      ));
    } else {
      setSelectedItems(selectedItems.filter(i => i.itemId !== itemId));
    }
  };

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => {
      const catalogItem = allItems.find(i => i.id === item.itemId);
      return sum + (catalogItem ? catalogItem.price * item.quantity : 0);
    }, 0);
  };

  const handleSubmit = () => {
    if (!selectedEmployee || selectedItems.length === 0) {
      alert('Seleccione un empleado y al menos un item');
      return;
    }

    onRegister({
      employeeId: selectedEmployee,
      items: selectedItems,
      amount: calculateTotal(),
      paymentMethod,
      notes: notes.trim() || undefined,
    });

    setSelectedEmployee('');
    setSelectedItems([]);
    setPaymentMethod('cash');
    setNotes('');
  };

  if (!isOpen) {
    return (
      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
        <p className="text-gray-500 font-medium">La caja está cerrada. Abra la caja para registrar ventas.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Registrar Venta</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Empleado</label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Seleccionar empleado...</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Servicios y Productos</label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {allItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleAddItem(item.id)}
                className={`p-2 text-left rounded-lg border transition-colors ${
                  item.type === 'service' 
                    ? 'border-blue-200 bg-blue-50 hover:bg-blue-100' 
                    : 'border-purple-200 bg-purple-50 hover:bg-purple-100'
                }`}
              >
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-gray-600">{item.price.toFixed(2)} Bs</p>
              </button>
            ))}
          </div>
        </div>

        {selectedItems.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Items Seleccionados</label>
            <div className="space-y-1">
              {selectedItems.map((item) => {
                const catalogItem = allItems.find(i => i.id === item.itemId);
                if (!catalogItem) return null;
                return (
                  <div key={item.itemId} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium">{catalogItem.name}</span>
                      <span className="text-xs text-gray-500 ml-2">x{item.quantity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-green-600">
                        {(catalogItem.price * item.quantity).toFixed(2)} Bs
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item.itemId)}
                        className="text-red-500 hover:text-red-700 text-xs font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Método de Pago</label>
          <div className="flex gap-2">
            {(['cash', 'card', 'transfer'] as const).map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  paymentMethod === method
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {method === 'cash' ? 'Efectivo' : method === 'card' ? 'Tarjeta' : 'Transferencia'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Notas (opcional)</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Agregar nota..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-bold text-gray-800">Total:</span>
            <span className="text-2xl font-black text-green-600">{calculateTotal().toFixed(2)} Bs</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!selectedEmployee || selectedItems.length === 0}
            className="w-full py-3 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Registrar Venta
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaleRegistration;
