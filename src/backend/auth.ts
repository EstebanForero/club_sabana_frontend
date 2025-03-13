
import { URol } from './common';

export class AuthManager {
  private static TOKEN_KEY = 'authToken';
  private static ROLE_KEY = 'userRol';

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static getUserRol(): URol | null {
    return localStorage.getItem(this.ROLE_KEY) as URol | null;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static login(token: string, userRol: URol): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.ROLE_KEY, userRol);
  }

  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
  }
}
