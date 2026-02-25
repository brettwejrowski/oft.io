import { useParams } from "react-router-dom";
import { useCommunity, useCommunityPosts } from "@placewise/shared";
import PostCard from "../components/PostCard";

export default function CommunityPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: community, isLoading: loadingCommunity } = useCommunity(slug!);
  const { data: posts = [], isLoading: loadingPosts } = useCommunityPosts(slug!);

  if (loadingCommunity) return <div className="p-8 text-gray-500">Loading…</div>;
  if (!community) return <div className="p-8 text-red-500">Community not found.</div>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{community.name}</h1>
        <span className="inline-block mt-1 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
          {community.topic}
        </span>
        {community.description && (
          <p className="mt-2 text-sm text-gray-600">{community.description}</p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {loadingPosts && <p className="text-gray-400 text-sm">Loading posts…</p>}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {!loadingPosts && posts.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">No posts yet.</p>
        )}
      </div>
    </div>
  );
}
