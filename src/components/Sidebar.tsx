import React, { useState } from 'react';
import { CatalogItem, Employee, Sale, ItemType } from '../types';

interface SidebarProps {
  services: CatalogItem[];
  products: CatalogItem[];
  employees: Employee[];
  currentSales: Sale[];
  salesHistory: Sale[];
  onAddService: (name: string, price: number) => void;
  onAddProduct: (name: string, price: number) => void;
  onAddEmployee: (name: string) => void;
  onDeleteItem: (id: string, type: ItemType) => void;
  onDeleteEmployee: (id: string) => void;
  onDeleteSale: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  services,
  products,
  employees,
  currentSales,
  salesHistory,
  onAddService,
  onAddProduct,
  onAddEmployee,
  onDeleteItem,
  onDeleteEmployee,
  onDeleteSale,
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'employees' | 'sales' | 'history'>('catalog');
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemType, setNewItemType] = useState<'service' | 'product'>('service');
  const [newEmployeeName, setNewEmployeeName] = useState('');

  const handleAddItem = () => {
    if (!newItemName.trim() || !newItemPrice) return;
    const price = parseFloat(newItemPrice);
    if (isNaN(price) || price <= 0) return;
    
    if (newItemType === 'service') {
      onAddService(newItemName.trim(), price);
    } else {
      onAddProduct(newItemName.trim(), price);
    }
    setNewItemName('');
    setNewItemPrice('');
  };

  const handleAddEmployee = () => {
    if (!newEmployeeName.trim()) return;
    onAddEmployee(newEmployeeName.trim());
    setNewEmployeeName('');
  };

  const allItems = [...services, ...products];

  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800">Panel de Control</h2>
      </div>

      <div className="flex border-b border-gray-200">
        {(['catalog', 'employees', 'sales', 'history'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
              activeTab === tab
                ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'catalog' ? 'Catálogo' : tab === 'employees' ? 'Personal' : tab === 'sales' ? 'Ventas' : 'Historial'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Nombre del item"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Precio (Bs)"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <select
                value={newItemType}
                onChange={(e) => setNewItemType(e.target.value as 'service' | 'product')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="service">Servicio</option>
                <option value="product">Producto</option>
              </select>
              <button
                onClick={handleAddItem}
                className="w-full py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Agregar
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-700 uppercase">Servicios</h3>
              {services.length === 0 ? (
                <p className="text-xs text-gray-400">Sin servicios</p>
              ) : (
                services.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-green-600 font-bold">{item.price.toFixed(2)} Bs</p>
                    </div>
                    <button
                      onClick={() => onDeleteItem(item.id, 'service')}
                      className="text-red-500 hover:text-red-700 text-xs font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-700 uppercase">Productos</h3>
              {products.length === 0 ? (
                <p className="text-xs text-gray-400">Sin productos</p>
              ) : (
                products.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-green-600 font-bold">{item.price.toFixed(2)} Bs</p>
                    </div>
                    <button
                      onClick={() => onDeleteItem(item.id, 'product')}
                      className="text-red-500 hover:text-red-700 text-xs font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'employees' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Nombre del empleado"
                value={newEmployeeName}
                onChange={(e) => setNewEmployeeName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                onClick={handleAddEmployee}
                className="w-full py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Agregar Empleado
              </button>
            </div>

            <div className="space-y-2">
              {employees.length === 0 ? (
                <p className="text-xs text-gray-400">Sin empleados registrados</p>
              ) : (
                employees.map((emp) => (
                  <div key={emp.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium">{emp.name}</p>
                    <button
                      onClick={() => onDeleteEmployee(emp.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-gray-700 uppercase">Ventas del Turno</h3>
            {currentSales.length === 0 ? (
              <p className="text-xs text-gray-400">Sin ventas en este turno</p>
            ) : (
              currentSales.map((sale) => {
                const emp = employees.find(e => e.id === sale.employeeId);
                return (
                  <div key={sale.id} className="p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{sale.amount.toFixed(2)} Bs</p>
                        <p className="text-xs text-gray-500">{emp?.name || 'Empleado eliminado'}</p>
                        <p className="text-xs text-gray-400">{new Date(sale.timestamp).toLocaleTimeString()}</p>
                      </div>
                      <button
                        onClick={() => onDeleteSale(sale.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-gray-700 uppercase">Historial de Ventas</h3>
            {salesHistory.length === 0 ? (
              <p className="text-xs text-gray-400">Sin historial</p>
            ) : (
              salesHistory.slice().reverse().map((sale) => {
                const emp = employees.find(e => e.id === sale.employeeId);
                return (
                  <div key={sale.id} className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium">{sale.amount.toFixed(2)} Bs</p>
                    <p className="text-xs text-gray-500">{emp?.name || 'Empleado eliminado'}</p>
                    <p className="text-xs text-gray-400">{new Date(sale.timestamp).toLocaleString()}</p>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
