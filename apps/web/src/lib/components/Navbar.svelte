<script lang="ts">
  import { page } from '$app/stores';
  import { auth } from '$lib/auth.svelte';
</script>

<nav class="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
  <a href="/" class="text-xl font-bold text-indigo-600">Placewise</a>

  <div class="flex items-center gap-4">
    <a href="/submit" class="text-sm text-gray-600 hover:text-indigo-600">+ Submit</a>

    {#if auth.isAuthenticated && auth.user}
      <div class="flex items-center gap-3">
        <span class="text-sm font-medium text-gray-800">{auth.user.username}</span>
        <button
          onclick={() => auth.logout()}
          class="text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          Sign out
        </button>
      </div>
    {:else if !auth.isLoading}
      <button
        onclick={() => auth.login($page.url.pathname)}
        class="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 transition-colors"
      >
        Sign in
      </button>
    {/if}
  </div>
</nav>
