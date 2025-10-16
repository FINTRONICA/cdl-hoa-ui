'use client'

import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { SessionController } from '../controllers/sessionController';
import { JWTParser } from '../utils/jwtParser';
import { getAuthCookies, clearAuthCookies } from '../utils/cookieUtils';

export function SessionTracker() {
  const { isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      SessionController.updateActivity();
    };
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });
    
    // TAB/WINDOW RETURN HANDLER: When user switches back to this tab/window
    // Check token expiration and redirect if session expired while user was away
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated) {
        const { token } = getAuthCookies();
        
        // If token expired while user was on another tab/window
        if (token && JWTParser.isExpired(token)) {
          // Clear local auth state
          useAuthStore.getState().clearUser();
          clearAuthCookies();
          
          // Redirect to login with current path for post-login redirect
          const currentPath = window.location.pathname;
          if (currentPath !== '/login') {
            import('../utils/navigation').then(({ serviceNavigation }) => {
              serviceNavigation.goToLogin(currentPath);
            });
          }
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated]);
  
  return null;
}
