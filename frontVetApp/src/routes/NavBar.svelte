<script>
    import { goto } from '$app/navigation';
    import { user } from '$lib/stores/user';
  import { AppBar } from '@skeletonlabs/skeleton';
  import { LightSwitch } from '@skeletonlabs/skeleton';
  
  const logout = () => {
    $user=null;
    goto('/');
  }
</script>

<AppBar>
  <svelte:fragment slot="lead">
    <a class="btn text-xl uppercase p-1" href="/" rel="noreferrer" >Oh My Dog!</a>
    <LightSwitch></LightSwitch>
  </svelte:fragment>

  

  <svelte:fragment slot="trail">
    {#if (!$user)}
      <a class="btn btn-sm variant-ghost-surface" href="/auth/login" rel="noreferrer">Login</a>
    {:else}
      <button on:click={logout} type="button" class="btn btn-sm variant-ghost-surface" >Cerrar sesion</button>
    {/if}
  </svelte:fragment>

</AppBar>

<!-- https://www.skeleton.dev/components/app-bar -->