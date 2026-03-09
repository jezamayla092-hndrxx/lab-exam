import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000';

  login(username: string, password: string): Observable<boolean> {
    return this.http
      .get<any[]>(`${this.baseUrl}/users?username=${username}&password=${password}`)
      .pipe(
        map((users) => {
          if (users.length > 0) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(users[0]));
            return true;
          }
          return false;
        }),
      );
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
}
