import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { configure } from "@placewise/shared";
import Constants from "expo-constants";

configure({ baseUrl: Constants.expoConfig?.extra?.apiUrl ?? "http://localhost:8000" });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="post/[id]" options={{ title: "Post" }} />
        <Stack.Screen name="submit" options={{ title: "Submit a Place" }} />
      </Stack>
    </QueryClientProvider>
  );
}
