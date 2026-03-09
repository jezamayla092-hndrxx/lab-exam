import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { ApiService } from '../../../services/api.service';
import { MyOrder } from '../../../models/model';

@Component({
  selector: 'app-my-order',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './my-order.html',
  styleUrl: './my-order.scss',
})
export class MyOrderComponent implements OnInit {
  private api = inject(ApiService);

  orders: MyOrder[] = [];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.api.getMyOrders().subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: () => {
        this.orders = [];
      },
    });
  }

  increaseQty(order: MyOrder): void {
    if (!order.id) return;

    const updated = {
      ...order,
      quantity: order.quantity + 1,
      total: (order.quantity + 1) * order.price,
    };

    this.api.updateMyOrder(order.id, updated).subscribe(() => {
      this.loadOrders();
    });
  }

  decreaseQty(order: MyOrder): void {
    if (!order.id || order.quantity <= 1) return;

    const updated = {
      ...order,
      quantity: order.quantity - 1,
      total: (order.quantity - 1) * order.price,
    };

    this.api.updateMyOrder(order.id, updated).subscribe(() => {
      this.loadOrders();
    });
  }

  removeOrder(order: MyOrder): void {
    if (!order.id) return;

    Swal.fire({
      title: `Remove "${order.title}"?`,
      text: 'This item will be removed from your cart.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#8b5cf6',
      confirmButtonText: 'Remove',
      cancelButtonText: 'Cancel',
      background: '#111426',
      color: '#ffffff',
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.deleteMyOrder(order.id!).subscribe(() => {
          this.loadOrders();

          Swal.fire({
            icon: 'success',
            title: 'Removed',
            text: 'Item removed from cart.',
            background: '#111426',
            color: '#ffffff',
            confirmButtonColor: '#8b5cf6',
          });
        });
      }
    });
  }

  checkoutOrder(order: MyOrder): void {
    if (!order.id) return;

    const historyPayload = {
      productId: order.productId,
      title: order.title,
      artist: order.artist,
      genre: order.genre,
      price: order.price,
      image: order.image,
      quantity: order.quantity,
      total: order.total,
      status: 'Completed',
      orderedAt: new Date().toISOString(),
    };

    Swal.fire({
      title: `Buy "${order.title}"?`,
      text: 'This will move the order to history.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#8b5cf6',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Buy Now',
      cancelButtonText: 'Cancel',
      background: '#111426',
      color: '#ffffff',
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.addToOrderHistory(historyPayload).subscribe({
          next: () => {
            this.api.deleteMyOrder(order.id!).subscribe(() => {
              this.loadOrders();

              Swal.fire({
                icon: 'success',
                title: 'Purchase Complete',
                text: `${order.title} has been added to order history.`,
                background: '#111426',
                color: '#ffffff',
                confirmButtonColor: '#8b5cf6',
              });
            });
          },
        });
      }
    });
  }

  get cartTotal(): number {
    return this.orders.reduce((sum, item) => sum + item.total, 0);
  }
}
