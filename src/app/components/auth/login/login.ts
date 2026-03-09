import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = false;
  isLoading = false;

  private router = inject(Router);
  private authService = inject(AuthService);

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (!this.username.trim() || !this.password.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing fields',
        text: 'Please enter username and password.',
        background: '#111426',
        color: '#ffffff',
        confirmButtonColor: '#8b5cf6',
      });
      return;
    }

    this.isLoading = true;

    this.authService.login(this.username, this.password).subscribe({
      next: (success) => {
        this.isLoading = false;

        if (success) {
          Swal.fire({
            icon: 'success',
            title: 'Login successful',
            text: 'Welcome back.',
            timer: 1200,
            showConfirmButton: false,
            background: '#111426',
            color: '#ffffff',
          }).then(() => {
            this.router.navigate(['/albums']);
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login failed',
            text: 'Invalid username or password.',
            background: '#111426',
            color: '#ffffff',
            confirmButtonColor: '#8b5cf6',
          });
        }
      },
      error: () => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Server error',
          text: 'Make sure JSON Server is running.',
          background: '#111426',
          color: '#ffffff',
          confirmButtonColor: '#8b5cf6',
        });
      },
    });
  }
}
