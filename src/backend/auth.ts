
import { URol } from './common';

export class AuthManager {
  private static TOKEN_KEY = 'authToken';
  private static ROLE_KEY = 'userRol';
  private static USER_ID_KEY = 'userId';

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static getUserRol(): URol | null {
    return localStorage.getItem(this.ROLE_KEY) as URol | null;
  }

  static getUserId(): string | null {
    return localStorage.getItem(this.USER_ID_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static login(token: string, userRol: URol, userId: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.ROLE_KEY, userRol);
    localStorage.setItem(this.USER_ID_KEY, userId);
  }

  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    localStorage.removeItem(this.USER_ID_KEY);
  }
}
