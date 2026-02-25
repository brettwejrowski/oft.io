import { Link } from "react-router-dom";
import { useVote } from "@placewise/shared";
import type { Post } from "@placewise/shared";

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props) {
  const vote = useVote(post.id);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex gap-3">
        {/* Voting */}
        <div className="flex flex-col items-center gap-1 text-gray-500">
          <button
            onClick={() => vote.mutate(1)}
            className="hover:text-indigo-600 text-lg leading-none"
          >
            ▲
          </button>
          <span className="text-sm font-semibold text-gray-700">{post.score}</span>
          <button
            onClick={() => vote.mutate(-1)}
            className="hover:text-red-500 text-lg leading-none"
          >
            ▼
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Link to={`/post/${post.id}`} className="font-medium text-gray-900 hover:text-indigo-600 line-clamp-2">
            {post.title}
          </Link>
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
            <span>📍 {post.location_name}</span>
            <a
              href={post.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 hover:underline truncate"
            >
              {post.external_url}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
