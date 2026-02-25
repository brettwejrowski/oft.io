import { useMutation, useQuery } from "@tanstack/react-query";
import { authApi, configure } from "../api";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => authApi.me(),
    retry: false,
  });
}

export function useGoogleLogin() {
  return useMutation({
    mutationFn: async (googleToken: string) => {
      const res = await authApi.googleLogin(googleToken);
      configure({ token: res.access_token });
      return res;
    },
  });
}
