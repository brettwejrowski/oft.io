<script lang="ts">
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-native/navigation';
  import { postsApi } from '@placewise/shared';
  import type { Post } from '@placewise/shared';
  import PostScreen from './PostScreen.svelte';
  import SubmitScreen from './SubmitScreen.svelte';

  let posts: Post[] = [];
  let loading = true;
  let lat = 37.7749;
  let lng = -122.4194;

  onMount(async () => {
    await loadPosts();
  });

  async function loadPosts() {
    loading = true;
    try {
      posts = await postsApi.nearby({ lat, lng });
    } catch (err) {
      console.error('Failed to load posts', err);
    } finally {
      loading = false;
    }
  }

  function openPost(post: Post) {
    navigate({ page: PostScreen, props: { postId: post.id } });
  }

  function openSubmit() {
    navigate({ page: SubmitScreen });
  }
</script>

<page>
  <actionBar title="Placewise" flat="true">
    <actionItem
      text="+ Post"
      ios.position="right"
      android.position="actionBar"
      on:tap={openSubmit}
    />
  </actionBar>

  <gridLayout rows="*, auto">
    <!-- Post feed -->
    <scrollView row="0">
      <stackLayout>
        {#if loading}
          <label text="Loading nearby places…" class="text-muted" textAlignment="center" marginTop="40" />
        {:else if posts.length === 0}
          <label
            text="No posts nearby. Tap '+ Post' to be the first!"
            class="text-muted"
            textAlignment="center"
            textWrap="true"
            marginTop="40"
            marginLeft="24"
            marginRight="24"
          />
        {:else}
          {#each posts as post (post.id)}
            <gridLayout
              columns="auto, *"
              class="card"
              marginLeft="12"
              marginRight="12"
              on:tap={() => openPost(post)}
            >
              <!-- Score -->
              <stackLayout col="0" verticalAlignment="center" width="40" horizontalAlignment="center">
                <label text={String(post.score)} fontSize="15" fontWeight="bold" color="#111827" textAlignment="center" />
              </stackLayout>

              <!-- Content -->
              <stackLayout col="1" marginLeft="8">
                <label text={post.title} fontSize="14" fontWeight="600" color="#111827" textWrap="true" />
                <label text={`📍 ${post.location_name}`} class="text-muted" marginTop="4" />
              </stackLayout>
            </gridLayout>
          {/each}
        {/if}
      </stackLayout>
    </scrollView>

    <!-- FAB -->
    <button
      row="1"
      text="+ Submit a Place"
      class="btn-primary"
      margin="16"
      on:tap={openSubmit}
    />
  </gridLayout>
</page>
