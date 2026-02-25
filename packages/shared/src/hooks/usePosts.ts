import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postsApi } from "../api";
import type { CreateCommentInput, NearbyParams } from "../types";

export function usePost(id: number) {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: () => postsApi.get(id),
    enabled: !!id,
  });
}

export function useNearbyPosts(params: NearbyParams) {
  return useQuery({
    queryKey: ["posts", "nearby", params],
    queryFn: () => postsApi.nearby(params),
  });
}

export function useVote(postId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (value: 1 | -1) => postsApi.vote(postId, value),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts", postId] });
      qc.invalidateQueries({ queryKey: ["posts", "nearby"] });
    },
  });
}

export function useComments(postId: number) {
  return useQuery({
    queryKey: ["posts", postId, "comments"],
    queryFn: () => postsApi.listComments(postId),
    enabled: !!postId,
  });
}

export function useCreateComment(postId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCommentInput) => postsApi.createComment(postId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts", postId, "comments"] }),
  });
}
