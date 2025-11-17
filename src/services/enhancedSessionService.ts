import { apiClient } from '@/lib/apiClient';
import { serviceNavigation } from '@/utils/navigation';
import { getAuthCookies, setAuthCookies } from '@/utils/cookieUtils';
import { JWTParser } from '@/utils/jwtParser';

export class EnhancedSessionService {
  private static readonly TIMEOUT_MINUTES = 30;
  private static readonly WARNING_MINUTES = 5;
  private static readonly CHECK_INTERVAL = 60000; // 1 minute
  private static readonly ACTIVITY_UPDATE_INTERVAL = 300000; // 5 minutes
  private static refreshTimer?: NodeJS.Timeout;
  private static activityTimer?: NodeJS.Timeout;
  private static sessionTimer?: NodeJS.Timeout;
  private static lastActivityUpdate = 0;
  private static isRedirecting = false; // Prevent multiple simultaneous redirects

  static startSession(): void {
    if (typeof window === 'undefined') return;
    const now = Date.now();
    const timeoutMs = this.TIMEOUT_MINUTES * 60 * 1000;

    // Store session data
    localStorage.setItem('session_start', now.toString());
    localStorage.setItem('session_timeout', (now + timeoutMs).toString());
    localStorage.setItem('last_activity', now.toString());

    // Start timers
    this.startSessionTimer();
    this.startActivityUpdateTimer();
    this.setupTokenRefresh();
  }

  static updateActivity(): void {
    if (typeof window === 'undefined') return;
    const now = Date.now();
    localStorage.setItem('last_activity', now.toString());
    
    // Update server-side session activity every 5 minutes
    if (now - this.lastActivityUpdate > this.ACTIVITY_UPDATE_INTERVAL) {
      this.updateServerActivity();
      this.lastActivityUpdate = now;
    }
  }

  private static async updateServerActivity(): Promise<void> {
    // Heartbeat disabled: no network call
    return;
  }

  private static setupTokenRefresh(): void {
    this.clearTokenRefresh();
    
    const { token } = getAuthCookies();
    if (!token) return;

    const tokenInfo = JWTParser.parseToken(token);
    if (!tokenInfo) return;

    // Validate exp field exists and is a number
    const exp = tokenInfo.payload.exp;
    if (exp === undefined || exp === null || typeof exp !== 'number') {
      // Token is invalid, but don't logout immediately - let other checks handle it
      return;
    }

    const expiresTime = exp * 1000;
    const now = Date.now();
    const timeUntilExpiry = expiresTime - now - 60000; // Refresh 1 minute before expiry

    if (timeUntilExpiry > 0) {
      this.refreshTimer = setTimeout(() => {
        this.refreshToken();
      }, timeUntilExpiry);
    }
  }

  private static async refreshToken(): Promise<void> {
    try {
      const { token } = getAuthCookies();
      if (!token) return;

      const response = await apiClient.post<{
        token: string;
        refreshToken: string;
        expiresAt: string;
        user: any;
      }>('/auth/refresh', {
        refreshToken: `refresh_${this.getSessionId()}`
      });

      // Update stored tokens
      setAuthCookies(
        response.token,
        'user', // This should be actual user type
        'user', // This should be actual user name
        'user'  // This should be actual user ID
      );

      // Setup next refresh
      this.setupTokenRefresh();
      
    } catch {
      // Only logout if token is actually expired, not just if refresh failed
      // Network errors or temporary server issues shouldn't cause immediate logout
      const { token } = getAuthCookies();
      
      if (token && JWTParser.isExpired(token)) {
        // Token is expired, logout is appropriate
        this.handleSessionExpiry();
      } else {
        // Token is still valid, just refresh failed - try again later
        // Retry refresh in 1 minute instead of logging out
        this.refreshTimer = setTimeout(() => {
          this.refreshToken();
        }, 60000); // Retry in 1 minute
      }
    }
  }

  private static getSessionId(): string {
    // Extract session ID from cookies or generate one
    const sessionCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('sessionId='));
    
    return sessionCookie?.split('=')[1] || 'unknown';
  }

  static checkSessionTimeout(): boolean {
    if (typeof window === 'undefined') return true;
    const lastActivity = localStorage.getItem('last_activity');
    const sessionTimeout = localStorage.getItem('session_timeout');

    if (!lastActivity || !sessionTimeout) {
      return true;
    }

    const now = Date.now();
    const timeSinceActivity = now - parseInt(lastActivity);
    const timeoutMs = this.TIMEOUT_MINUTES * 60 * 1000;

    return timeSinceActivity > timeoutMs;
  }

  static shouldShowWarning(): boolean {
    if (typeof window === 'undefined') return false;
    const lastActivity = localStorage.getItem('last_activity');
    if (!lastActivity) return false;

    const now = Date.now();
    const timeSinceActivity = now - parseInt(lastActivity);
    const warningTime = (this.TIMEOUT_MINUTES - this.WARNING_MINUTES) * 60 * 1000;

    return timeSinceActivity > warningTime;
  }

  static async extendSession(): Promise<void> {
    try {
      // Update activity
      this.updateActivity();
      
      // Try to refresh token
      await this.refreshToken();
      
    } catch {
      // Only logout if token is actually expired
      const { token } = getAuthCookies();
      
      if (token && JWTParser.isExpired(token)) {
        // Token is expired, logout is appropriate
        this.handleSessionExpiry();
      } else {
        // Session extension failed but token still valid - log error but don't logout
        // This prevents users from being logged out due to temporary network issues
      }
    }
  }

  private static startSessionTimer(): void {
    // Clear existing timer to prevent memory leaks
    this.clearSessionTimer();
    
    this.sessionTimer = setInterval(() => {
      if (this.checkSessionTimeout()) {
        this.handleSessionExpiry();
      }
    }, this.CHECK_INTERVAL);
  }

  private static clearSessionTimer(): void {
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
      this.sessionTimer = undefined as any;
    }
  }

  private static startActivityUpdateTimer(): void {
    this.activityTimer = setInterval(() => {
      this.updateActivity();
    }, this.ACTIVITY_UPDATE_INTERVAL);
  }

  static handleSessionExpiry(): void {
    // Prevent multiple simultaneous redirects
    if (this.isRedirecting) {
      return;
    }
    
    this.isRedirecting = true;
    this.clearTimers();
    
    // Save any pending form data before logout
    this.savePendingFormData();
    
    // Clear all data
    if (typeof window !== 'undefined') {
    localStorage.clear();
    sessionStorage.clear();
    }
    
    // Clear cookies
    if (typeof document !== 'undefined') {
      document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      });
    }

    // Redirect to login
    serviceNavigation.goToLogin();
  }

  private static savePendingFormData(): void {
    if (typeof window === 'undefined') return;
    try {
      // Save any form data that might be in localStorage
      const formKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('form_') || key.includes('draft')
      );
      
    } catch (error) {
      console.error('Failed to save pending form data:', error);
    }
  }

  private static clearTimers(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = undefined as any;
    }
    if (this.activityTimer) {
      clearInterval(this.activityTimer);
      this.activityTimer = undefined as any;
    }
    this.clearSessionTimer();
  }

  private static clearTokenRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = undefined as any;
    }
  }

  static destroy(): void {
    this.clearTimers();
    this.isRedirecting = false; // Reset redirect flag on destroy
  }
}
