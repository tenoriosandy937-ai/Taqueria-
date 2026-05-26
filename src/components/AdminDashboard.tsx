import { useState, FormEvent } from 'react';
import { Product, Customer, Order, Transaction, MainAccount } from '../types';
import { 
  DollarSign, 
  Wallet, 
  CreditCard, 
  Send, 
  Users, 
  Plus, 
  Trash2, 
  ClipboardList, 
  ShoppingBag, 
  CheckSquare, 
  UserPlus, 
  FileCheck2, 
  Eye, 
  TrendingUp, 
  Layers,
  Sparkles,
  AlertCircle,
  X
} from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  customers: Customer[];
  orders: Order[];
  transactions: Transaction[];
  account: MainAccount;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onAddCustomer: (customer: Customer) => void;
  onCheckoutOrder: (orderId: string, paymentMethod: 'efectivo' | 'tarjeta' | 'transferencia') => void;
}

export default function AdminDashboard({
  products,
  customers,
  orders,
  transactions,
  account,
  onAddProduct,
  onDeleteProduct,
  onAddCustomer,
  onCheckoutOrder
}: AdminDashboardProps) {
  // Sub-sections view: 'caja' (billing) | 'productos' (menu modification) | 'clientes' (client list)
  const [activeTab, setActiveTab] = useState<'caja' | 'productos' | 'clientes'>('caja');

  // Product Add Form State
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCategory, setProdCategory] = useState<'tacos' | 'bebidas' | 'adicionales'>('tacos');
  const [prodImage, setProdImage] = useState('tacos_al_pastor'); // preset dropdown or enter URL
  const [customImageURL, setCustomImageURL] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodError, setProdError] = useState('');

  // Customer Add Form State
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custError, setCustError] = useState('');

  // Active Billing State
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'tarjeta' | 'transferencia'>('efectivo');

  // Preset generated image paths and fallback unsplash categories
  const PRESET_IMAGES = [
    { key: 'tacos_al_pastor', label: 'Tacos al Pastor (Generada)', url: '/src/assets/images/tacos_al_pastor_1779764327802.png' },
    { key: 'tacos_de_carne_asada', label: 'Tacos de Asada (Generada)', url: '/src/assets/images/tacos_de_carne_asada_1779764342405.png' },
    { key: 'tacos_campechanos', label: 'Tacos Campechanos (Generada)', url: '/src/assets/images/tacos_campechanos_1779764359612.png' },
    { key: 'agua_de_horchata', label: 'Agua de Horchata (Generada)', url: '/src/assets/images/agua_de_horchata_1779764373781.png' },
    { key: 'gringas', label: 'Gringas / Queso', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80' },
    { key: 'jamaica', label: 'Agua de Jamaica', url: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=600&q=80' },
    { key: 'guacamole', label: 'Guacamole Totopos', url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80' },
    { key: 'custom', label: 'URL de Imagen Personalizada...', url: '' }
  ];

  // Outstanding orders ready for checkout (status: 'listo')
  const pendingCheckoutOrders = orders.filter(o => o.status === 'listo');
  
  // Preparing/Received values
  const activeWorkingOrders = orders.filter(o => o.status === 'recibido' || o.status === 'preparando');

  // Handle product addition
  const handleAddProduct = (e: FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodPrice || !prodDescription.trim()) {
      setProdError('Por favor introduce nombre, precio y una descripción para el producto.');
      return;
    }

    const priceNum = parseFloat(prodPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setProdError('El precio debe ser un número positivo.');
      return;
    }

    // Determine final image URL
    let finalImageUrl = '';
    if (prodImage === 'custom') {
      if (!customImageURL.trim()) {
        setProdError('Introduce una URL de imagen válida o escoge un preset.');
        return;
      }
      finalImageUrl = customImageURL.trim();
    } else {
      const preset = PRESET_IMAGES.find(p => p.key === prodImage);
      finalImageUrl = preset ? preset.url : '';
    }

    const newProd: Product = {
      id: 'prod-' + Date.now(),
      name: prodName.trim(),
      price: priceNum,
      category: prodCategory,
      image: finalImageUrl,
      description: prodDescription.trim()
    };

    onAddProduct(newProd);
    setProdName('');
    setProdPrice('');
    setProdDescription('');
    setCustomImageURL('');
    setProdError('');
    alert(`🌮 ¡Producto "${newProd.name}" agregado con éxito!`);
  };

  // Handle client addition
  const handleAddCustomer = (e: FormEvent) => {
    e.preventDefault();
    if (!custName.trim() || !custPhone.trim() || !custEmail.trim()) {
      setCustError('Por favor completa todos los campos.');
      return;
    }

    if (custPhone.length !== 10) {
      setCustError('El número de teléfono debe constar de 10 dígitos.');
      return;
    }

    const newCust: Customer = {
      id: 'cust-' + Date.now(),
      name: custName.trim(),
      phone: custPhone.trim(),
      email: custEmail.trim(),
      createdAt: new Date().toISOString(),
      acceptedPrivacy: true, // as admin is adding them, they sign agreement
    };

    onAddCustomer(newCust);
    setCustName('');
    setCustPhone('');
    setCustEmail('');
    setCustError('');
    alert(`👤 ¡Cliente "${newCust.name}" registrado con éxito!`);
  };

  // Handle order checkout
  const triggerCheckout = (ordUrl: Order) => {
    setSelectedOrderForPayment(ordUrl);
  };

  const confirmCheckoutOfOrder = () => {
    if (!selectedOrderForPayment) return;
    onCheckoutOrder(selectedOrderForPayment.id, paymentMethod);
    setSelectedOrderForPayment(null);
  };

  return (
    <div className="space-y-6">
      {/* GLOWING METRICS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* GRAND BALANCE */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-md flex items-center justify-between gap-2 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-5 scale-125 translate-x-2 translate-y-[-5px] opacity-[0.03] text-white">
            <DollarSign className="h-20 w-20 stroke-[4]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Caja Principal (Corte)</p>
            <h4 className="text-xl md:text-2xl font-mono font-bold text-amber-400 mt-1">${account.balance} MXN</h4>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold mt-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full w-max">
              <TrendingUp className="h-3 w-3" /> Corte Activo
            </div>
          </div>
          <div className="h-10 w-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        {/* CASH */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-md flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">💵 Efectivo</p>
            <h4 className="text-lg md:text-xl font-mono font-bold text-neutral-200 mt-1">${account.cash} MXN</h4>
            <p className="text-[10px] text-neutral-500 mt-1">Ventas en mostrador físico</p>
          </div>
          <div className="h-9 w-9 bg-neutral-950 rounded-lg flex items-center justify-center text-emerald-500">
            <Wallet className="h-4.5 w-4.5" />
          </div>
        </div>

        {/* CARDS */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-md flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">💳 Tarjeta</p>
            <h4 className="text-lg md:text-xl font-mono font-bold text-neutral-200 mt-1">${account.card} MXN</h4>
            <p className="text-[10px] text-neutral-500 mt-1">Terminal bancaria deb/cred</p>
          </div>
          <div className="h-9 w-9 bg-neutral-950 rounded-lg flex items-center justify-center text-blue-400">
            <CreditCard className="h-4.5 w-4.5" />
          </div>
        </div>

        {/* BANK TRANSFERS */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-md flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">📱 Transferencias</p>
            <h4 className="text-lg md:text-xl font-mono font-bold text-neutral-200 mt-1">${account.transfer} MXN</h4>
            <p className="text-[10px] text-neutral-500 mt-1">SPEI interbancario</p>
          </div>
          <div className="h-9 w-9 bg-neutral-950 rounded-lg flex items-center justify-center text-purple-400">
            <Send className="h-4.5 w-4.5" />
          </div>
        </div>
      </div>

      {/* QUICK STATUS TICKER / NOTIFICATION BANNER */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-950 border border-neutral-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs md:text-sm">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <p className="text-neutral-400">
            Estado de Operación: <strong className="text-neutral-200">{activeWorkingOrders.length} orders activas en cocina</strong>, {' '}
            <strong className="text-amber-400">{pendingCheckoutOrders.length} listas para cobrar</strong>.
          </p>
        </div>
        <div className="text-neutral-500 text-[11px] font-mono select-none">
          Corte de Caja en Vivo: {transactions.length} ventas procesadas
        </div>
      </div>

      {/* ADMIN TABS CONTROL */}
      <div className="flex border-b border-neutral-800 select-none pb-0.5 overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('caja')}
          className={`px-5 py-3 text-xs md:text-sm font-bold uppercase tracking-wider transition-all border-b-2 shrink-0 ${
            activeTab === 'caja' 
              ? 'border-amber-500 text-amber-500 bg-amber-500/5' 
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          🧮 Caja y Cobros Pendientes ({pendingCheckoutOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('productos')}
          className={`px-5 py-3 text-xs md:text-sm font-bold uppercase tracking-wider transition-all border-b-2 shrink-0 ${
            activeTab === 'productos' 
              ? 'border-amber-500 text-amber-500 bg-amber-500/5' 
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          🌮 Agregar / Eliminar Productos ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('clientes')}
          className={`px-5 py-3 text-xs md:text-sm font-bold uppercase tracking-wider transition-all border-b-2 shrink-0 ${
            activeTab === 'clientes' 
              ? 'border-amber-500 text-amber-500 bg-amber-500/5' 
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          👤 Clientes y Contratos ({customers.length})
        </button>
      </div>

      {/* --- BOX 1: CAJA Y COBROS PENDIENTES --- */}
      {activeTab === 'caja' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Outstanding orders lists */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-md">
              <h3 className="font-bold text-neutral-100 text-sm md:text-base mb-4 flex items-center justify-between border-b border-neutral-800 pb-3">
                <span className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-amber-500" /> Cobrar Pedidos Listos
                </span>
                <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full font-bold">
                  {pendingCheckoutOrders.length} cobros pendientes
                </span>
              </h3>

              {pendingCheckoutOrders.length === 0 ? (
                <div className="py-16 text-center text-neutral-500 flex flex-col items-center justify-center gap-2">
                  <CheckSquare className="h-10 w-10 text-neutral-800" />
                  <p className="text-sm">No hay pedidos listos de cocina.</p>
                  <p className="text-xs">Los pedidos aparecerán aquí cuando los cocineros los preparen y terminen.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingCheckoutOrders.map((ord) => (
                    <div 
                      key={ord.id} 
                      className="p-4 bg-neutral-950 rounded-xl border border-neutral-850 hover:border-neutral-800/80 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-grow">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/5 px-2 py-0.5 rounded">
                            #{ord.id}
                          </span>
                          <span className="font-bold text-neutral-200 text-sm">
                            {ord.customerName}
                          </span>
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Items listed */}
                        <div className="bg-neutral-900/30 p-2.5 rounded-lg border border-neutral-800/40 text-xs text-neutral-400 space-y-1">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>
                                <strong className="text-neutral-200 font-semibold">{item.quantity}x</strong> {item.product.name}
                                {item.notes && <span className="text-amber-500 italic ml-1 text-[10px]">({item.notes})</span>}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col items-stretch md:items-end justify-center gap-2 w-full md:w-auto shrink-0">
                        <span className="text-sm font-mono font-bold text-emerald-400 text-center md:text-right">
                          ${ord.total} MXN
                        </span>
                        <button
                          onClick={() => triggerCheckout(ord)}
                          className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950/20"
                        >
                          <DollarSign className="h-4.5 w-4.5" /> Procesar Cobro
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* HISTÓRICO DE TRANSACCIONES / VENTAS RECIENTES */}
          <div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-lg space-y-4">
              <h3 className="font-bold text-neutral-100 text-sm md:text-base border-b border-neutral-800 pb-3 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-emerald-500" /> Ventas Registradas ({transactions.length})
              </h3>

              {transactions.length === 0 ? (
                <p className="text-xs text-neutral-500 text-center py-12">No hay ventas registradas aún hoy.</p>
              ) : (
                <div className="space-y-3.5 max-h-[450px] overflow-y-auto pr-1">
                  {[...transactions].reverse().map((tx) => (
                    <div key={tx.id} className="p-3 bg-neutral-950 rounded-xl border border-neutral-850 flex items-center justify-between text-xs gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-neutral-200 leading-none">{tx.customerName}</span>
                          <span className="text-[9px] font-bold text-neutral-500">#{tx.orderId}</span>
                        </div>
                        <p className="text-[10px] text-neutral-400 flex items-center gap-1">
                          <span>Método:</span>
                          <span className="capitalize font-semibold text-neutral-300">
                            {tx.paymentMethod === 'efectivo' ? '💵 efectivo' : tx.paymentMethod === 'tarjeta' ? '💳 tarjeta' : '📱 transfer'}
                          </span>
                          <span className="text-neutral-600">•</span>
                          <span className="text-[9px] text-neutral-500">
                            {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </p>
                      </div>
                      <span className="font-mono font-bold text-emerald-400 shrink-0">
                        +${tx.amount} MXN
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- BOX 2: PRODUCTOS MANAGER --- */}
      {activeTab === 'productos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form to add a new product */}
          <div className="space-y-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-lg">
              <h3 className="font-bold text-neutral-100 text-sm md:text-base mb-4 flex items-center gap-2 border-b border-neutral-800 pb-3">
                <Plus className="h-5 w-5 text-amber-500" /> Agregar Nuevo Platillo
              </h3>

              <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
                {prodError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4" /> {prodError}
                  </div>
                )}

                <div>
                  <label className="block font-medium text-neutral-400 mb-1">Nombre Comercial de Alimento/Bebida *</label>
                  <input
                    type="text"
                    placeholder="Ejem: Taco Gringo de Asada"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-neutral-400 mb-1">Precio ($MXN) *</label>
                    <input
                      type="number"
                      placeholder="25"
                      min="1"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-neutral-400 mb-1">Categoría *</label>
                    <select
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value as any)}
                    >
                      <option value="tacos">🌮 Tacos</option>
                      <option value="bebidas">🥤 Bebidas</option>
                      <option value="adicionales">🥗 Adicionales</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-neutral-400 mb-2">Preset de Imagenes o Ilustraciones *</label>
                  <select
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none"
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                  >
                    {PRESET_IMAGES.map((img) => (
                      <option key={img.key} value={img.key}>{img.label}</option>
                    ))}
                  </select>
                </div>

                {prodImage === 'custom' && (
                  <div>
                    <label className="block font-medium text-neutral-400 mb-1">URL de Imagen de Internet *</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      value={customImageURL}
                      onChange={(e) => setCustomImageURL(e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <label className="block font-medium text-neutral-400 mb-1">Descripción y Preparación del Platillo *</label>
                  <textarea
                    rows={3}
                    placeholder="Detalla los ingredientes: cebolla, cilantro, tipo de tortilla, picor..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-neutral-950 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs uppercase tracking-widest mt-2"
                >
                  <Plus className="h-4 w-4 stroke-[3]" /> Registrar Platillo
                </button>
              </form>
            </div>
          </div>

          {/* List/Table of current products supporting full DELETE action */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-md">
              <h3 className="font-bold text-neutral-100 text-sm md:text-base border-b border-neutral-800 pb-3 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-amber-500" /> Catálogo Actual de Alimentos
                </span>
                <span className="text-xs bg-neutral-950 text-neutral-400 px-3 py-1 rounded-full font-mono font-semibold">
                  {products.length} productos
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[580px] overflow-y-auto pr-1">
                {products.map((prod) => (
                  <div 
                    key={prod.id} 
                    className="p-3 bg-neutral-950 rounded-xl border border-neutral-850 flex items-start gap-3 hover:border-neutral-800 transition-colors"
                  >
                    <div className="h-16 w-16 rounded-lg bg-neutral-900 overflow-hidden shrink-0 border border-neutral-800">
                      <img 
                        src={prod.image} 
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-grow space-y-1 text-xs">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-neutral-200">{prod.name}</h4>
                        <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded leading-none shrink-0 ml-1">
                          ${prod.price} MXN
                        </span>
                      </div>
                      <p className="text-[10.5px] text-neutral-500 capitalize">{prod.category}</p>
                      <p className="text-[10px] text-neutral-400 line-clamp-1 italic">{prod.description}</p>
                      <button
                        onClick={() => onDeleteProduct(prod.id)}
                        className="text-[10px] text-red-500 hover:text-red-400 hover:underline flex items-center gap-1.5 pt-1 font-semibold"
                      >
                        <Trash2 className="h-3 w-3" /> Eliminar Producto
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- BOX 3: CLIENTES Y CONTRATOS VIEW --- */}
      {activeTab === 'clientes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Direct register customer as Administrator */}
          <div className="space-y-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-lg">
              <h3 className="font-bold text-neutral-100 text-sm md:text-base mb-4 flex items-center gap-2 border-b border-neutral-800 pb-3">
                <UserPlus className="h-5 w-5 text-amber-500" /> Agregar Cliente Manualmente
              </h3>

              <form onSubmit={handleAddCustomer} className="space-y-4 text-xs">
                {custError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs font-semibold">
                    ⚠️ {custError}
                  </div>
                )}
                
                <div>
                  <label className="block font-medium text-neutral-400 mb-1">Nombre Completo del Cliente *</label>
                  <input
                    type="text"
                    placeholder="Ejem: Valeria Fuentes"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-400 mb-1">Celular (10 dígitos) *</label>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="5523456789"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value.replace(/\D/g, ''))}
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-400 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    placeholder="valeria@gmail.com"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none"
                    value={custEmail}
                    onChange={(e) => setCustEmail(e.target.value)}
                  />
                </div>

                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl space-y-1.5 flex items-start gap-2">
                  <FileCheck2 className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-neutral-200">Aviso Ley de Datos Personales</p>
                    <p className="text-[10px] text-neutral-400 leading-normal">
                      Al capturar este cliente, se genera automáticamente su firma del contrato legal y de protección de datos de la taquería.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-neutral-950 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-widest mt-2"
                >
                  <UserPlus className="h-4 w-4" /> Registrar Cliente
                </button>
              </form>
            </div>
          </div>

          {/* List showing registered clients with high legal status badge */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-md">
              <h3 className="font-bold text-neutral-100 text-sm md:text-base border-b border-neutral-800 pb-3 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-amber-500" /> Base de Clientes Oficiales
                </span>
                <span className="text-xs bg-neutral-950 text-neutral-400 px-3 py-1 rounded-full font-mono font-semibold">
                  {customers.length} registrados
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
                {customers.map((cust) => (
                  <div 
                    key={cust.id} 
                    className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-850 space-y-3 hover:border-neutral-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-amber-500/10 rounded-full flex items-center justify-center font-bold text-amber-400 text-sm uppercase">
                        {cust.name[0]}
                      </div>
                      <div className="text-xs">
                        <h4 className="font-bold text-neutral-200">{cust.name}</h4>
                        <p className="text-[11px] text-neutral-400">📞 {cust.phone}</p>
                        <p className="text-[11px] text-neutral-400">✉️ {cust.email}</p>
                      </div>
                    </div>

                    <div className="border-t border-neutral-900 pt-2 flex items-center justify-between gap-2 text-[10px]">
                      <span className="text-neutral-500">Reg: {new Date(cust.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1 text-emerald-400 bg-emerald-400/5 border border-emerald-400/10 px-2 py-0.5 rounded-full font-bold">
                        <FileCheck2 className="h-3.5 w-3.5" /> Contrato Firmado
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PAYMENT CHECKOUT MODAL / POPUP DIALOG --- */}
      {selectedOrderForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm select-none">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-6">
            <button 
              onClick={() => setSelectedOrderForPayment(null)} 
              className="absolute top-4 right-4 p-1.5 bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 hover:text-white rounded-full text-neutral-400 transition-colors shrink-0"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center">
              <span className="text-sm">💶 💳 📱</span>
              <h3 className="font-bold font-sans text-neutral-100 text-xl mt-1">Caja Registradora Principal</h3>
              <p className="text-xs text-neutral-500">Selecciona el método e ingresa el cobro al balance general.</p>
            </div>

            {/* Order Brief */}
            <div className="p-3 bg-neutral-950 border border-neutral-850 rounded-2xl text-xs space-y-2">
              <div className="flex justify-between font-bold border-b border-neutral-900 pb-2">
                <span className="text-neutral-300">Pedido #{selectedOrderForPayment.id}</span>
                <span className="text-neutral-100">{selectedOrderForPayment.customerName}</span>
              </div>
              <div className="space-y-1 font-mono text-neutral-400 text-[11px]">
                {selectedOrderForPayment.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{i.quantity}x {i.product.name}</span>
                    <span>${i.product.price * i.quantity} MXN</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center bg-neutral-900/50 p-2 rounded pt-2 font-bold text-neutral-200 border-t border-neutral-900/50">
                <span>Total de la Cuenta:</span>
                <span className="text-amber-400 text-sm font-mono">${selectedOrderForPayment.total} MXN</span>
              </div>
            </div>

            {/* Select payment method */}
            <div className="space-y-2 text-xs">
              <span className="font-semibold text-neutral-400">Métodos de Recibo de Cuenta:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('efectivo')}
                  className={`py-3 px-1 rounded-2xl flex flex-col items-center justify-center gap-1.5 border transition-all ${
                    paymentMethod === 'efectivo'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span className="text-xl">💵</span>
                  <span>Efectivo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('tarjeta')}
                  className={`py-3 px-1 rounded-2xl flex flex-col items-center justify-center gap-1.5 border transition-all ${
                    paymentMethod === 'tarjeta'
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400 font-bold'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span className="text-xl">💳</span>
                  <span>Tarjeta</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('transferencia')}
                  className={`py-3 px-1 rounded-2xl flex flex-col items-center justify-center gap-1.5 border transition-all ${
                    paymentMethod === 'transferencia'
                      ? 'border-purple-500 bg-purple-500/10 text-purple-400 font-bold'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span className="text-xl">📱</span>
                  <span>Transferencia</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedOrderForPayment(null)}
                className="flex-1 py-3 bg-neutral-950 hover:bg-neutral-800 text-neutral-400 font-bold rounded-xl text-xs border border-neutral-800 hover:text-neutral-200"
              >
                Cancelar Cobro
              </button>
              <button
                onClick={confirmCheckoutOfOrder}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 font-sans"
              >
                <DollarSign className="h-4 w-4" /> Registrar Cobro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
