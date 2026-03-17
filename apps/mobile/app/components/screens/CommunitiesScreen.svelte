<script lang="ts">
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-native/navigation';
  import { communitiesApi } from '@placewise/shared';
  import type { Community } from '@placewise/shared';
  // CommunityPostsScreen would navigate to community posts
  // For now, posts are browsed from the map

  let communities: Community[] = [];
  let loading = true;

  onMount(async () => {
    try {
      communities = await communitiesApi.list();
    } catch (err) {
      console.error('Failed to load communities', err);
    } finally {
      loading = false;
    }
  });
</script>

<page>
  <actionBar title="Communities" flat="true" />

  <scrollView>
    <stackLayout>
      {#if loading}
        <label text="Loading…" class="text-muted" textAlignment="center" marginTop="40" />
      {:else if communities.length === 0}
        <label text="No communities yet." class="text-muted" textAlignment="center" marginTop="40" />
      {:else}
        {#each communities as c (c.id)}
          <stackLayout class="card" marginLeft="12" marginRight="12" marginTop="4">
            <label text={c.name} fontSize="15" fontWeight="600" color="#111827" />
            <label text={c.topic} class="label-xs" marginTop="4" />
            {#if c.description}
              <label
                text={c.description}
                fontSize="12"
                color="#6b7280"
                textWrap="true"
                marginTop="6"
              />
            {/if}
          </stackLayout>
        {/each}
      {/if}
    </stackLayout>
  </scrollView>
</page>
