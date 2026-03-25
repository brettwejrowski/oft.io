<script lang="ts">
  import { onMount } from 'svelte';
  import { postsApi } from '@placewise/shared';
  import PostCard from '$lib/components/PostCard.svelte';
  import type { Post } from '@placewise/shared';
  import type { Map, Marker } from 'leaflet';

  let posts = $state<Post[]>([]);
  let mapEl: HTMLDivElement;
  let map: Map | null = null;
  let markers: Marker[] = [];

  onMount(async () => {
    const L = await import('leaflet');

    map = L.map(mapEl).setView([37.7749, -122.4194], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    async function refresh() {
      if (!map) return;
      const { lat, lng } = map.getCenter();
      posts = await postsApi.nearby({ lat, lng }).catch(() => []);

      // Clear old markers
      markers.forEach((m) => m.remove());
      markers = [];

      posts.forEach((post) => {
        const m = L.marker([post.location_lat, post.location_lng])
          .addTo(map!)
          .bindPopup(
            `<strong>${post.title}</strong><br>
             <small>${post.location_name}</small><br>
             <a href="/post/${post.id}">View post →</a>`
          );
        markers.push(m);
      });
    }

    map.on('moveend', refresh);
    await refresh();

    return () => map?.remove();
  });
</script>

<div class="flex h-full">
  <!-- Map -->
  <div bind:this={mapEl} class="flex-1"></div>

  <!-- Sidebar feed -->
  <aside class="w-80 bg-gray-50 border-l border-gray-200 overflow-y-auto p-3 flex flex-col gap-2">
    <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
      Nearby ({posts.length})
    </h2>

    {#each posts as post (post.id)}
      <PostCard {post} />
    {:else}
      <p class="text-sm text-gray-400 mt-4 text-center">
        No posts in this area yet.
        <a href="/submit" class="text-indigo-600">Be the first!</a>
      </p>
    {/each}
  </aside>
</div>
