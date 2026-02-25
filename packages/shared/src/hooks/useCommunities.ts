import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { communitiesApi } from "../api";
import type { CreateCommunityInput, CreatePostInput } from "../types";

export function useCommunities() {
  return useQuery({
    queryKey: ["communities"],
    queryFn: () => communitiesApi.list(),
  });
}

export function useCommunity(slug: string) {
  return useQuery({
    queryKey: ["communities", slug],
    queryFn: () => communitiesApi.get(slug),
    enabled: !!slug,
  });
}

export function useCreateCommunity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCommunityInput) => communitiesApi.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["communities"] }),
  });
}

export function useCommunityPosts(slug: string) {
  return useQuery({
    queryKey: ["communities", slug, "posts"],
    queryFn: () => communitiesApi.listPosts(slug),
    enabled: !!slug,
  });
}

export function useCreatePost(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePostInput) => communitiesApi.createPost(slug, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["communities", slug, "posts"] });
      qc.invalidateQueries({ queryKey: ["posts", "nearby"] });
    },
  });
}
