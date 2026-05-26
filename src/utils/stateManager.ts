import { Product, Customer, Order, Transaction, MainAccount } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMERS } from '../data';

export const KEYS = {
  PRODUCTS: 'taqueria_products_v1',
  CUSTOMERS: 'taqueria_customers_v1',
  ORDERS: 'taqueria_orders_v1',
  TRANSACTIONS: 'taqueria_transactions_v1',
  ACCOUNT: 'taqueria_account_v1',
};

export function loadProducts(): Product[] {
  const data = localStorage.getItem(KEYS.PRODUCTS);
  if (!data) {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  return JSON.parse(data);
}

export function saveProducts(products: Product[]) {
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
}

export function loadCustomers(): Customer[] {
  const data = localStorage.getItem(KEYS.CUSTOMERS);
  if (!data) {
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
    return INITIAL_CUSTOMERS;
  }
  return JSON.parse(data);
}

export function saveCustomers(customers: Customer[]) {
  localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(customers));
}

export function loadOrders(): Order[] {
  const data = localStorage.getItem(KEYS.ORDERS);
  return data ? JSON.parse(data) : [];
}

export function saveOrders(orders: Order[]) {
  localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
}

export function loadTransactions(): Transaction[] {
  const data = localStorage.getItem(KEYS.TRANSACTIONS);
  return data ? JSON.parse(data) : [];
}

export function saveTransactions(txs: Transaction[]) {
  localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(txs));
}

export function loadAccount(): MainAccount {
  const data = localStorage.getItem(KEYS.ACCOUNT);
  if (!data) {
    const fresh: MainAccount = { balance: 0, cash: 0, card: 0, transfer: 0 };
    localStorage.setItem(KEYS.ACCOUNT, JSON.stringify(fresh));
    return fresh;
  }
  return JSON.parse(data);
}

export function saveAccount(account: MainAccount) {
  localStorage.setItem(KEYS.ACCOUNT, JSON.stringify(account));
}
