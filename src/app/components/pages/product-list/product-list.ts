import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { Product } from '../../../models/model';
import { ApiService } from '../../../services/api.service';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe,
    DialogModule,
    ButtonModule,
    InputTextModule,
    ConfirmDialogModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductListComponent implements OnInit {
  private api = inject(ApiService);

  products: Product[] = [];
  filteredProducts: Product[] = [];

  searchTerm = '';
  dialogVisible = false;
  isEditMode = false;
  loading = false;

  genreOptions = [
    { label: 'RAP', value: 'RAP' },
    { label: 'R&B', value: 'R&B' },
    { label: 'HIP-HOP', value: 'HIP-HOP' },
  ];

  form: any = {
    title: '',
    artist: '',
    genre: 'RAP',
    price: null,
    year: new Date().getFullYear(),
    image: '',
    description: '',
  };

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.api.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.products = [];
        this.filteredProducts = [];

        Swal.fire({
          icon: 'error',
          title: 'Failed to load albums',
          text: 'Please make sure JSON Server is running on port 3000.',
          background: '#111426',
          color: '#ffffff',
          confirmButtonColor: '#8b5cf6',
        });
      },
    });
  }

  applyFilter(): void {
    const keyword = this.searchTerm.trim().toLowerCase();

    if (!keyword) {
      this.filteredProducts = [...this.products];
      return;
    }

    this.filteredProducts = this.products.filter(
      (product: any) =>
        product.title?.toLowerCase().includes(keyword) ||
        product.artist?.toLowerCase().includes(keyword) ||
        product.genre?.toLowerCase().includes(keyword),
    );
  }

  openAddDialog(): void {
    this.isEditMode = false;
    this.form = {
      title: '',
      artist: '',
      genre: 'RAP',
      price: null,
      year: new Date().getFullYear(),
      image: '',
      description: '',
    };
    this.dialogVisible = true;
  }

  openEditDialog(product: any): void {
    this.isEditMode = true;
    this.form = {
      ...product,
      year: product.year || new Date().getFullYear(),
      description: product.description || '',
    };
    this.dialogVisible = true;
  }

  saveProduct(): void {
    if (
      !this.form.title?.trim() ||
      !this.form.artist?.trim() ||
      !this.form.genre?.trim() ||
      !this.form.image?.trim() ||
      !this.form.price ||
      this.form.price <= 0
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete fields',
        text: 'Please complete all required album fields.',
        background: '#111426',
        color: '#ffffff',
        confirmButtonColor: '#8b5cf6',
      });
      return;
    }

    const payload = {
      title: this.form.title,
      artist: this.form.artist,
      genre: this.form.genre,
      price: Number(this.form.price),
      year: Number(this.form.year) || new Date().getFullYear(),
      image: this.form.image,
      description: this.form.description || '',
    };

    if (this.isEditMode && this.form.id) {
      this.api.updateProduct(this.form.id, { ...this.form, ...payload }).subscribe({
        next: () => {
          this.dialogVisible = false;
          this.loadProducts();

          Swal.fire({
            icon: 'success',
            title: 'Updated',
            text: 'Album updated successfully.',
            background: '#111426',
            color: '#ffffff',
            confirmButtonColor: '#8b5cf6',
          });
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Update failed',
            text: 'Something went wrong while updating the album.',
            background: '#111426',
            color: '#ffffff',
            confirmButtonColor: '#8b5cf6',
          });
        },
      });
    } else {
      this.api.addProduct(payload as any).subscribe({
        next: () => {
          this.dialogVisible = false;
          this.loadProducts();

          Swal.fire({
            icon: 'success',
            title: 'Added',
            text: 'Album added successfully.',
            background: '#111426',
            color: '#ffffff',
            confirmButtonColor: '#8b5cf6',
          });
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Add failed',
            text: 'Something went wrong while adding the album.',
            background: '#111426',
            color: '#ffffff',
            confirmButtonColor: '#8b5cf6',
          });
        },
      });
    }
  }

  confirmDelete(product: any): void {
    if (!product.id) return;

    Swal.fire({
      title: `Delete "${product.title}"?`,
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#8b5cf6',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      background: '#111426',
      color: '#ffffff',
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.deleteProduct(product.id).subscribe({
          next: () => {
            this.loadProducts();

            Swal.fire({
              icon: 'success',
              title: 'Deleted',
              text: 'Album deleted successfully.',
              background: '#111426',
              color: '#ffffff',
              confirmButtonColor: '#8b5cf6',
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Delete failed',
              text: 'Something went wrong while deleting the album.',
              background: '#111426',
              color: '#ffffff',
              confirmButtonColor: '#8b5cf6',
            });
          },
        });
      }
    });
  }

  addToCart(product: any): void {
    this.api.getMyOrders().subscribe({
      next: (orders) => {
        const existing = orders.find((item: any) => item.title === product.title);

        if (existing && existing.id) {
          const updatedOrder = {
            ...existing,
            quantity: existing.quantity + 1,
            total: (existing.quantity + 1) * existing.price,
          };

          this.api.updateMyOrder(existing.id, updatedOrder).subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Cart Updated',
                text: `${product.title} quantity increased in your cart.`,
                background: '#111426',
                color: '#ffffff',
                confirmButtonColor: '#8b5cf6',
              });
            },
          });
        } else {
          const orderPayload = {
            productId: product.id,
            title: product.title,
            artist: product.artist,
            genre: product.genre,
            price: product.price,
            image: product.image,
            quantity: 1,
            total: product.price,
            status: 'In Cart',
          };

          this.api.addToMyOrder(orderPayload).subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Added to Cart',
                text: `${product.title} was added to your cart.`,
                background: '#111426',
                color: '#ffffff',
                confirmButtonColor: '#8b5cf6',
              });
            },
            error: () => {
              Swal.fire({
                icon: 'error',
                title: 'Cart failed',
                text: 'Could not add album to cart.',
                background: '#111426',
                color: '#ffffff',
                confirmButtonColor: '#8b5cf6',
              });
            },
          });
        }
      },
    });
  }

  trackById(index: number, product: any): number | undefined {
    return product.id;
  }
}
