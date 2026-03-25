<script lang="ts">
  import { goBack } from 'svelte-native/navigation';
  import { onMount } from 'svelte';
  import { communitiesApi } from '@placewise/shared';
  import { requireAuth } from '../../stores/auth';
  import type { Community } from '@placewise/shared';

  let communities: Community[] = [];
  let selectedCommunityId: number | null = null;
  let title = '';
  let body = '';
  let locationName = '';
  let externalUrl = '';
  let lat: number | null = null;
  let lng: number | null = null;
  let submitting = false;

  const selectedCommunity = $: communities.find((c) => c.id === selectedCommunityId);

  onMount(async () => {
    communities = await communitiesApi.list().catch(() => []);
  });

  async function handleSubmit() {
    if (!selectedCommunity || lat == null || lng == null) {
      alert('Please select a community and set coordinates.');
      return;
    }

    requireAuth(
      async () => {
        submitting = true;
        try {
          const post = await communitiesApi.createPost(selectedCommunity.slug, {
            title,
            body: body || undefined,
            location_name: locationName,
            location_lat: lat!,
            location_lng: lng!,
            external_url: externalUrl,
            community_id: selectedCommunity.id,
          });
          alert(`Posted! (id: ${post.id})`);
          goBack();
        } catch (err) {
          alert('Could not submit. Are you signed in?');
          console.error(err);
        } finally {
          submitting = false;
        }
      },
      () => alert('Sign in to submit a place.')
    );
  }
</script>

<page>
  <actionBar title="Submit a Place" flat="true">
    <navigationButton text="Cancel" on:tap={() => goBack()} />
  </actionBar>

  <scrollView>
    <stackLayout margin="16">
      <!-- Community picker -->
      <label text="Community" fontSize="13" fontWeight="600" color="#374151" marginBottom="4" />
      <listPicker
        items={communities.map((c) => c.name)}
        selectedIndex={communities.findIndex((c) => c.id === selectedCommunityId)}
        on:selectedIndexChange={(e) => {
          selectedCommunityId = communities[e.value]?.id ?? null;
        }}
        marginBottom="12"
      />

      <label text="Title" fontSize="13" fontWeight="600" color="#374151" marginBottom="4" />
      <textField
        hint="e.g. Best ramen in the Mission"
        text={title}
        on:textChange={(e) => (title = e.value)}
        class="input"
        marginBottom="12"
      />

      <label text="External Link" fontSize="13" fontWeight="600" color="#374151" marginBottom="4" />
      <textField
        hint="https://maps.google.com/..."
        text={externalUrl}
        on:textChange={(e) => (externalUrl = e.value)}
        keyboardType="url"
        autocorrect="false"
        autocapitalizationType="none"
        class="input"
        marginBottom="12"
      />

      <label text="Location Name" fontSize="13" fontWeight="600" color="#374151" marginBottom="4" />
      <textField
        hint="e.g. Mensho Tokyo, San Francisco, CA"
        text={locationName}
        on:textChange={(e) => (locationName = e.value)}
        class="input"
        marginBottom="12"
      />

      <label text="Latitude" fontSize="13" fontWeight="600" color="#374151" marginBottom="4" />
      <textField
        hint="e.g. 37.7749"
        text={lat != null ? String(lat) : ''}
        on:textChange={(e) => (lat = parseFloat(e.value) || null)}
        keyboardType="number"
        class="input"
        marginBottom="12"
      />

      <label text="Longitude" fontSize="13" fontWeight="600" color="#374151" marginBottom="4" />
      <textField
        hint="e.g. -122.4194"
        text={lng != null ? String(lng) : ''}
        on:textChange={(e) => (lng = parseFloat(e.value) || null)}
        keyboardType="number"
        class="input"
        marginBottom="12"
      />

      <label text="Description (optional)" fontSize="13" fontWeight="600" color="#374151" marginBottom="4" />
      <textView
        hint="What makes this place special?"
        text={body}
        on:textChange={(e) => (body = e.value)}
        height="80"
        fontSize="13"
        borderWidth="1"
        borderColor="#d1d5db"
        borderRadius="8"
        padding="10"
        backgroundColor="#fff"
        marginBottom="20"
      />

      <button
        text={submitting ? 'Submitting…' : 'Submit Post'}
        class="btn-primary"
        isEnabled={!submitting}
        on:tap={handleSubmit}
      />
    </stackLayout>
  </scrollView>
</page>

<style>
  .input {
    border-width: 1;
    border-color: #d1d5db;
    border-radius: 8;
    padding: 10;
    font-size: 13;
    background-color: #fff;
  }
</style>
