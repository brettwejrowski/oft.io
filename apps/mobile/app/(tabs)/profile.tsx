import { StyleSheet, Text, View } from "react-native";
import { useMe } from "@placewise/shared";

export default function ProfileScreen() {
  const { data: user, isLoading } = useMe();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.muted}>Loading…</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Sign in to Placewise</Text>
        <Text style={styles.muted}>Google sign-in coming soon</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.username}>@{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.muted}>
          Joined {new Date(user.created_at).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  container: { flex: 1, padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    gap: 6,
  },
  title: { fontSize: 18, fontWeight: "600", color: "#111", marginBottom: 8 },
  username: { fontSize: 20, fontWeight: "700", color: "#111" },
  email: { fontSize: 13, color: "#6b7280" },
  muted: { color: "#9ca3af", fontSize: 12 },
});
