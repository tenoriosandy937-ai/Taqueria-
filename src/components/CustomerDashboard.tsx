import { useState, FormEvent } from 'react';
import { Product, Customer, Order, OrderItem } from '../types';
import { INITIAL_COOKS } from '../data';
import PrivacyContract from './PrivacyContract';
import { 
  Plus, 
  Minus, 
  ShoppingCart, 
  ClipboardList, 
  Clock, 
  UtensilsCrossed, 
  User, 
  CheckCircle2, 
  HeartHandshake, 
  ChevronRight, 
  X,
  FileText
} from 'lucide-react';

interface CustomerDashboardProps {
  products: Product[];
  customers: Customer[];
  orders: Order[];
  onAddCustomer: (customer: Customer) => void;
  onCreateOrder: (order: Order) => void;
  activeCustomerId: string | null;
  onSetActiveCustomerId: (id: string | null) => void;
}

export default function CustomerDashboard({
  products,
  customers,
  orders,
  onAddCustomer,
  onCreateOrder,
  activeCustomerId,
  onSetActiveCustomerId
}: CustomerDashboardProps) {
  // Navigation / views within customer panel
  const [customerMode, setCustomerMode] = useState<'selection' | 'register' | 'menu'>('selection');
  
  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regAcceptedPrivacy, setRegAcceptedPrivacy] = useState(false);
  const [formError, setFormError] = useState('');

  // Menu Search / Filter
  const [selectedCategory, setSelectedCategory] = useState<'todos' | 'tacos' | 'bebidas' | 'adicionales'>('todos');
  
  // Cart state (local to session until sent)
  const [cart, setCart] = useState<{ product: Product; quantity: number; notes: string }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Active Customer state
  const currentCustomer = customers.find(c => c.id === activeCustomerId);

  // Filter products
  const filteredProducts = products.filter(p => 
    selectedCategory === 'todos' ? true : p.category === selectedCategory
  );

  // Register New Client
  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim() || !regEmail.trim()) {
      setFormError('Por favor completa todos los campos para tu registro.');
      return;
    }
    if (!regAcceptedPrivacy) {
      setFormError('Es necesario leer y firmar el Aviso de Privacidad para continuar.');
      return;
    }

    const newCust: Customer = {
      id: 'cust-' + Date.now(),
      name: regName.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim(),
      createdAt: new Date().toISOString(),
      acceptedPrivacy: true,
    };

    onAddCustomer(newCust);
    onSetActiveCustomerId(newCust.id);
    setRegName('');
    setRegPhone('');
    setRegEmail('');
    setRegAcceptedPrivacy(false);
    setFormError('');
    setCustomerMode('menu');
  };

  // Select existing customer
  const handleSelectCustomer = (id: string) => {
    onSetActiveCustomerId(id);
    setCustomerMode('menu');
  };

  // Add item to cart
  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1, notes: '' }]);
    }
  };

  // Decrease quantity in cart
  const updateQuantity = (productId: string, delta: number) => {
    const existing = cart.find(item => item.product.id === productId);
    if (!existing) return;

    if (existing.quantity + delta <= 0) {
      setCart(cart.filter(item => item.product.id !== productId));
    } else {
      setCart(cart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: item.quantity + delta } 
          : item
      ));
    }
  };

  // Update notes of a cart item
  const updateNotes = (productId: string, notes: string) => {
    setCart(cart.map(item => 
      item.product.id === productId ? { ...item, notes } : item
    ));
  };

  // Calculate Cart Total
  const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  // Send Order to Kitchen
  const handlePlaceOrder = () => {
    if (!currentCustomer) return;
    if (cart.length === 0) return;

    const newOrder: Order = {
      id: 'ord-' + Date.now().toString().slice(-6),
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      items: cart.map(item => ({
        product: item.product,
        quantity: item.quantity,
        notes: item.notes.trim() || undefined
      })),
      total: cartTotal,
      status: 'recibido',
      paymentStatus: 'pendiente',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onCreateOrder(newOrder);
    setCart([]);
    setIsCartOpen(false);
  };

  // Active customer orders
  const myOrders = orders
    .filter(o => o.customerId === activeCustomerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="w-full">
      {/* 1. SELECTION OF CUSTOMER OR REGISTRATION BAR */}
      {!currentCustomer ? (
        <div className="max-w-2xl mx-auto my-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
            <div className="text-center mb-6">
              <span className="text-amber-500 font-bold bg-amber-500/10 px-3 py-1 rounded-full text-xs uppercase tracking-widest">
                ¡Bienvenidos a la Taquería!
              </span>
              <h2 className="text-2xl font-bold font-sans text-neutral-100 mt-2">
                Abre tu sesión de Cliente para ordenar
              </h2>
              <p className="text-sm text-neutral-400 mt-1">
                Regístrate con tus datos básicos o selecciona un perfil para pedir tus tacos.
              </p>
            </div>

            <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-800 mb-6">
              <button
                onClick={() => { setCustomerMode('selection'); setFormError(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  customerMode === 'selection' 
                    ? 'bg-neutral-800 text-amber-400 shadow-md' 
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Ingresar con Cliente Registrado
              </button>
              <button
                onClick={() => { setCustomerMode('register'); setFormError(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  customerMode === 'register' 
                    ? 'bg-neutral-800 text-amber-400 shadow-md' 
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Nuevo Registro de Cliente
              </button>
            </div>

            {customerMode === 'selection' ? (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-neutral-300">Selecciona tu perfil en la lista:</label>
                {customers.length === 0 ? (
                  <div className="p-8 text-center bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-500 text-sm">
                    No hay clientes registrados en esta base. ¡Regístrate como el primero!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1">
                    {customers.map((cust) => (
                      <button
                        key={cust.id}
                        onClick={() => handleSelectCustomer(cust.id)}
                        className="flex items-center justify-between p-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-xl text-left transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-semibold">
                            {cust.name[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-neutral-200">{cust.name}</p>
                            <p className="text-xs text-neutral-500">📞 {cust.phone} | ✉️ {cust.email}</p>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full font-mono">
                          ✓ Firmado
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                {formError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-semibold">
                    ⚠️ {formError}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Roberto Gómez"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">Teléfono Móvil (10 dígitos) *</label>
                    <input
                      type="tel"
                      maxLength={10}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="5512345678"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="roberto.g@gmail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                  />
                </div>

                <div className="pt-2 border-t border-neutral-800/60 mt-4">
                  <p className="text-xs text-neutral-500 font-medium mb-2 uppercase tracking-wider">Aviso Legal Obligatorio</p>
                  <PrivacyContract 
                    hasAgreed={regAcceptedPrivacy} 
                    onAgree={() => setRegAcceptedPrivacy(!regAcceptedPrivacy)} 
                    showCheckboxOnly={true} 
                  />
                </div>

                <div className="mt-2 text-xs text-neutral-500 select-none">
                  * Al hacer click en "Registrarme e Iniciar Pedido" confirmas legalmente tu aceptación del Aviso de Privacidad e iniciarás sesión de forma automática.
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-neutral-950 font-bold rounded-xl text-sm shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <User className="h-4 w-4" /> Registrarme e Iniciar Pedido
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-6">
          {/* LEFT: PRODUCTS MENU (SPAN-2 ON LARGE SCREENS) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">¡Hora de comer!</span>
                <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
                  Hola, <span className="text-amber-400">{currentCustomer.name}</span> 👇
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">Elige lo que más te guste y ordénalo directamente al trompo de asar.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSetActiveCustomerId(null)}
                  className="text-xs px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg border border-neutral-700/50 transition-colors"
                >
                  Cambiar de Cliente / Cerrar Sesión
                </button>
              </div>
            </div>

            {/* Menu Tabs / Categories */}
            <div className="flex gap-2 overflow-x-auto pb-1 select-none">
              {(['todos', 'tacos', 'bebidas', 'adicionales'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 capitalize shrink-0 ${
                    selectedCategory === cat 
                      ? 'bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/15 font-semibold' 
                      : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:bg-neutral-800/80 hover:text-neutral-200'
                  }`}
                >
                  {cat === 'todos' ? 'Todo el Menú' : cat === 'adicionales' ? 'Extras y salsas' : cat}
                </button>
              ))}
            </div>

            {/* Grid of Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProducts.map((prod) => (
                <div 
                  key={prod.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-md flex flex-col hover:border-neutral-700 group hover:shadow-lg transition-all"
                >
                  <div className="relative h-44 bg-neutral-950 overflow-hidden shrink-0">
                    <img 
                      src={prod.image} 
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 right-2.5 bg-neutral-950/85 backdrop-blur-md text-amber-400 font-mono text-sm font-bold px-2.5 py-1 rounded-lg border border-neutral-800/40">
                      ${prod.price} MXN
                    </span>
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-neutral-100 text-base">{prod.name}</h3>
                      <p className="text-xs text-neutral-400 line-clamp-2 mt-1 leading-relaxed">{prod.description}</p>
                    </div>
                    <button
                      onClick={() => addToCart(prod)}
                      className="w-full py-2 bg-neutral-950 hover:bg-amber-500 text-amber-500 hover:text-neutral-950 border border-amber-500/30 hover:border-amber-500 font-semibold rounded-xl text-xs transition-all duration-200 flex items-center justify-center gap-1.5"
                    >
                      <Plus className="h-3.5 w-3.5" /> Agregar al Pedido
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: CART AND CURRENT ORDERS QUEUE */}
          <div className="space-y-6">
            {/* CART CARD */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-lg flex flex-col">
              <h2 className="text-base font-bold text-neutral-200 flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
                <span className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-amber-400" /> Mi Pedido Nuevo
                </span>
                <span className="text-xs font-mono bg-neutral-950 text-neutral-400 px-2 py-0.5 rounded-full">
                  {cart.reduce((s, i) => s + i.quantity, 0)} pzas
                </span>
              </h2>

              {cart.length === 0 ? (
                <div className="py-12 text-center text-neutral-500 flex flex-col items-center justify-center gap-3">
                  <UtensilsCrossed className="h-10 w-10 text-neutral-700 stroke-1" />
                  <p className="text-sm">Tu canasta está vacía de tacos.</p>
                  <p className="text-xs">Selecciona productos a la izquierda para armar tu orden.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.product.id} className="p-3 bg-neutral-950 rounded-xl border border-neutral-800/80 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-bold text-neutral-200 leading-tight">{item.product.name}</p>
                            <p className="text-xs text-amber-400/80 font-mono font-medium">${item.product.price} MXN c/u</p>
                          </div>
                          <p className="text-xs font-mono font-bold text-neutral-200">${item.product.price * item.quantity} MXN</p>
                        </div>

                        {/* Special request notes */}
                        <div>
                          <input
                            type="text"
                            placeholder="Ejem: Sin cebolla, mucha salsa, etc."
                            value={item.notes}
                            onChange={(e) => updateNotes(item.product.id, e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-850 rounded-md px-2 py-1 text-[11px] text-neutral-300 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                          />
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="p-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-mono font-semibold text-neutral-300 px-1">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="p-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-neutral-800 space-y-3 bg-gradient-to-b from-neutral-900 to-neutral-950 -mx-5 -mb-5 p-5 rounded-b-2xl">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-400">Total a Pagar:</span>
                      <span className="text-base font-mono font-bold text-amber-400 animate-pulse">${cartTotal} MXN</span>
                    </div>

                    <button
                      onClick={handlePlaceOrder}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-950 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UtensilsCrossed className="h-4 w-4" /> Mandar Pedido a Preparación
                    </button>
                    <p className="text-[10px] text-neutral-500 text-center uppercase tracking-wider">La cocina de la taquería lo recibirá inmediatamente</p>
                  </div>
                </div>
              )}
            </div>

            {/* MY RECENT REGISTRATIONS / PRIVATE CONTRACT RE-VIEWER */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-md space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs border-b border-neutral-800 pb-2">
                <FileText className="h-4 w-4" />
                <span>Mis Datos de Privacidad</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-normal">
                Tu información está estrictamente protegida bajo el Aviso de Privacidad firmado electrónicamente en tu registro. Puedes leerlo o darnos de baja cuando desees.
              </p>
              <div className="pt-1">
                <PrivacyContract hasAgreed={true} />
              </div>
            </div>

            {/* MY PLACED ORDERS (REAL-TIME PROGRESS STEPS) */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-lg">
              <h2 className="text-sm font-bold text-neutral-200 border-b border-neutral-800 pb-2 mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-500" /> Historial de órden y Estado ({myOrders.length})
              </h2>

              {myOrders.length === 0 ? (
                <p className="text-xs text-neutral-500 text-center py-6">Aún no has enviado pedidos. ¡Cocina en espera!</p>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                  {myOrders.map((ord) => {
                    // Decide status step levels
                    let step = 0; // recibido
                    if (ord.status === 'preparando') step = 1;
                    if (ord.status === 'listo') step = 2;
                    if (ord.status === 'cobrado_y_entregado') step = 3;

                    return (
                      <div key={ord.id} className="p-3 bg-neutral-950 rounded-xl border border-neutral-850 text-xs space-y-3.5">
                        <div className="flex justify-between items-center bg-neutral-900/50 p-2 rounded border border-neutral-800">
                          <div>
                            <span className="font-mono text-amber-400 font-bold">#{ord.id}</span>
                            <span className="text-[10px] text-neutral-500 ml-1.5">• {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <span className="font-mono font-bold text-neutral-300">${ord.total} MXN</span>
                        </div>

                        {/* Items list */}
                        <div className="text-[11px] space-y-1 text-neutral-400 pl-1">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>
                                {item.quantity}x {item.product.name}
                                {item.notes && <span className="text-amber-500 italic text-[10px] ml-1">({item.notes})</span>}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Assigned Cook info */}
                        {ord.status === 'preparando' && ord.assignedCookName && (
                          <div className="bg-amber-400/10 border border-amber-400/20 p-2 rounded-lg flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-2">
                              <span className="text-base">👨‍🍳</span>
                              <div>
                                <p className="font-semibold text-amber-200">{ord.assignedCookName} en la parrilla</p>
                                <p className="text-[10px] text-neutral-400 leading-none">Está preparando tus tacos al momento.</p>
                              </div>
                            </div>
                            <span className="text-[9px] bg-amber-400/25 text-amber-300 font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
                              Caliente
                            </span>
                          </div>
                        )}

                        {ord.status === 'listo' && (
                          <div className="bg-emerald-400/10 border border-emerald-400/20 p-2 rounded-lg text-[11px] text-emerald-200">
                            📢 <strong className="text-white">¡Listo para Cobrar!</strong> Pasa a la caja principal con el Administrador para pagar y recibir tus ricos tacos.
                          </div>
                        )}

                        {ord.status === 'cobrado_y_entregado' && (
                          <div className="bg-neutral-900 text-neutral-500 p-2 rounded-lg text-[11px] flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Pedido entregado y cobrado. ¡Buen provecho!
                          </div>
                        )}

                        {/* Visual progress bar */}
                        <div className="pt-2">
                          <div className="flex justify-between text-[9px] text-neutral-500 font-bold uppercase tracking-widest pl-1 pr-1">
                            <span className={step >= 0 ? 'text-amber-400' : ''}>Recibido</span>
                            <span className={step >= 1 ? 'text-amber-400' : ''}>Cocina</span>
                            <span className={step >= 2 ? 'text-emerald-400' : ''}>Listo</span>
                            <span className={step >= 3 ? 'text-emerald-500' : ''}>Entregado</span>
                          </div>
                          
                          {/* Dot line bar */}
                          <div className="relative mt-1.5 h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${step === 3 ? 'bg-gradient-to-r from-amber-400 to-emerald-500 w-full' : 'bg-amber-500'}`}
                              style={{ width: `${(step / 3) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
