import React, { useState } from 'react';
import { CatalogItem, Employee, Sale, ItemType } from '../types';

interface SidebarProps {
  services: CatalogItem[];
  products: CatalogItem[];
  employees: Employee[];
  currentSales: Sale[];
  salesHistory: Sale[];
  adminCode: string;
  onAddService: (name: string, price: number) => void;
  onAddProduct: (name: string, price: number) => void;
  onAddEmployee: (name: string) => void;
  onDeleteItem: (id: string, type: ItemType) => void;
  onDeleteEmployee: (id: string) => void;
  onDeleteSale: (id: string) => void;
  onDeleteHistorySale: (id: string) => void;
  onChangeAdminCode: (newCode: string) => void;
}

type TabType = 'catalog' | 'employees' | 'sales' | 'history' | 'config';

const Sidebar: React.FC<SidebarProps> = ({
  services, products, employees, currentSales, salesHistory, adminCode,
  onAddService, onAddProduct, onAddEmployee, onDeleteItem, onDeleteEmployee, 
  onDeleteSale, onDeleteHistorySale, onChangeAdminCode,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('catalog');
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [deleteCode, setDeleteCode] = useState('');
  const [newAdminCode, setNewAdminCode] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const [saleToDelete, setSaleToDelete] = useState<string | null>(null);

  const handleAddService = () => {
    if (!serviceName.trim() || !servicePrice) return;
    const price = parseFloat(servicePrice);
    if (isNaN(price) || price <= 0) return;
    onAddService(serviceName.trim(), price);
    setServiceName('');
    setServicePrice('');
  };

  const handleAddProduct = () => {
    if (!productName.trim() || !productPrice) return;
    const price = parseFloat(productPrice);
    if (isNaN(price) || price <= 0) return;
    onAddProduct(productName.trim(), price);
    setProductName('');
    setProductPrice('');
  };

  const handleAddEmployee = () => {
    if (!employeeName.trim()) return;
    onAddEmployee(employeeName.trim());
    setEmployeeName('');
  };

  const handleDeleteSaleWithCode = () => {
    if (deleteCode === adminCode && saleToDelete) {
      onDeleteHistorySale(saleToDelete);
      setSaleToDelete(null);
      setDeleteCode('');
    } else {
      alert('Código incorrecto');
    }
  };

  const handleChangeAdminCode = () => {
    if (newAdminCode && newAdminCode === confirmCode && newAdminCode.length >= 4) {
      onChangeAdminCode(newAdminCode);
      setNewAdminCode('');
      setConfirmCode('');
      alert('Código actualizado correctamente');
    } else {
      alert('Los códigos no coinciden o son muy cortos (mínimo 4 caracteres)');
    }
  };

  const cashTotal = salesHistory.filter(s => s.paymentMethod === 'cash').reduce((sum, s) => sum + s.amount, 0);
  const qrTotal = salesHistory.filter(s => s.paymentMethod === 'qr').reduce((sum, s) => sum + s.amount, 0);
  const totalHistorico = cashTotal + qrTotal;

  const exportToPDF = () => {
    const content = salesHistory.map(sale => {
      const emp = employees.find(e => e.id === sale.employeeId);
      const date = new Date(sale.timestamp);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()} - ${sale.amount.toFixed(2)} Bs - ${sale.paymentMethod === 'cash' ? 'Efectivo' : 'QR'} - ${emp?.name || 'N/A'}`;
    }).join('\n');
    
    const blob = new Blob([
      `HISTORIAL DE VENTAS - OASIS URBANO SPA\n`,
      `Generado: ${new Date().toLocaleString()}\n`,
      `${'='.repeat(50)}\n\n`,
      content,
      `\n\n${'='.repeat(50)}\n`,
      `TOTAL EFECTIVO: ${cashTotal.toFixed(2)} Bs\n`,
      `TOTAL QR: ${qrTotal.toFixed(2)} Bs\n`,
      `TOTAL HISTÓRICO: ${totalHistorico.toFixed(2)} Bs`
    ], { type: 'text/plain' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historial-ventas-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs: { key: TabType; label: string }[] = [
    { key: 'catalog', label: 'Catálogo' },
    { key: 'employees', label: 'Personal' },
    { key: 'sales', label: 'Ventas' },
    { key: 'history', label: 'Historial' },
    { key: 'config', label: 'Config' },
  ];

  return (
    <aside className="w-96 bg-white border-r border-gray-200 flex flex-col h-full shadow-lg">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-700">
        <h2 className="text-lg font-bold text-white">Panel de Control</h2>
      </div>

      <div className="flex border-b border-gray-200 bg-gray-50">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide transition-all ${
              activeTab === tab.key
                ? 'text-green-700 border-b-3 border-green-600 bg-white'
                : 'text-gray-500 hover:text-green-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* CATÁLOGO */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            {/* Servicios */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h3 className="text-sm font-bold text-blue-800 uppercase mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Servicios
              </h3>
              <div className="space-y-2 mb-3">
                <input
                  type="text"
                  placeholder="Nombre del servicio"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
                <input
                  type="number"
                  placeholder="Precio (Bs)"
                  value={servicePrice}
                  onChange={(e) => setServicePrice(e.target.value)}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
                <button
                  onClick={handleAddService}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  + Agregar Servicio
                </button>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {services.length === 0 ? (
                  <p className="text-xs text-blue-400 text-center py-2">Sin servicios registrados</p>
                ) : (
                  services.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-blue-100">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-blue-600 font-bold">{item.price.toFixed(2)} Bs</p>
                      </div>
                      <button
                        onClick={() => onDeleteItem(item.id, 'service')}
                        className="w-6 h-6 bg-red-100 text-red-600 rounded-full hover:bg-red-200 text-xs font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Productos */}
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <h3 className="text-sm font-bold text-purple-800 uppercase mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Productos
              </h3>
              <div className="space-y-2 mb-3">
                <input
                  type="text"
                  placeholder="Nombre del producto"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                />
                <input
                  type="number"
                  placeholder="Precio (Bs)"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                />
                <button
                  onClick={handleAddProduct}
                  className="w-full py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors"
                >
                  + Agregar Producto
                </button>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {products.length === 0 ? (
                  <p className="text-xs text-purple-400 text-center py-2">Sin productos registrados</p>
                ) : (
                  products.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-purple-100">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-purple-600 font-bold">{item.price.toFixed(2)} Bs</p>
                      </div>
                      <button
                        onClick={() => onDeleteItem(item.id, 'product')}
                        className="w-6 h-6 bg-red-100 text-red-600 rounded-full hover:bg-red-200 text-xs font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* PERSONAL */}
        {activeTab === 'employees' && (
          <div className="space-y-4">
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <h3 className="text-sm font-bold text-green-800 uppercase mb-3">Agregar Empleado</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Nombre del empleado"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  className="w-full px-3 py-2 border border-green-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 bg-white"
                />
                <button
                  onClick={handleAddEmployee}
                  className="w-full py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
                >
                  + Agregar Empleado
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-700 uppercase">Empleados Registrados</h3>
              {employees.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">Sin empleados</p>
              ) : (
                employees.map((emp) => (
                  <div key={emp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <p className="text-sm font-medium">{emp.name}</p>
                    <button
                      onClick={() => onDeleteEmployee(emp.id)}
                      className="w-6 h-6 bg-red-100 text-red-600 rounded-full hover:bg-red-200 text-xs font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* VENTAS DEL TURNO */}
        {activeTab === 'sales' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700 uppercase">Ventas del Turno</h3>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">
                {currentSales.length} ventas
              </span>
            </div>
            {currentSales.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <p className="text-gray-400 text-sm">Sin ventas en este turno</p>
              </div>
            ) : (
              currentSales.map((sale) => {
                const emp = employees.find(e => e.id === sale.employeeId);
                const date = new Date(sale.timestamp);
                return (
                  <div key={sale.id} className="p-3 bg-gradient-to-r from-green-50 to-white rounded-xl border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-black text-green-700">{sale.amount.toFixed(2)} Bs</p>
                        <p className="text-xs text-gray-600">{emp?.name || 'N/A'}</p>
                        <p className="text-xs text-gray-400">
                          {date.toLocaleDateString()} - {date.toLocaleTimeString()}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${sale.paymentMethod === 'cash' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {sale.paymentMethod === 'cash' ? 'Efectivo' : 'QR'}
                        </span>
                      </div>
                      <button
                        onClick={() => onDeleteSale(sale.id)}
                        className="w-8 h-8 bg-red-100 text-red-600 rounded-full hover:bg-red-200 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })
            )}
            <div className="mt-4 p-3 bg-green-600 rounded-xl text-white">
              <p className="text-xs uppercase">Total del Turno</p>
              <p className="text-2xl font-black">{currentSales.reduce((s, v) => s + v.amount, 0).toFixed(2)} Bs</p>
            </div>
          </div>
        )}

        {/* HISTORIAL */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700 uppercase">Historial de Ventas</h3>
              <button
                onClick={exportToPDF}
                className="text-xs bg-red-600 text-white px-3 py-1 rounded-lg font-bold hover:bg-red-700"
              >
                Exportar
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {salesHistory.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">Sin historial</p>
              ) : (
                salesHistory.slice().reverse().map((sale) => {
                  const emp = employees.find(e => e.id === sale.employeeId);
                  const date = new Date(sale.timestamp);
                  return (
                    <div key={sale.id} className="p-2 bg-gray-50 rounded-lg border flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold">{sale.amount.toFixed(2)} Bs</p>
                        <p className="text-xs text-gray-500">{date.toLocaleDateString()} {date.toLocaleTimeString()}</p>
                        <span className={`text-xs ${sale.paymentMethod === 'cash' ? 'text-green-600' : 'text-blue-600'}`}>
                          {sale.paymentMethod === 'cash' ? 'Efectivo' : 'QR'}
                        </span>
                      </div>
                      <button
                        onClick={() => setSaleToDelete(sale.id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Eliminar
                      </button>
                    </div>
                  );
                })
              )}
            </div>
            
            {saleToDelete && (
              <div className="p-3 bg-red-50 rounded-xl border border-red-200">
                <p className="text-xs text-red-700 mb-2 font-bold">Ingrese código admin para eliminar:</p>
                <input
                  type="password"
                  value={deleteCode}
                  onChange={(e) => setDeleteCode(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm mb-2"
                  placeholder="Código admin"
                />
                <div className="flex gap-2">
                  <button onClick={handleDeleteSaleWithCode} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-xs font-bold">Confirmar</button>
                  <button onClick={() => { setSaleToDelete(null); setDeleteCode(''); }} className="flex-1 py-2 bg-gray-300 rounded-lg text-xs font-bold">Cancelar</button>
                </div>
              </div>
            )}

            <div className="space-y-2 pt-4 border-t">
              <h4 className="text-sm font-bold text-gray-700 uppercase">Total Histórico</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-green-100 rounded-xl text-center">
                  <p className="text-xs text-green-700">Efectivo</p>
                  <p className="text-lg font-black text-green-800">{cashTotal.toFixed(2)} Bs</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl text-center">
                  <p className="text-xs text-blue-700">QR</p>
                  <p className="text-lg font-black text-blue-800">{qrTotal.toFixed(2)} Bs</p>
                </div>
              </div>
              <div className="p-3 bg-gray-800 rounded-xl text-center">
                <p className="text-xs text-gray-400">Total General</p>
                <p className="text-2xl font-black text-white">{totalHistorico.toFixed(2)} Bs</p>
              </div>
            </div>
          </div>
        )}

        {/* CONFIGURACIÓN */}
        {activeTab === 'config' && (
          <div className="space-y-4">
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
              <h3 className="text-sm font-bold text-yellow-800 uppercase mb-3">Cambiar Código Admin</h3>
              <div className="space-y-2">
                <input
                  type="password"
                  placeholder="Nuevo código (mín. 4 caracteres)"
                  value={newAdminCode}
                  onChange={(e) => setNewAdminCode(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
                <input
                  type="password"
                  placeholder="Confirmar código"
                  value={confirmCode}
                  onChange={(e) => setConfirmCode(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
                <button
                  onClick={handleChangeAdminCode}
                  className="w-full py-2 bg-yellow-600 text-white rounded-lg font-bold hover:bg-yellow-700"
                >
                  Actualizar Código
                </button>
              </div>
            </div>
            <div className="bg-gray-100 rounded-xl p-4">
              <p className="text-xs text-gray-600">
                El código de administrador se usa para:
              </p>
              <ul className="text-xs text-gray-500 mt-2 space-y-1">
                <li>• Eliminar ventas del historial</li>
                <li>• Restablecer el calendario</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
