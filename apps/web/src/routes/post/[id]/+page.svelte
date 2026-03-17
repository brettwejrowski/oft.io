<script lang="ts">
  import { postsApi } from '@placewise/shared';
  import { auth } from '$lib/auth.svelte';
  import type { PageData } from './$types';
  import type { Comment } from '@placewise/shared';

  let { data }: { data: PageData } = $props();

  let score = $state(data.post.score);
  let comments = $state<Comment[]>(data.comments);
  let commentBody = $state('');
  let submitting = $state(false);

  function vote(value: 1 | -1) {
    auth.requireAuth(async () => {
      try {
        await postsApi.vote(data.post.id, value);
        score += value;
      } catch (err) {
        console.error('Vote failed', err);
      }
    });
  }

  function submitComment(e: SubmitEvent) {
    e.preventDefault();
    if (!commentBody.trim()) return;
    auth.requireAuth(async () => {
      submitting = true;
      try {
        const comment = await postsApi.createComment(data.post.id, { body: commentBody });
        comments = [...comments, comment];
        commentBody = '';
      } catch (err) {
        console.error('Comment failed', err);
      } finally {
        submitting = false;
      }
    });
  }
</script>

<div class="max-w-2xl mx-auto py-8 px-4">
  <!-- Post -->
  <div class="bg-white border border-gray-200 rounded-lg p-5 mb-6">
    <div class="flex gap-4">
      <div class="flex flex-col items-center gap-1 select-none">
        <button onclick={() => vote(1)} class="text-gray-400 hover:text-indigo-600 text-xl transition-colors">▲</button>
        <span class="font-bold text-gray-800">{score}</span>
        <button onclick={() => vote(-1)} class="text-gray-400 hover:text-red-500 text-xl transition-colors">▼</button>
      </div>
      <div class="flex-1">
        <h1 class="text-xl font-bold text-gray-900 mb-2">{data.post.title}</h1>
        {#if data.post.body}
          <p class="text-gray-700 mb-3">{data.post.body}</p>
        {/if}
        <div class="text-sm text-gray-500 space-y-1">
          <div>📍 {data.post.location_name}</div>
          <div>
            <a
              href={data.post.external_url}
              target="_blank"
              rel="noopener noreferrer"
              class="text-indigo-500 hover:underline break-all"
            >
              {data.post.external_url}
            </a>
          </div>
          <div>{new Date(data.post.created_at).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Comments -->
  <section>
    <h2 class="font-semibold text-gray-800 mb-3">Comments ({comments.length})</h2>

    <form onsubmit={submitComment} class="mb-5">
      <textarea
        class="w-full border border-gray-300 rounded p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
        rows={3}
        placeholder="Add a comment…"
        bind:value={commentBody}
      ></textarea>
      <button
        type="submit"
        disabled={submitting}
        class="mt-2 bg-indigo-600 text-white text-sm px-4 py-1.5 rounded hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {submitting ? 'Posting…' : 'Comment'}
      </button>
    </form>

    <div class="flex flex-col gap-3">
      {#each comments as comment (comment.id)}
        <div class="border-l-2 border-gray-200 pl-3 py-1">
          <p class="text-sm text-gray-800">{comment.body}</p>
          <span class="text-xs text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</span>
        </div>
      {/each}
    </div>
  </section>
</div>
