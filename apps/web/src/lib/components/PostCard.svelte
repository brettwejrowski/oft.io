<script lang="ts">
  import type { Post } from '@placewise/shared';
  import { postsApi } from '@placewise/shared';
  import { auth } from '$lib/auth.svelte';

  let { post }: { post: Post } = $props();

  let score = $state(post.score);

  function vote(value: 1 | -1) {
    auth.requireAuth(async () => {
      try {
        await postsApi.vote(post.id, value);
        score += value;
      } catch (err) {
        console.error('Vote failed', err);
      }
    });
  }
</script>

<div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
  <div class="flex gap-3">
    <div class="flex flex-col items-center gap-1 text-gray-400 select-none">
      <button onclick={() => vote(1)} class="hover:text-indigo-600 text-lg leading-none transition-colors">
        ▲
      </button>
      <span class="text-sm font-semibold text-gray-700">{score}</span>
      <button onclick={() => vote(-1)} class="hover:text-red-500 text-lg leading-none transition-colors">
        ▼
      </button>
    </div>

    <div class="flex-1 min-w-0">
      <a
        href="/post/{post.id}"
        class="font-medium text-gray-900 hover:text-indigo-600 line-clamp-2 transition-colors"
      >
        {post.title}
      </a>
      <div class="mt-1 flex items-center gap-2 text-xs text-gray-500 flex-wrap">
        <span>📍 {post.location_name}</span>
        <a
          href={post.external_url}
          target="_blank"
          rel="noopener noreferrer"
          class="text-indigo-500 hover:underline truncate"
        >
          {post.external_url}
        </a>
      </div>
    </div>
  </div>
</div>
