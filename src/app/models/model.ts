export interface Product {
  id?: number;
  title: string;
  artist: string;
  genre: string;
  price: number;
  image: string;
  year?: number;
  description?: string;
}

export interface MyOrder {
  id?: number;
  productId?: number;
  title: string;
  artist: string;
  genre: string;
  price: number;
  image: string;
  quantity: number;
  total: number;
  status: string;
}

export interface OrderHistory {
  id?: number;
  productId?: number;
  title: string;
  artist: string;
  genre: string;
  price: number;
  image: string;
  quantity: number;
  total: number;
  status: string;
  orderedAt: string;
}
