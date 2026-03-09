import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login';
import { LayoutComponent } from './components/main/layout/layout';
import { ProductListComponent } from './components/pages/product-list/product-list';
import { MyOrderComponent } from './components/pages/my-order/my-order';
import { OrderHistoryComponent } from './components/pages/order-history/order-history';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'albums', component: ProductListComponent },
      { path: 'my-order', component: MyOrderComponent },
      { path: 'order-history', component: OrderHistoryComponent },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
