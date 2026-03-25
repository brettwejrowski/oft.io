<script lang="ts">
  import PostCard from '$lib/components/PostCard.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<div class="max-w-2xl mx-auto py-8 px-4">
  <div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-900">{data.community.name}</h1>
    <span class="inline-block mt-1 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
      {data.community.topic}
    </span>
    {#if data.community.description}
      <p class="mt-2 text-sm text-gray-600">{data.community.description}</p>
    {/if}
  </div>

  <div class="flex flex-col gap-3">
    {#each data.posts as post (post.id)}
      <PostCard {post} />
    {:else}
      <p class="text-sm text-gray-400 text-center py-8">No posts yet.</p>
    {/each}
  </div>
</div>
