import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useRouter } from "expo-router";
import { useCommunities, useCreatePost } from "@placewise/shared";

export default function SubmitScreen() {
  const router = useRouter();
  const { data: communities = [] } = useCommunities();
  const [communityId, setCommunityId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [locationName, setLocationName] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [pinCoord, setPinCoord] = useState<{ latitude: number; longitude: number } | null>(null);

  const selectedCommunity = communities.find((c) => c.id === communityId);
  const createPost = useCreatePost(selectedCommunity?.slug ?? "");

  const handleSubmit = () => {
    if (!pinCoord || !selectedCommunity) {
      Alert.alert("Missing info", "Please select a community and pin a location on the map.");
      return;
    }

    createPost.mutate(
      {
        title,
        body: body || undefined,
        location_name: locationName,
        location_lat: pinCoord.latitude,
        location_lng: pinCoord.longitude,
        external_url: externalUrl,
        community_id: selectedCommunity.id,
      },
      {
        onSuccess: (post) => router.replace(`/post/${post.id}`),
        onError: () => Alert.alert("Error", "Could not submit post. Are you signed in?"),
      }
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Community</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
          {communities.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[styles.chip, communityId === c.id && styles.chipActive]}
              onPress={() => setCommunityId(c.id)}
            >
              <Text style={[styles.chipText, communityId === c.id && styles.chipTextActive]}>
                {c.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Best ramen in the Mission" />

        <Text style={styles.label}>External Link</Text>
        <TextInput
          style={styles.input}
          value={externalUrl}
          onChangeText={setExternalUrl}
          placeholder="https://maps.google.com/..."
          keyboardType="url"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Location Name</Text>
        <TextInput
          style={styles.input}
          value={locationName}
          onChangeText={setLocationName}
          placeholder="Mensho Tokyo, San Francisco, CA"
        />

        <Text style={styles.label}>
          Pin Location{" "}
          {pinCoord && (
            <Text style={styles.pinConfirm}>
              ✓ {pinCoord.latitude.toFixed(4)}, {pinCoord.longitude.toFixed(4)}
            </Text>
          )}
        </Text>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 37.7749,
              longitude: -122.4194,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            onPress={(e) => setPinCoord(e.nativeEvent.coordinate)}
          >
            {pinCoord && <Marker coordinate={pinCoord} />}
          </MapView>
        </View>
        <Text style={styles.hint}>Tap the map to pin the location.</Text>

        <Text style={styles.label}>Description (optional)</Text>
        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: "top" }]}
          value={body}
          onChangeText={setBody}
          placeholder="What makes this place special?"
          multiline
        />

        <TouchableOpacity
          style={[styles.submitBtn, (!pinCoord || createPost.isPending) && { opacity: 0.5 }]}
          onPress={handleSubmit}
          disabled={!pinCoord || createPost.isPending}
        >
          <Text style={styles.submitBtnText}>
            {createPost.isPending ? "Submitting…" : "Submit Post"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 4 },
  label: { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 4, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    backgroundColor: "#fff",
    marginBottom: 2,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  chipActive: { backgroundColor: "#4f46e5", borderColor: "#4f46e5" },
  chipText: { fontSize: 12, color: "#374151" },
  chipTextActive: { color: "#fff" },
  mapContainer: { height: 220, borderRadius: 8, overflow: "hidden", borderWidth: 1, borderColor: "#d1d5db" },
  map: { flex: 1 },
  hint: { fontSize: 11, color: "#9ca3af", marginTop: 4, marginBottom: 2 },
  pinConfirm: { color: "#16a34a", fontWeight: "400" },
  submitBtn: {
    backgroundColor: "#4f46e5",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  submitBtnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
});
