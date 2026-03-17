<script lang="ts">
  import { onMount } from 'svelte';
  import { goBack } from 'svelte-native/navigation';
  import { postsApi } from '@placewise/shared';
  import { isAuthenticated, requireAuth } from '../../stores/auth';
  import type { Post, Comment } from '@placewise/shared';

  export let postId: number;

  let post: Post | null = null;
  let comments: Comment[] = [];
  let loading = true;
  let commentBody = '';
  let submitting = false;

  onMount(async () => {
    try {
      [post, comments] = await Promise.all([
        postsApi.get(postId),
        postsApi.listComments(postId),
      ]);
    } catch (err) {
      console.error('Failed to load post', err);
    } finally {
      loading = false;
    }
  });

  function vote(value: 1 | -1) {
    requireAuth(
      async () => {
        try {
          await postsApi.vote(postId, value);
          if (post) post = { ...post, score: post.score + value };
        } catch (err) {
          console.error('Vote failed', err);
        }
      },
      () => alert('Sign in to vote.')
    );
  }

  async function submitComment() {
    if (!commentBody.trim()) return;
    requireAuth(
      async () => {
        submitting = true;
        try {
          const comment = await postsApi.createComment(postId, { body: commentBody });
          comments = [...comments, comment];
          commentBody = '';
        } catch (err) {
          console.error('Comment failed', err);
        } finally {
          submitting = false;
        }
      },
      () => alert('Sign in to comment.')
    );
  }
</script>

<page>
  <actionBar title="Post" flat="true">
    <navigationButton text="Back" on:tap={() => goBack()} />
  </actionBar>

  {#if loading}
    <label text="Loading…" class="text-muted" textAlignment="center" marginTop="40" />
  {:else if !post}
    <label text="Post not found." class="text-muted" textAlignment="center" marginTop="40" />
  {:else}
    <scrollView>
      <stackLayout margin="12">
        <!-- Post card -->
        <gridLayout columns="auto, *" class="card" marginBottom="16">
          <!-- Vote column -->
          <stackLayout col="0" verticalAlignment="center" width="44" horizontalAlignment="center">
            <button text="▲" fontSize="20" color="#9ca3af" on:tap={() => vote(1)} />
            <label text={String(post.score)} fontSize="15" fontWeight="700" color="#111827" textAlignment="center" />
            <button text="▼" fontSize="20" color="#ef4444" on:tap={() => vote(-1)} />
          </stackLayout>

          <!-- Content -->
          <stackLayout col="1" marginLeft="8">
            <label text={post.title} fontSize="16" fontWeight="600" color="#111827" textWrap="true" />
            {#if post.body}
              <label text={post.body} fontSize="13" color="#374151" textWrap="true" marginTop="6" />
            {/if}
            <label text={`📍 ${post.location_name}`} class="text-muted" marginTop="6" />
            <label text={post.external_url} fontSize="12" color="#4f46e5" textWrap="true" marginTop="3" />
          </stackLayout>
        </gridLayout>

        <!-- Comment input -->
        <stackLayout marginBottom="16">
          <textView
            hint="Add a comment…"
            text={commentBody}
            on:textChange={(e) => (commentBody = e.value)}
            height="80"
            fontSize="13"
            borderWidth="1"
            borderColor="#d1d5db"
            borderRadius="8"
            padding="10"
            backgroundColor="#fff"
          />
          <button
            text={submitting ? 'Posting…' : 'Post Comment'}
            class="btn-primary"
            isEnabled={!submitting}
            marginTop="8"
            on:tap={submitComment}
          />
        </stackLayout>

        <!-- Comments -->
        <label
          text={`Comments (${comments.length})`}
          fontSize="14"
          fontWeight="600"
          color="#374151"
          marginBottom="8"
        />
        {#each comments as comment (comment.id)}
          <stackLayout
            borderLeftWidth="2"
            borderLeftColor="#e5e7eb"
            paddingLeft="12"
            marginBottom="12"
          >
            <label text={comment.body} fontSize="13" color="#374151" textWrap="true" />
            <label
              text={new Date(comment.created_at).toLocaleDateString()}
              class="text-muted"
              marginTop="2"
            />
          </stackLayout>
        {/each}
      </stackLayout>
    </scrollView>
  {/if}
</page>
