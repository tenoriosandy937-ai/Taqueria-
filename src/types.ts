export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'tacos' | 'bebidas' | 'adicionales';
  image: string;
  description: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
  acceptedPrivacy: boolean;
}

export interface Cook {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export type OrderStatus = 'recibido' | 'preparando' | 'listo' | 'cobrado_y_entregado';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod?: 'efectivo' | 'tarjeta' | 'transferencia';
  paymentStatus: 'pendiente' | 'pagado';
  assignedCookId?: string;
  assignedCookName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  paymentMethod: 'efectivo' | 'tarjeta' | 'transferencia';
  timestamp: string;
}

export interface MainAccount {
  balance: number;
  cash: number;
  card: number;
  transfer: number;
}
