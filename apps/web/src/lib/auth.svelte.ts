import type { Auth0Client } from '@auth0/auth0-spa-js';
import { configure, authApi } from '@placewise/shared';
import type { User } from '@placewise/shared';

// Svelte 5 universal reactive state — readable from any component via getters
let client: Auth0Client | null = null;
let _isAuthenticated = $state(false);
let _isLoading = $state(true);
let _user = $state<User | null>(null);

async function _exchangeToken() {
  if (!client) return;
  const accessToken = await client.getTokenSilently();
  const { access_token } = await authApi.auth0Login(accessToken);
  configure({ token: access_token });
  localStorage.setItem('placewise_token', access_token);
  _user = await authApi.me();
}

export const auth = {
  get isAuthenticated() {
    return _isAuthenticated;
  },
  get isLoading() {
    return _isLoading;
  },
  get user() {
    return _user;
  },

  async initialize() {
    const { createAuth0Client } = await import('@auth0/auth0-spa-js');

    client = await createAuth0Client({
      domain: import.meta.env.VITE_AUTH0_DOMAIN,
      clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
      authorizationParams: { redirect_uri: window.location.origin },
      cacheLocation: 'localstorage',
    });

    // Handle Auth0 redirect callback (after loginWithRedirect)
    if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
      const { appState } = await client.handleRedirectCallback();
      window.history.replaceState({}, '', appState?.returnTo ?? window.location.pathname);
    }

    _isAuthenticated = await client.isAuthenticated();

    if (_isAuthenticated) {
      try {
        await _exchangeToken();
      } catch (err) {
        console.error('Token exchange failed', err);
      }
    } else {
      // Restore a previously stored Placewise token for anonymous API calls
      const stored = localStorage.getItem('placewise_token');
      if (stored) configure({ token: stored });
    }

    _isLoading = false;
  },

  login(returnTo?: string) {
    client?.loginWithRedirect({
      appState: { returnTo: returnTo ?? window.location.pathname },
    });
  },

  logout() {
    localStorage.removeItem('placewise_token');
    configure({ token: null });
    _user = null;
    _isAuthenticated = false;
    client?.logout({ logoutParams: { returnTo: window.location.origin } });
  },

  /** Run `action` immediately if authenticated, otherwise trigger Auth0 login. */
  requireAuth(action: () => void) {
    if (_isAuthenticated) {
      action();
    } else {
      this.login(typeof window !== 'undefined' ? window.location.pathname : '/');
    }
  },
};
