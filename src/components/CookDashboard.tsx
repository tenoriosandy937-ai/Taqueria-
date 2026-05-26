import { useState } from 'react';
import { Order, Cook, OrderStatus } from '../types';
import { INITIAL_COOKS } from '../data';
import { 
  Flame, 
  CheckCircle, 
  ChefHat, 
  Clock, 
  Utensils, 
  Play, 
  Activity,
  Award
} from 'lucide-react';

interface CookDashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, cookId?: string, cookName?: string) => void;
  activeCookId: string | null;
  onSetActiveCookId: (id: string | null) => void;
}

export default function CookDashboard({
  orders,
  onUpdateOrderStatus,
  activeCookId,
  onSetActiveCookId
}: CookDashboardProps) {
  // Find current active cook
  const currentCook = INITIAL_COOKS.find(c => c.id === activeCookId);

  // Filter orders for the kitchen
  // 1. Pending preparation (status: 'recibido')
  // 2. Active preparation (status: 'preparando' -> specifically by anyone or this cook)
  const incomingOrders = orders.filter(o => o.status === 'recibido');
  const preppingOrders = orders.filter(o => o.status === 'preparando');
  const readyOrders = orders.filter(o => o.status === 'listo');
  
  // Cook's personal stats of prepared orders
  const myCompletedCount = orders.filter(o => 
    o.assignedCookId === activeCookId && 
    (o.status === 'listo' || o.status === 'cobrado_y_entregado')
  ).length;

  const handleSelectCook = (id: string) => {
    onSetActiveCookId(id);
  };

  const handleStartPrep = (orderId: string) => {
    if (!currentCook) return;
    onUpdateOrderStatus(orderId, 'preparando', currentCook.id, currentCook.name);
  };

  const handleFinishPrep = (orderId: string) => {
    onUpdateOrderStatus(orderId, 'listo');
  };

  return (
    <div className="w-full">
      {!currentCook ? (
        <div className="max-w-xl mx-auto my-12">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl text-center">
            <div className="mx-auto h-12 w-12 bg-amber-500/10 text-amber-500 flex items-center justify-center rounded-xl mb-4">
              <ChefHat className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-neutral-100 font-sans">Módulo de Cocina y Preparación</h2>
            <p className="text-sm text-neutral-400 mt-1 mb-6">
              Selecciona tu perfil de cocinero para empezar a despachar comandas calientes de la taquería.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {INITIAL_COOKS.map((cook) => (
                <button
                  key={cook.id}
                  onClick={() => handleSelectCook(cook.id)}
                  className="flex flex-col items-center p-5 bg-neutral-950 border border-neutral-800 hover:border-amber-500/40 rounded-xl hover:shadow-lg hover:shadow-black/20 text-center transition-all group"
                >
                  <span className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">{cook.avatar}</span>
                  <p className="font-bold text-neutral-100 text-sm group-hover:text-amber-400 transition-colors">{cook.name}</p>
                  <p className="text-xs text-neutral-500 mt-1">{cook.specialty}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* HEADER BAR FOR COOK */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 bg-neutral-950 rounded-xl">{currentCook.avatar}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-neutral-100 text-base">{currentCook.name}</h3>
                  <span className="text-[10px] uppercase font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                    Parrillero Activo
                  </span>
                </div>
                <p className="text-xs text-neutral-400">{currentCook.specialty}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800">
                <Award className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-semibold text-neutral-300">Órdenes despachadas: <strong className="text-amber-400 font-mono font-bold">{myCompletedCount}</strong></span>
              </div>
              <button
                onClick={() => onSetActiveCookId(null)}
                className="text-xs px-3 py-1.5 bg-neutral-800 hover:bg-neutral-750 text-neutral-400 hover:text-neutral-200 rounded-lg transition-colors border border-neutral-850"
              >
                Cerrar Cocina / Salir
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. SECCIÓN DE COMANDAS RECIBIDAS (PENDIENTES DE COCINAR) */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-md flex flex-col min-h-[400px]">
              <div className="border-b border-neutral-800 pb-3 mb-4 flex items-center justify-between">
                <h3 className="font-bold text-neutral-100 text-sm md:text-base flex items-center gap-2">
                  <Flame className="h-5 w-5 text-amber-500" />
                  <span>Comandas Nuevas Recibidas</span>
                </h3>
                <span className="text-xs font-mono bg-amber-500/10 text-amber-400 px-2.5 py-0.5 rounded-full font-bold">
                  {incomingOrders.length} por iniciar
                </span>
              </div>

              {incomingOrders.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center py-20 text-neutral-500 gap-2">
                  <Utensils className="h-10 w-10 text-neutral-800 stroke-1" />
                  <p className="text-sm">Tranquilo en los fogones...</p>
                  <p className="text-xs">No hay comandas nuevas en espera en este momento.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {incomingOrders.map((ord) => (
                    <div 
                      key={ord.id} 
                      className="p-4 bg-neutral-950 rounded-xl border border-neutral-850 hover:border-neutral-800 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                      <div className="space-y-2 flex-grow">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono text-amber-400 bg-amber-400/5 border border-amber-400/15 px-2 py-0.5 rounded">
                            #{ord.id}
                          </span>
                          <span className="font-bold text-neutral-200 text-sm">
                            👤 {ord.customerName}
                          </span>
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* List items to prepare */}
                        <div className="bg-neutral-900/40 p-2.5 rounded-lg border border-neutral-800/40 space-y-1">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs text-neutral-300">
                              <span>
                                <strong className="text-neutral-100 text-sm">{item.quantity}x</strong> {item.product.name}
                                {item.notes && (
                                  <span className="text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded italic text-[10px] ml-2 font-medium">
                                    ✍️ {item.notes}
                                  </span>
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => handleStartPrep(ord.id)}
                        className="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/10 transition-transform active:scale-95 cursor-pointer self-stretch md:self-auto justify-center"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" /> Preparar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. SECCIÓN DE PEDIDOS EN PREPARACIÓN */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-md flex flex-col min-h-[400px]">
              <div className="border-b border-neutral-800 pb-3 mb-4 flex items-center justify-between">
                <h3 className="font-bold text-neutral-100 text-sm md:text-base flex items-center gap-2">
                  <Activity className="h-5 w-5 text-amber-500" />
                  <span>En Plancha / Preparando</span>
                </h3>
                <span className="text-xs font-mono bg-neutral-950 text-neutral-400 px-2.5 py-0.5 rounded-full">
                  {preppingOrders.length} cocinando
                </span>
              </div>

              {preppingOrders.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center py-20 text-neutral-500 gap-2">
                  <ChefHat className="h-10 w-10 text-neutral-800 stroke-1" />
                  <p className="text-sm">Planchas limpias en espera...</p>
                  <p className="text-xs">No hay tacos en preparación en este momento.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {preppingOrders.map((ord) => {
                    const isMinions = ord.assignedCookId !== currentCook.id;

                    return (
                      <div 
                        key={ord.id} 
                        className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                          isMinions 
                            ? 'bg-neutral-950/40 border-neutral-900 filter saturate-50' 
                            : 'bg-neutral-950 border-amber-500/20 hover:border-amber-500/35'
                        }`}
                      >
                        <div className="space-y-2 flex-grow">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold font-mono text-amber-400 bg-amber-400/5 px-2 py-0.5 rounded">
                              #{ord.id}
                            </span>
                            <span className="font-bold text-neutral-200 text-sm">
                              👤 {ord.customerName}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-mono">
                              Cocinando
                            </span>
                          </div>

                          {/* List items to prepare */}
                          <div className="bg-neutral-900/40 p-2.5 rounded-lg border border-neutral-800/40 space-y-1">
                            {ord.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-xs text-neutral-300">
                                <span>
                                  <strong className="text-neutral-100 text-sm">{item.quantity}x</strong> {item.product.name}
                                  {item.notes && (
                                    <span className="text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded italic text-[10px] ml-2 font-medium">
                                      ✍️ {item.notes}
                                    </span>
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Cook Tag */}
                          <div className="flex items-center gap-1.5 text-xs text-neutral-400 pl-1">
                            <span>👨‍🍳 Chef:</span>
                            <span className="font-semibold text-neutral-300">
                              {ord.assignedCookName} {isMinions ? '(Colega)' : '(Tú)'}
                            </span>
                          </div>
                        </div>

                        {!isMinions ? (
                          <button
                            onClick={() => handleFinishPrep(ord.id)}
                            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/25 transition-transform active:scale-95 cursor-pointer self-stretch md:self-auto justify-center"
                          >
                            <CheckCircle className="h-3.5 w-3.5" /> Terminar y Despachar
                          </button>
                        ) : (
                          <span className="text-[10.px] text-neutral-500 font-semibold italic p-2 bg-neutral-900 rounded">
                            Preparando colega
                          </span>
                        )}
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
