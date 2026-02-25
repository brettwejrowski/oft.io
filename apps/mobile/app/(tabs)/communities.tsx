import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useCommunities } from "@placewise/shared";

export default function CommunitiesScreen() {
  const router = useRouter();
  const { data: communities = [], isLoading } = useCommunities();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.muted}>Loading…</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={communities}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push(`/c/${item.slug}`)}
        >
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.topic}>{item.topic}</Text>
          {item.description && (
            <Text style={styles.desc} numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <Text style={[styles.muted, { textAlign: "center", marginTop: 40 }]}>
          No communities yet.
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  name: { fontSize: 15, fontWeight: "600", color: "#111" },
  topic: {
    fontSize: 11,
    color: "#4f46e5",
    backgroundColor: "#eef2ff",
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  desc: { fontSize: 12, color: "#6b7280", marginTop: 6 },
  muted: { color: "#9ca3af", fontSize: 13 },
});
