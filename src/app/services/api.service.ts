import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, MyOrder, OrderHistory } from '../models/model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000';

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`);
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/products`, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/products/${id}`);
  }

  getMyOrders(): Observable<MyOrder[]> {
    return this.http.get<MyOrder[]>(`${this.baseUrl}/myOrders`);
  }

  addToMyOrder(order: MyOrder): Observable<MyOrder> {
    return this.http.post<MyOrder>(`${this.baseUrl}/myOrders`, order);
  }

  updateMyOrder(id: number, order: MyOrder): Observable<MyOrder> {
    return this.http.put<MyOrder>(`${this.baseUrl}/myOrders/${id}`, order);
  }

  deleteMyOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/myOrders/${id}`);
  }

  getOrderHistory(): Observable<OrderHistory[]> {
    return this.http.get<OrderHistory[]>(`${this.baseUrl}/orderHistory`);
  }

  addToOrderHistory(order: OrderHistory): Observable<OrderHistory> {
    return this.http.post<OrderHistory>(`${this.baseUrl}/orderHistory`, order);
  }

  deleteOrderHistory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/orderHistory/${id}`);
  }
}
