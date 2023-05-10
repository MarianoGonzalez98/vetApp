<script>
    import { goto } from '$app/navigation';
    import { user } from '$lib/stores/user';
  import { AppBar } from '@skeletonlabs/skeleton';
  import { LightSwitch } from '@skeletonlabs/skeleton';
  let imgSrc = 'Logo1.png';
  const logout = () => {
    $user=null;
    fetch('http://localhost:3000/logout',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            credentials: 'include'
          })
    goto('/');
  }
</script>

<AppBar padding='p-1'>
  <svelte:fragment slot="lead">
    <a href="/"><img src={imgSrc} alt="logo de veterinaria" width="90" height="70"></a>
    <div class="mr-2"></div>
    <LightSwitch></LightSwitch>
  </svelte:fragment>

  <svelte:fragment slot="trail">
    {#if (!$user)}
      <a class="btn variant-ghost-surface" href="/auth/login" rel="noreferrer">Login</a>
    {:else}
      <button on:click={logout} type="button" class="btn variant-ghost-surface" >Cerrar sesion</button>
    {/if}
  </svelte:fragment>

</AppBar>

<!-- https://www.skeleton.dev/components/app-bar -->