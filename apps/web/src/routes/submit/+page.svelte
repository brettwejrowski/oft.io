<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { communitiesApi } from '@placewise/shared';
  import { auth } from '$lib/auth.svelte';
  import type { Community } from '@placewise/shared';
  import type { LatLng } from 'leaflet';

  let communities = $state<Community[]>([]);
  let communitySlug = $state('');
  let title = $state('');
  let body = $state('');
  let locationName = $state('');
  let externalUrl = $state('');
  let latlng = $state<LatLng | null>(null);
  let submitting = $state(false);
  let mapEl: HTMLDivElement;

  const selectedCommunity = $derived(communities.find((c) => c.slug === communitySlug));

  onMount(async () => {
    communities = await communitiesApi.list().catch(() => []);

    const L = await import('leaflet');
    const map = L.map(mapEl).setView([37.7749, -122.4194], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    let marker: ReturnType<typeof L.marker> | null = null;
    map.on('click', (e) => {
      latlng = e.latlng;
      if (marker) marker.remove();
      marker = L.marker(e.latlng).addTo(map);
    });

    return () => map.remove();
  });

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!latlng || !selectedCommunity) return;
    auth.requireAuth(async () => {
      submitting = true;
      try {
        const post = await communitiesApi.createPost(communitySlug, {
          title,
          body: body || undefined,
          location_name: locationName,
          location_lat: latlng!.lat,
          location_lng: latlng!.lng,
          external_url: externalUrl,
          community_id: selectedCommunity!.id,
        });
        goto(`/post/${post.id}`);
      } catch (err) {
        console.error('Submit failed', err);
        submitting = false;
      }
    });
  }
</script>

<div class="max-w-2xl mx-auto py-8 px-4">
  <h1 class="text-2xl font-bold text-gray-900 mb-6">Submit a Place</h1>

  <form onsubmit={handleSubmit} class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Community</label>
      <select
        class="w-full border border-gray-300 rounded p-2 text-sm"
        bind:value={communitySlug}
        required
      >
        <option value="">Select a community…</option>
        {#each communities as c}
          <option value={c.slug}>{c.name}</option>
        {/each}
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
      <input
        class="w-full border border-gray-300 rounded p-2 text-sm"
        bind:value={title}
        required
        placeholder="e.g. Best ramen in the Mission"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        External Link (Google Maps / Yelp / etc.)
      </label>
      <input
        type="url"
        class="w-full border border-gray-300 rounded p-2 text-sm"
        bind:value={externalUrl}
        required
        placeholder="https://maps.google.com/..."
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
      <input
        class="w-full border border-gray-300 rounded p-2 text-sm"
        bind:value={locationName}
        required
        placeholder="e.g. Mensho Tokyo, San Francisco, CA"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Pin Location on Map
        {#if latlng}
          <span class="text-xs text-green-600 font-normal">
            ✓ {latlng.lat.toFixed(4)}, {latlng.lng.toFixed(4)}
          </span>
        {/if}
      </label>
      <div bind:this={mapEl} class="h-64 rounded border border-gray-300 overflow-hidden"></div>
      <p class="text-xs text-gray-400 mt-1">Click the map to pin the location.</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Description <span class="font-normal text-gray-400">(optional)</span>
      </label>
      <textarea
        class="w-full border border-gray-300 rounded p-2 text-sm resize-none"
        rows={3}
        bind:value={body}
        placeholder="Tell your community what makes this place special…"
      ></textarea>
    </div>

    <button
      type="submit"
      disabled={!latlng || submitting}
      class="w-full bg-indigo-600 text-white py-2 rounded font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
    >
      {submitting ? 'Submitting…' : 'Submit Post'}
    </button>
  </form>
</div>
