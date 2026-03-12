import { useState } from "react";
import { useParams } from "react-router-dom";
import { usePost, useComments, useCreateComment, useVote, useMe } from "@placewise/shared";
import type { Comment } from "@placewise/shared";
import { useAuthDialog } from "../contexts/AuthContext";

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="border-l-2 border-gray-200 pl-3 py-1">
      <p className="text-sm text-gray-800">{comment.body}</p>
      <span className="text-xs text-gray-400">
        {new Date(comment.created_at).toLocaleDateString()}
      </span>
    </div>
  );
}

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);
  const { data: post, isLoading } = usePost(postId);
  const { data: comments = [] } = useComments(postId);
  const vote = useVote(postId);
  const createComment = useCreateComment(postId);
  const { data: user } = useMe();
  const { openAuthDialog } = useAuthDialog();
  const [commentBody, setCommentBody] = useState("");

  if (isLoading) return <div className="p-8 text-gray-500">Loading…</div>;
  if (!post) return <div className="p-8 text-red-500">Post not found.</div>;

  const handleVote = (value: 1 | -1) => {
    if (!user) { openAuthDialog(); return; }
    vote.mutate(value);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { openAuthDialog(); return; }
    if (!commentBody.trim()) return;
    createComment.mutate({ body: commentBody }, { onSuccess: () => setCommentBody("") });
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Post */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-1">
            <button onClick={() => handleVote(1)} className="text-gray-400 hover:text-indigo-600 text-xl">▲</button>
            <span className="font-bold text-gray-800">{post.score}</span>
            <button onClick={() => handleVote(-1)} className="text-gray-400 hover:text-red-500 text-xl">▼</button>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h1>
            {post.body && <p className="text-gray-700 mb-3">{post.body}</p>}
            <div className="text-sm text-gray-500 space-y-1">
              <div>📍 {post.location_name}</div>
              <div>
                <a href={post.external_url} target="_blank" rel="noopener noreferrer"
                  className="text-indigo-500 hover:underline break-all">
                  {post.external_url}
                </a>
              </div>
              <div>{new Date(post.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments */}
      <section>
        <h2 className="font-semibold text-gray-800 mb-3">
          Comments ({comments.length})
        </h2>
        <form onSubmit={handleSubmitComment} className="mb-5">
          <textarea
            className="w-full border border-gray-300 rounded p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
            rows={3}
            placeholder={user ? "Add a comment…" : "Sign in to comment…"}
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            onClick={!user ? () => openAuthDialog() : undefined}
            readOnly={!user}
          />
          <button
            type="submit"
            className="mt-2 bg-indigo-600 text-white text-sm px-4 py-1.5 rounded hover:bg-indigo-700"
          >
            {user ? "Comment" : "Sign in to comment"}
          </button>
        </form>

        <div className="flex flex-col gap-3">
          {comments.map((c) => (
            <CommentItem key={c.id} comment={c} />
          ))}
        </div>
      </section>
    </div>
  );
}
