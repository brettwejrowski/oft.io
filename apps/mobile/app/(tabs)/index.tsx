import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { useRouter } from "expo-router";
import { useNearbyPosts } from "@placewise/shared";
import { useState } from "react";

const INITIAL_REGION = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function MapScreen() {
  const router = useRouter();
  const [region, setRegion] = useState(INITIAL_REGION);
  const { data: posts = [] } = useNearbyPosts({
    lat: region.latitude,
    lng: region.longitude,
  });

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={INITIAL_REGION}
        onRegionChangeComplete={setRegion}
        showsUserLocation
      >
        {posts.map((post) => (
          <Marker
            key={post.id}
            coordinate={{ latitude: post.location_lat, longitude: post.location_lng }}
            title={post.title}
            description={post.location_name}
          >
            <Callout onPress={() => router.push(`/post/${post.id}`)}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle} numberOfLines={2}>
                  {post.title}
                </Text>
                <Text style={styles.calloutSub}>{post.location_name}</Text>
                <Text style={styles.calloutLink}>View post →</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/submit")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  callout: { width: 200, padding: 4 },
  calloutTitle: { fontWeight: "600", fontSize: 13 },
  calloutSub: { color: "#666", fontSize: 11, marginTop: 2 },
  calloutLink: { color: "#4f46e5", fontSize: 11, marginTop: 4 },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4f46e5",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  fabText: { color: "#fff", fontSize: 28, lineHeight: 30 },
});
