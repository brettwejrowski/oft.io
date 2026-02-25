import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { Link } from "react-router-dom";
import { useNearbyPosts } from "@placewise/shared";
import PostCard from "../components/PostCard";

const DEFAULT_CENTER: [number, number] = [37.7749, -122.4194]; // San Francisco

function BoundsWatcher({
  onBoundsChange,
}: {
  onBoundsChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    moveend(e) {
      const center = e.target.getCenter();
      onBoundsChange(center.lat, center.lng);
    },
  });
  return null;
}

export default function MapPage() {
  const [center, setCenter] = useState({ lat: DEFAULT_CENTER[0], lng: DEFAULT_CENTER[1] });
  const { data: posts = [] } = useNearbyPosts({ lat: center.lat, lng: center.lng });

  return (
    <div className="flex h-full">
      {/* Map */}
      <div className="flex-1">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <BoundsWatcher onBoundsChange={(lat, lng) => setCenter({ lat, lng })} />
          {posts.map((post) => (
            <Marker key={post.id} position={[post.location_lat, post.location_lng]}>
              <Popup>
                <div className="max-w-xs">
                  <p className="font-semibold">{post.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{post.location_name}</p>
                  <Link to={`/post/${post.id}`} className="text-xs text-indigo-600 mt-1 block">
                    View post →
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Sidebar feed */}
      <aside className="w-80 bg-gray-50 border-l border-gray-200 overflow-y-auto p-3 flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Nearby ({posts.length})
        </h2>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {posts.length === 0 && (
          <p className="text-sm text-gray-400 mt-4 text-center">
            No posts in this area yet.{" "}
            <Link to="/submit" className="text-indigo-600">
              Be the first!
            </Link>
          </p>
        )}
      </aside>
    </div>
  );
}
