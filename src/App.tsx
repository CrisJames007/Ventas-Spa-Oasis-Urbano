import React, { useState, useEffect } from 'react';
import { CatalogItem, Employee, Sale, DailyClosing, ItemType } from './types';
import Sidebar from './components/Sidebar';
import SaleRegistration from './components/SaleRegistration';
import RegisterControls from './components/RegisterControls';
import MonthlySummary from './components/MonthlySummary';
import { uid } from './utils/uid';

const App: React.FC = () => {
  const [services, setServices] = useState<CatalogItem[]>(() => {
    const saved = localStorage.getItem('services');
    return saved ? JSON.parse(saved) : [];
  });

  const [products, setProducts] = useState<CatalogItem[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [];
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('employees');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentSales, setCurrentSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('currentSales');
    return saved ? JSON.parse(saved) : [];
  });

  const [salesHistory, setSalesHistory] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('salesHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [dailyClosings, setDailyClosings] = useState<DailyClosing[]>(() => {
    const saved = localStorage.getItem('dailyClosings');
    return saved ? JSON.parse(saved) : [];
  });

  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem('isRegisterOpen');
    return saved ? JSON.parse(saved) : false;
  });

  const [adminCode, setAdminCode] = useState<string>(() => {
    const saved = localStorage.getItem('adminCode');
    return saved ? JSON.parse(saved) : '1234';
  });

  useEffect(() => { localStorage.setItem('services', JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem('products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('employees', JSON.stringify(employees)); }, [employees]);
  useEffect(() => { localStorage.setItem('currentSales', JSON.stringify(currentSales)); }, [currentSales]);
  useEffect(() => { localStorage.setItem('salesHistory', JSON.stringify(salesHistory)); }, [salesHistory]);
  useEffect(() => { localStorage.setItem('dailyClosings', JSON.stringify(dailyClosings)); }, [dailyClosings]);
  useEffect(() => { localStorage.setItem('isRegisterOpen', JSON.stringify(isRegisterOpen)); }, [isRegisterOpen]);
  useEffect(() => { localStorage.setItem('adminCode', JSON.stringify(adminCode)); }, [adminCode]);

  const addService = (name: string, price: number) => {
    const newItem: CatalogItem = { id: uid(), name, price, type: 'service' };
    setServices([...services, newItem]);
  };

  const addProduct = (name: string, price: number) => {
    const newItem: CatalogItem = { id: uid(), name, price, type: 'product' };
    setProducts([...products, newItem]);
  };

  const addEmployee = (name: string) => {
    const newEmployee: Employee = { id: uid(), name };
    setEmployees([...employees, newEmployee]);
  };

  const deleteItem = (id: string, type: ItemType) => {
    if (type === 'service') setServices(services.filter(s => s.id !== id));
    else setProducts(products.filter(p => p.id !== id));
  };

  const deleteEmployee = (id: string) => {
    const usedInCurrent = currentSales.some(s => s.employeeId === id);
    const usedInHistory = salesHistory.some(s => s.employeeId === id);
    if (usedInCurrent || usedInHistory) {
      const msg = usedInCurrent && usedInHistory
        ? 'El empleado tiene ventas en la sesión actual y en el historial. ¿Eliminar igualmente? Las ventas no se modificarán.'
        : usedInCurrent
          ? 'El empleado tiene ventas en la sesión actual. ¿Eliminar igualmente? Las ventas no se modificarán.'
          : 'El empleado tiene ventas en el historial. ¿Eliminar igualmente? Las ventas no se modificarán.';
      if (!window.confirm(msg)) return;
    }
    setEmployees(employees.filter(e => e.id !== id));
  };

  const registerSale = (saleData: Omit<Sale, 'id' | 'timestamp'>) => {
    const newSale: Sale = {
      ...saleData,
      id: uid(),
      timestamp: new Date().toISOString()
    };
    setCurrentSales(prev => [...prev, newSale]);
  };

  const deleteSale = (id: string) => {
    setCurrentSales(prev => prev.filter(s => s.id !== id));
  };

  const deleteHistorySale = (id: string) => {
    const sale = salesHistory.find(s => s.id === id);
    if (sale) {
      setSalesHistory(prev => prev.filter(s => s.id !== id));
      // Actualizar el cierre diario correspondiente
      const saleDate = new Date(sale.timestamp);
      const localDate = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}-${String(saleDate.getDate()).padStart(2, '0')}`;
      setDailyClosings(prev => {
        const index = prev.findIndex(c => c.date === localDate);
        if (index > -1) {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            totalAmount: Math.max(0, updated[index].totalAmount - sale.amount)
          };
          return updated;
        }
        return prev;
      });
    }
  };

  const changeAdminCode = (newCode: string) => {
    setAdminCode(newCode);
  };

  const openRegister = () => {
    setIsRegisterOpen(true);
  };

  const currentTotal = currentSales.reduce((sum, s) => sum + (s.amount || 0), 0);

  const resetCalendar = () => {
    setDailyClosings([]);
    setSalesHistory([]);
  };

  const closeRegister = () => {
    if (!isRegisterOpen) {
      alert("La caja ya está cerrada.");
      return;
    }
    
    const confirmMsg = `¿Desea CERRAR LA CAJA ahora?\n\nTotal del turno: ${currentTotal.toFixed(2)} Bs\nVentas realizadas: ${currentSales.length}`;
    
    if (window.confirm(confirmMsg)) {
      const salesToArchive = [...currentSales];
      const sessionTotal = currentTotal;
      
      const now = new Date();
      const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      setSalesHistory(prev => [...prev, ...salesToArchive]);

      if (sessionTotal > 0) {
        setDailyClosings(prev => {
          const index = prev.findIndex(c => c.date === localDate);
          if (index > -1) {
            const updated = [...prev];
            updated[index] = { 
              ...updated[index], 
              totalAmount: updated[index].totalAmount + sessionTotal 
            };
            return updated;
          }
          return [...prev, { date: localDate, totalAmount: sessionTotal }];
        });
      }

      setCurrentSales([]);
      setIsRegisterOpen(false);
      
      alert('¡Caja Cerrada con éxito! Las ventas se movieron al historial.');
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-gray-50 text-gray-900">
      <Sidebar 
        services={services}
        products={products}
        employees={employees}
        currentSales={currentSales}
        salesHistory={salesHistory}
        adminCode={adminCode}
        onAddService={addService}
        onAddProduct={addProduct}
        onAddEmployee={addEmployee}
        onDeleteItem={deleteItem}
        onDeleteEmployee={deleteEmployee}
        onDeleteSale={deleteSale}
        onDeleteHistorySale={deleteHistorySale}
        onChangeAdminCode={changeAdminCode}
      />
      
      <main className="flex-grow p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-green-600">Oasis Urbano SPA</h1>
          <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">Administración de Caja y Ventas</p>
        </header>

        <RegisterControls 
          isOpen={isRegisterOpen}
          onOpen={openRegister}
          onClose={closeRegister}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="space-y-8">
            <SaleRegistration 
              isOpen={isRegisterOpen}
              services={services}
              products={products}
              employees={employees}
              onRegister={registerSale}
            />

            <div className={`border-2 rounded-2xl p-8 text-center shadow-lg transition-all ${isRegisterOpen ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-300 opacity-80'}`}> 
              <p className={`${isRegisterOpen ? 'text-green-700' : 'text-red-700'} font-bold text-xl mb-2 uppercase tracking-tight`}> 
                {isRegisterOpen ? 'Efectivo Actual en Caja' : 'Caja Cerrada (Saldo 0.00)'} 
              </p>
              <span className={`text-7xl font-black block ${isRegisterOpen ? 'text-green-600' : 'text-red-600'}`}> 
                {isRegisterOpen ? currentTotal.toFixed(2) : "0.00"} <span className="text-2xl">Bs</span> 
              </span>
              {!isRegisterOpen && (
                <div className="mt-4 inline-block bg-red-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase animate-pulse">
                  Requiere Apertura
                </div>
              )}
            </div>
          </section>

          <MonthlySummary dailyClosings={dailyClosings} onResetCalendar={resetCalendar} adminCode={adminCode} />
        </div>
      </main>
    </div>
  );
};

export default App;
