import type {
  Comment,
  Community,
  CreateCommentInput,
  CreateCommunityInput,
  CreatePostInput,
  NearbyParams,
  Post,
  TokenResponse,
  User,
  Vote,
} from './types';

let BASE_URL = 'http://localhost:8000';
let authToken: string | null = null;

export function configure(options: { baseUrl?: string; token?: string | null }) {
  if (options.baseUrl !== undefined) BASE_URL = options.baseUrl;
  if (options.token !== undefined) authToken = options.token;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${BASE_URL}/api/v1${path}`, { ...options, headers });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`API error ${res.status}: ${detail}`);
  }

  return res.json() as Promise<T>;
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  /** Exchange an Auth0 access token for a Placewise JWT */
  auth0Login: (token: string) =>
    request<TokenResponse>('/auth/auth0', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  /** Legacy Google OAuth ID token exchange */
  googleLogin: (token: string) =>
    request<TokenResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  me: () => request<User>('/auth/me'),
};

// ── Communities ───────────────────────────────────────────────────────────────
export const communitiesApi = {
  list: (params?: { skip?: number; limit?: number }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request<Community[]>(`/communities${qs ? `?${qs}` : ''}`);
  },
  get: (slug: string) => request<Community>(`/communities/${slug}`),
  create: (input: CreateCommunityInput) =>
    request<Community>('/communities', { method: 'POST', body: JSON.stringify(input) }),
  listPosts: (slug: string, params?: { skip?: number; limit?: number }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request<Post[]>(`/communities/${slug}/posts${qs ? `?${qs}` : ''}`);
  },
  createPost: (slug: string, input: CreatePostInput) =>
    request<Post>(`/communities/${slug}/posts`, { method: 'POST', body: JSON.stringify(input) }),
};

// ── Posts ─────────────────────────────────────────────────────────────────────
export const postsApi = {
  get: (id: number) => request<Post>(`/posts/${id}`),
  vote: (id: number, value: 1 | -1) =>
    request<Vote>(`/posts/${id}/vote`, { method: 'POST', body: JSON.stringify({ value }) }),
  listComments: (id: number) => request<Comment[]>(`/posts/${id}/comments`),
  createComment: (id: number, input: CreateCommentInput) =>
    request<Comment>(`/posts/${id}/comments`, { method: 'POST', body: JSON.stringify(input) }),
  nearby: (params: NearbyParams) => {
    const qs = new URLSearchParams(params as unknown as Record<string, string>).toString();
    return request<Post[]>(`/posts/nearby?${qs}`);
  },
};
