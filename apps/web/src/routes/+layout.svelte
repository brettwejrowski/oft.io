<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { auth } from '$lib/auth.svelte';
  import Navbar from '$lib/components/Navbar.svelte';

  let { children } = $props();

  onMount(() => {
    auth.initialize();
  });
</script>

<div class="h-screen flex flex-col">
  <Navbar />
  <main class="flex-1 overflow-hidden">
    {@render children()}
  </main>
</div>
