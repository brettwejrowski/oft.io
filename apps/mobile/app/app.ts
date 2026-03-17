import App from './components/App.svelte';
import { svelteNativeNoFrame } from 'svelte-native';
import { configure } from '@placewise/shared';

// Point the shared API client at the local dev API
// In production, update this to your deployed API URL
configure({ baseUrl: 'http://10.0.2.2:8000' }); // Android emulator → host machine

svelteNativeNoFrame(App, {});
