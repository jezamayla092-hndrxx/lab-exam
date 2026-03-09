import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { ApiService } from '../../../services/api.service';
import { OrderHistory } from '../../../models/model';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.html',
  styleUrl: './order-history.scss',
})
export class OrderHistoryComponent implements OnInit {
  private api = inject(ApiService);

  history: OrderHistory[] = [];

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.api.getOrderHistory().subscribe({
      next: (data) => {
        this.history = data.sort(
          (a, b) => new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime(),
        );
      },
      error: () => {
        this.history = [];
      },
    });
  }

  deleteHistoryItem(item: OrderHistory): void {
    if (!item.id) return;

    Swal.fire({
      title: `Delete "${item.title}" from history?`,
      text: 'This record will be removed permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#8b5cf6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      background: '#111426',
      color: '#ffffff',
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.deleteOrderHistory(item.id!).subscribe(() => {
          this.loadHistory();

          Swal.fire({
            icon: 'success',
            title: 'Deleted',
            text: 'History record removed.',
            background: '#111426',
            color: '#ffffff',
            confirmButtonColor: '#8b5cf6',
          });
        });
      }
    });
  }
}
