import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { LatLng } from "leaflet";
import { useCommunities, useCreatePost } from "@placewise/shared";

function LocationPicker({ onSelect }: { onSelect: (latlng: LatLng) => void }) {
  useMapEvents({ click: (e) => onSelect(e.latlng) });
  return null;
}

export default function SubmitPage() {
  const navigate = useNavigate();
  const { data: communities = [] } = useCommunities();
  const [communitySlug, setCommunitySlug] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [locationName, setLocationName] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [latlng, setLatlng] = useState<LatLng | null>(null);

  const selectedCommunity = communities.find((c) => c.slug === communitySlug);
  const createPost = useCreatePost(communitySlug);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!latlng || !selectedCommunity) return;

    createPost.mutate(
      {
        title,
        body: body || undefined,
        location_name: locationName,
        location_lat: latlng.lat,
        location_lng: latlng.lng,
        external_url: externalUrl,
        community_id: selectedCommunity.id,
      },
      {
        onSuccess: (post) => navigate(`/post/${post.id}`),
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Submit a Place</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Community</label>
          <select
            className="w-full border border-gray-300 rounded p-2 text-sm"
            value={communitySlug}
            onChange={(e) => setCommunitySlug(e.target.value)}
            required
          >
            <option value="">Select a community…</option>
            {communities.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            className="w-full border border-gray-300 rounded p-2 text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. Best ramen in the Mission"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            External Link (Google Maps / Yelp / etc.)
          </label>
          <input
            type="url"
            className="w-full border border-gray-300 rounded p-2 text-sm"
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            required
            placeholder="https://maps.google.com/..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
          <input
            className="w-full border border-gray-300 rounded p-2 text-sm"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            required
            placeholder="e.g. Mensho Tokyo, San Francisco, CA"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pin Location on Map{" "}
            {latlng && (
              <span className="text-xs text-green-600 font-normal">
                ✓ {latlng.lat.toFixed(4)}, {latlng.lng.toFixed(4)}
              </span>
            )}
          </label>
          <div className="h-64 rounded border border-gray-300 overflow-hidden">
            <MapContainer center={[37.7749, -122.4194]} zoom={13} className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationPicker onSelect={setLatlng} />
              {latlng && <Marker position={latlng} />}
            </MapContainer>
          </div>
          <p className="text-xs text-gray-400 mt-1">Click the map to pin the location.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <textarea
            className="w-full border border-gray-300 rounded p-2 text-sm resize-none"
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Tell your community what makes this place special…"
          />
        </div>

        <button
          type="submit"
          disabled={!latlng || createPost.isPending}
          className="w-full bg-indigo-600 text-white py-2 rounded font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {createPost.isPending ? "Submitting…" : "Submit Post"}
        </button>
      </form>
    </div>
  );
}
