export type ItemType = 'service' | 'product';

export interface CatalogItem {
  id: string;
  name: string;
  price: number;
  type: ItemType;
}

export interface Employee {
  id: string;
  name: string;
}

export interface Sale {
  id: string;
  timestamp: string;
  employeeId: string;
  items: { itemId: string; quantity: number }[];
  amount: number;
  paymentMethod: 'cash' | 'qr';
  notes?: string;
}

export interface DailyClosing {
  date: string;
  totalAmount: number;
}
