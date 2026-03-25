<script lang="ts">
  import { Auth0 } from '@nativescript/auth0';
  import { isAuthenticated, user, loginWithAuth0Token, logout } from '../../stores/auth';

  let loggingIn = false;

  async function signIn() {
    loggingIn = true;
    try {
      // Auth0 native browser-based login — opens the system browser
      const result = await Auth0.webAuth.authorize({
        scope: 'openid profile email',
        audience: '', // set your Auth0 API audience if needed
      });
      if (result?.accessToken) {
        await loginWithAuth0Token(result.accessToken);
      }
    } catch (err) {
      console.error('Auth0 login failed', err);
      alert('Sign-in failed. Please try again.');
    } finally {
      loggingIn = false;
    }
  }

  function signOut() {
    logout();
    Auth0.webAuth.clearSession().catch(() => {});
  }
</script>

<page>
  <actionBar title="Profile" flat="true" />

  <stackLayout verticalAlignment="middle" horizontalAlignment="center" margin="24">
    {#if $isAuthenticated && $user}
      <label
        text={`@${$user.username}`}
        fontSize="22"
        fontWeight="700"
        color="#111827"
        textAlignment="center"
      />
      <label text={$user.email} fontSize="13" color="#6b7280" textAlignment="center" marginTop="4" />
      <label
        text={`Joined ${new Date($user.created_at).toLocaleDateString()}`}
        class="text-muted"
        textAlignment="center"
        marginTop="4"
      />
      <button text="Sign Out" class="btn-ghost" marginTop="24" on:tap={signOut} />
    {:else}
      <label
        text="Sign in to Placewise"
        fontSize="20"
        fontWeight="600"
        color="#111827"
        textAlignment="center"
        marginBottom="8"
      />
      <label
        text="Vote on places, submit new spots, and join communities."
        class="text-muted"
        textWrap="true"
        textAlignment="center"
        marginBottom="24"
      />
      <button
        text={loggingIn ? 'Signing in…' : 'Sign In'}
        class="btn-primary"
        isEnabled={!loggingIn}
        on:tap={signIn}
      />
    {/if}
  </stackLayout>
</page>
