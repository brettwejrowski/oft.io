import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi, configure } from "../api";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => authApi.me(),
    retry: false,
  });
}

export function useGoogleLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (googleToken: string) => {
      const res = await authApi.googleLogin(googleToken);
      configure({ token: res.access_token });
      localStorage.setItem("placewise_token", res.access_token);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useSetUsername() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (username: string) => authApi.setUsername(username),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  return () => {
    localStorage.removeItem("placewise_token");
    configure({ token: null });
    queryClient.clear();
  };
}
