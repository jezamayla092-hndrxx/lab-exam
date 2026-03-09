import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class LayoutComponent {
  sidebarOpen = true;
  profileDropdownOpen = false;

  private router = inject(Router);
  private authService = inject(AuthService);

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleProfileDropdown(event: Event): void {
    event.stopPropagation();
    this.profileDropdownOpen = !this.profileDropdownOpen;
  }

  closeProfileDropdown(): void {
    this.profileDropdownOpen = false;
  }

  onProfileClick(): void {
    this.closeProfileDropdown();
  }

  onSettingsClick(): void {
    this.closeProfileDropdown();
  }

  logout(): void {
    this.authService.logout();
    this.closeProfileDropdown();
    this.router.navigate(['/login']);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeProfileDropdown();
  }
}
