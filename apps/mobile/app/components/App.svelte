<script lang="ts">
  import { onMount } from 'svelte';
  import { initAuth } from '../stores/auth';
  import MapScreen from './screens/MapScreen.svelte';
  import CommunitiesScreen from './screens/CommunitiesScreen.svelte';
  import ProfileScreen from './screens/ProfileScreen.svelte';

  onMount(() => {
    initAuth();
  });

  let selectedTab = 0;
</script>

<tabView bind:selectedIndex={selectedTab} androidTabsPosition="bottom">
  <tabViewItem title="Map">
    <MapScreen />
  </tabViewItem>
  <tabViewItem title="Communities">
    <CommunitiesScreen />
  </tabViewItem>
  <tabViewItem title="Profile">
    <ProfileScreen />
  </tabViewItem>
</tabView>
