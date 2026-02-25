// Mirrors the Pydantic schemas from apps/api/app/schemas/

export interface User {
  id: number;
  email: string;
  username: string;
  avatar_url: string | null;
  created_at: string; // ISO datetime
}

export interface Community {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  topic: string;
  created_by: number;
  created_at: string;
}

export interface Post {
  id: number;
  title: string;
  body: string | null;
  location_name: string;
  location_lat: number;
  location_lng: number;
  external_url: string;
  user_id: number;
  community_id: number;
  score: number;
  created_at: string;
}

export interface Vote {
  id: number;
  user_id: number;
  post_id: number;
  value: 1 | -1;
}

export interface Comment {
  id: number;
  body: string;
  user_id: number;
  post_id: number;
  parent_comment_id: number | null;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

// Request bodies
export interface CreateCommunityInput {
  slug: string;
  name: string;
  description?: string;
  topic: string;
}

export interface CreatePostInput {
  title: string;
  body?: string;
  location_name: string;
  location_lat: number;
  location_lng: number;
  external_url: string;
  community_id: number;
}

export interface CreateCommentInput {
  body: string;
  parent_comment_id?: number;
}

export interface NearbyParams {
  lat: number;
  lng: number;
  radius_km?: number;
  limit?: number;
}
