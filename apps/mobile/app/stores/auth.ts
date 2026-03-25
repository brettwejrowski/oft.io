import { writable, derived } from 'svelte/store';
import { ApplicationSettings } from '@nativescript/core';
import { configure, authApi } from '@placewise/shared';
import type { User } from '@placewise/shared';

const TOKEN_KEY = 'placewise_token';

export const isAuthenticated = writable(false);
export const isLoading = writable(true);
export const user = writable<User | null>(null);

/** Load stored token on app start and validate it against /auth/me */
export async function initAuth() {
  const stored = ApplicationSettings.getString(TOKEN_KEY);
  if (stored) {
    configure({ token: stored });
    try {
      const me = await authApi.me();
      user.set(me);
      isAuthenticated.set(true);
    } catch {
      // Token expired — clear it
      ApplicationSettings.remove(TOKEN_KEY);
      configure({ token: null });
    }
  }
  isLoading.set(false);
}

/** Called after a successful Auth0 native login with an Auth0 access token */
export async function loginWithAuth0Token(auth0AccessToken: string) {
  const { access_token } = await authApi.auth0Login(auth0AccessToken);
  configure({ token: access_token });
  ApplicationSettings.setString(TOKEN_KEY, access_token);
  const me = await authApi.me();
  user.set(me);
  isAuthenticated.set(true);
}

export function logout() {
  ApplicationSettings.remove(TOKEN_KEY);
  configure({ token: null });
  user.set(null);
  isAuthenticated.set(false);
}

/**
 * Run `action` if authenticated, otherwise call `onUnauthenticated`.
 * Screens pass `onUnauthenticated` to navigate to the profile/login screen.
 */
export function requireAuth(action: () => void, onUnauthenticated: () => void) {
  const unsubscribe = isAuthenticated.subscribe((authenticated) => {
    unsubscribe();
    if (authenticated) {
      action();
    } else {
      onUnauthenticated();
    }
  });
}
