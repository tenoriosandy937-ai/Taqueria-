import { useState, useEffect } from 'react';
import { Product, Customer, Order, Transaction, MainAccount, OrderStatus } from './types';
import { 
  loadProducts, 
  saveProducts, 
  loadCustomers, 
  saveCustomers, 
  loadOrders, 
  saveOrders, 
  loadTransactions, 
  saveTransactions, 
  loadAccount, 
  saveAccount 
} from './utils/stateManager';
import CustomerDashboard from './components/CustomerDashboard';
import CookDashboard from './components/CookDashboard';
import AdminDashboard from './components/AdminDashboard';
import { 
  ChefHat, 
  Settings, 
  Users, 
  ShoppingBag, 
  ShieldCheck, 
  Flame, 
  UtensilsCrossed, 
  Info,
  Clock
} from 'lucide-react';

export default function App() {
  // Global States loaded from storage
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [account, setAccount] = useState<MainAccount>({ balance: 0, cash: 0, card: 0, transfer: 0 });

  // Navigation states
  const [selectedRole, setSelectedRole] = useState<'pick' | 'admin' | 'customer' | 'cook'>('pick');
  
  // Specific Session States
  const [activeCustomerId, setActiveCustomerId] = useState<string | null>(null);
  const [activeCookId, setActiveCookId] = useState<string | null>(null);

  // Time tracker for mock street clock
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  // 1. Initial State Loading
  useEffect(() => {
    setProducts(loadProducts());
    setCustomers(loadCustomers());
    setOrders(loadOrders());
    setTransactions(loadTransactions());
    setAccount(loadAccount());

    // Current time ticking clock
    const updateTime = () => {
      const d = new Date();
      setCurrentTimeStr(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  // 2. React to standard storage updates (sync mult-tab operations)
  useEffect(() => {
    const handleStorageUpdate = (e: StorageEvent) => {
      setProducts(loadProducts());
      setCustomers(loadCustomers());
      setOrders(loadOrders());
      setTransactions(loadTransactions());
      setAccount(loadAccount());
    };
    window.addEventListener('storage', handleStorageUpdate);
    return () => window.removeEventListener('storage', handleStorageUpdate);
  }, []);

  // --- ACTIONS PASS-THROUGHS TO STATE AND STORAGE ---

  // Add a product (Admin)
  const handleAddProduct = (newProd: Product) => {
    const updated = [...products, newProd];
    setProducts(updated);
    saveProducts(updated);
  };

  // Delete a product (Admin)
  const handleDeleteProduct = (productId: string) => {
    const updated = products.filter(p => p.id !== productId);
    setProducts(updated);
    saveProducts(updated);
  };

  // Add a customer (Client Register / Admin)
  const handleAddCustomer = (newCust: Customer) => {
    const updated = [...customers, newCust];
    setCustomers(updated);
    saveCustomers(updated);
  };

  // Create an order (Client)
  const handleCreateOrder = (newOrder: Order) => {
    const updated = [...orders, newOrder];
    setOrders(updated);
    saveOrders(updated);
  };

  // Update order prep status (Cook / Kitchen workflow)
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus, cookId?: string, cookName?: string) => {
    const updated = orders.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status,
          updatedAt: new Date().toISOString(),
          ...(cookId ? { assignedCookId: cookId } : {}),
          ...(cookName ? { assignedCookName: cookName } : {})
        };
      }
      return ord;
    });

    setOrders(updated);
    saveOrders(updated);
  };

  // Finalize payment/checkout (Admin cash register)
  const handleCheckoutOrder = (orderId: string, paymentMethod: 'efectivo' | 'tarjeta' | 'transferencia') => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    // 1. Update order state to paid and delivered
    const updatedOrders = orders.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status: 'cobrado_y_entregado' as OrderStatus,
          paymentMethod,
          paymentStatus: 'pagado' as const,
          updatedAt: new Date().toISOString()
        };
      }
      return ord;
    });
    setOrders(updatedOrders);
    saveOrders(updatedOrders);

    // 2. Add as transaction
    const newTx: Transaction = {
      id: 'tx-' + Date.now().toString().slice(-6),
      orderId,
      customerName: targetOrder.customerName,
      amount: targetOrder.total,
      paymentMethod,
      timestamp: new Date().toISOString()
    };
    const updatedTxs = [...transactions, newTx];
    setTransactions(updatedTxs);
    saveTransactions(updatedTxs);

    // 3. Credit funds to accounting
    const currentBalance = account.balance + targetOrder.total;
    const currentEfectivo = account.cash + (paymentMethod === 'efectivo' ? targetOrder.total : 0);
    const currentTarjeta = account.card + (paymentMethod === 'tarjeta' ? targetOrder.total : 0);
    const currentTransferencia = account.transfer + (paymentMethod === 'transferencia' ? targetOrder.total : 0);

    const updatedAccount: MainAccount = {
      balance: currentBalance,
      cash: currentEfectivo,
      card: currentTarjeta,
      transfer: currentTransferencia
    };
    setAccount(updatedAccount);
    saveAccount(updatedAccount);

    alert(`💵 Su transacción #${newTx.id} por $${targetOrder.total} MXN ha sido autorizada. El pedido #${orderId} se ha marcado como Entregado.`);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans select-none selection:bg-amber-500 selection:text-neutral-950">
      {/* GLOWING AMBIENT BACKGROUND */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* PERSISTENT TOP UTILITY BAR (ELEGANT MULTI-TAB SWITCHER & STATUS) */}
      <div className="bg-neutral-900/60 backdrop-blur-md border-b border-neutral-800/80 sticky top-0 z-40 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center p-1.5 bg-amber-500 rounded-lg text-neutral-950 font-black animate-bounce shrink-0">
              🌮
            </span>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-neutral-100 uppercase">
                Taquería "Los Tres Compas"
              </h1>
              <p className="text-[10px] text-neutral-500 font-mono">Control de Caja & Preparación Electrónica</p>
            </div>
          </div>

          {/* QUICK SIMULATOR DECK - VERY HELPUL IN IFRAMES! */}
          <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-800 rounded-xl p-1 shrink-0">
            <span className="text-[10.px] text-neutral-500 font-bold px-2 uppercase tracking-wider hidden md:inline">Vista Activa:</span>
            
            <button
              onClick={() => setSelectedRole('customer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedRole === 'customer' 
                  ? 'bg-amber-500 text-neutral-950 shadow' 
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              👤 Cliente
            </button>
            <button
              onClick={() => setSelectedRole('cook')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedRole === 'cook' 
                  ? 'bg-amber-500 text-neutral-950 shadow' 
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              👨‍🍳 Cocina
            </button>
            <button
              onClick={() => setSelectedRole('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedRole === 'admin' 
                  ? 'bg-amber-500 text-neutral-950 shadow' 
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              🔑 Cargo / Caja
            </button>
            
            {selectedRole !== 'pick' && (
              <button
                onClick={() => { setSelectedRole('pick'); }}
                title="Cerrar sesion"
                className="ml-1 text-xs text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 px-2 py-1.5 rounded-lg font-bold"
              >
                Cerrar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CORE FRAME CONTENT */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
        
        {/* VIEW: ROLE SELECTION SCREEN / GATE */}
        {selectedRole === 'pick' && (
          <div className="max-w-4xl mx-auto py-12 md:py-20 space-y-12">
            <div className="text-center space-y-4">
              <span className="text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3.5 py-1.5 rounded-full uppercase tracking-widest leading-none">
                🔥 Desde El Trompo De Asar con Amor 🔥
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-sans max-w-2xl mx-auto">
                Gestión Digital de Nuestra <span className="text-amber-400 select-all">Taquería</span>
              </h2>
              <p className="text-neutral-400 text-sm md:text-base max-w-lg mx-auto">
                Sistema integrado para clientes, cocineros en plancha y la administración de la caja principal de cobros.
              </p>
            </div>

            {/* THREE INTERACTIVE PORTAL CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* CLIENTE */}
              <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 hover:border-amber-500/30 rounded-3xl p-6 shadow-xl transition-all hover:scale-[1.02] flex flex-col justify-between h-80 relative group overflow-hidden">
                <div className="absolute right-[-15px] top-[-15px] p-5 opacity-[0.05] group-hover:opacity-[0.10] text-amber-400 transition-opacity">
                  <ShoppingBag className="h-28 w-28 stroke-[1.5]" />
                </div>
                <div className="space-y-3">
                  <div className="h-12 w-12 bg-amber-500/10 text-amber-500 flex items-center justify-center rounded-2xl">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-100 font-sans">Módulo del Cliente</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Regístrate con tus datos bajo el Aviso de Privacidad. Arma tu comanda con pastor o asada y observa su estado en preparación.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRole('customer')}
                  className="w-full py-3 bg-neutral-900 hover:bg-amber-500 text-amber-500 hover:text-neutral-950 border border-amber-550/30 hover:border-amber-500 font-bold rounded-2xl text-xs transition-all uppercase tracking-wider cursor-pointer"
                >
                  Entrar como Cliente
                </button>
              </div>

              {/* COCINERO */}
              <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 hover:border-amber-500/30 rounded-3xl p-6 shadow-xl transition-all hover:scale-[1.02] flex flex-col justify-between h-80 relative group overflow-hidden">
                <div className="absolute right-[-15px] top-[-15px] p-5 opacity-[0.05] group-hover:opacity-[0.10] text-amber-400 transition-opacity">
                  <ChefHat className="h-28 w-28 stroke-[1.5]" />
                </div>
                <div className="space-y-3">
                  <div className="h-12 w-12 bg-orange-500/10 text-orange-400 flex items-center justify-center rounded-2xl">
                    <ChefHat className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-100 font-sans">Área de Cocina</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Vigila las comandas calientes que envían los comensales. Haz la cocción al pastor al momento y márcalos listos al terminar.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRole('cook')}
                  className="w-full py-3 bg-neutral-900 hover:bg-amber-500 text-amber-500 hover:text-neutral-950 border border-amber-550/30 hover:border-amber-500 font-bold rounded-2xl text-xs transition-all uppercase tracking-wider cursor-pointer"
                >
                  Ir a los Fogones
                </button>
              </div>

              {/* ADMINISTRADOR */}
              <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 hover:border-amber-500/30 rounded-3xl p-6 shadow-xl transition-all hover:scale-[1.02] flex flex-col justify-between h-80 relative group overflow-hidden">
                <div className="absolute right-[-15px] top-[-15px] p-5 opacity-[0.05] group-hover:opacity-[0.10] text-amber-400 transition-opacity">
                  <Settings className="h-28 w-28 stroke-[1.5]" />
                </div>
                <div className="space-y-3">
                  <div className="h-12 w-12 bg-emerald-500/10 text-emerald-400 flex items-center justify-center rounded-2xl">
                    <Settings className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-100 font-sans">Administración (Caja)</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Controla la cuenta principal ("Caja"). Cobra órdenes con tarjeta, transferencia, o efectivo. Gestiona platillos y clientes.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRole('admin')}
                  className="w-full py-3 bg-neutral-900 hover:bg-amber-500 text-amber-500 hover:text-neutral-950 border border-amber-550/30 hover:border-amber-500 font-bold rounded-2xl text-xs transition-all uppercase tracking-wider cursor-pointer"
                >
                  Acceder a la Caja
                </button>
              </div>

            </div>

            {/* SYNC INDICATOR INFORMATION FOOTER */}
            <div className="p-4 bg-neutral-900/40 border border-neutral-850 rounded-2xl text-xs text-neutral-500 space-y-2 max-w-2xl mx-auto text-center font-medium select-none">
              <span className="text-amber-500 font-bold text-xs flex items-center justify-center gap-1">
                💡 Tip de Prueba Multi-Usuario:
              </span>
              <p className="leading-normal">
                Nuestra aplicación utiliza sincronización en vivo mediante <strong className="text-neutral-400 font-mono">localStorage reactivo</strong>. 
                Puedes abrir tres pestañas al mismo tiempo (Cliente, Cocina, Administrativo) para ver cómo interactúan en tiempo real al mandar, cocinar y pagar cuentas.
              </p>
            </div>
          </div>
        )}

        {/* VIEW: CLIENTE DASHBOARD */}
        {selectedRole === 'customer' && (
          <CustomerDashboard
            products={products}
            customers={customers}
            orders={orders}
            onAddCustomer={handleAddCustomer}
            onCreateOrder={handleCreateOrder}
            activeCustomerId={activeCustomerId}
            onSetActiveCustomerId={setActiveCustomerId}
          />
        )}

        {/* VIEW: COOK DASHBOARD */}
        {selectedRole === 'cook' && (
          <CookDashboard
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            activeCookId={activeCookId}
            onSetActiveCookId={setActiveCookId}
          />
        )}

        {/* VIEW: ADMIN DASHBOARD */}
        {selectedRole === 'admin' && (
          <AdminDashboard
            products={products}
            customers={customers}
            orders={orders}
            transactions={transactions}
            account={account}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onAddCustomer={handleAddCustomer}
            onCheckoutOrder={handleCheckoutOrder}
          />
        )}

      </main>

      {/* FOOTER BAR */}
      <footer className="mt-12 bg-neutral-950 border-t border-neutral-900/80 py-6 text-xs text-center text-neutral-500 select-none font-medium">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="flex items-center justify-center gap-1.5">
            <span>🛡️ Software de Punto de Venta Protegido</span>
            <span>•</span>
            <span className="text-neutral-400">AVISO DE PRIVACIDAD LOPD COMPILADO</span>
          </p>
          <p>© 2026 Taquería "Los Tres Compas" inc. - Av. Revolución #456, CDMX. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
