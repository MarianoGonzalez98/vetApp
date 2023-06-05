<script>
  import { goto } from "$app/navigation";
  import { user } from "$lib/stores/user";
    import { backendURL } from "$lib/utils/constantFactory";
  import { AppBar } from "@skeletonlabs/skeleton";
  import { LightSwitch } from "@skeletonlabs/skeleton";
  import { Avatar } from "@skeletonlabs/skeleton";

  let imgSrc = "/Logo2.png";
  const logout = () => {
    $user = null;
    fetch(`${backendURL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    goto("/");
  };
</script>

<AppBar padding="p-1">
  <svelte:fragment slot="lead">
    <a href="/"
      ><img src={imgSrc} alt="logo de veterinaria" width="91" class="p-2" /></a
    >
    <div class="mr-2" />
    <LightSwitch />
    {#if $user}
      <a
        class="btn variant-ghost-surface ml-5"
        rel="noreferrer"
        href="/auth/mi-perfil">Ver mi perfil</a
      >
    {/if}
  </svelte:fragment>

  <svelte:fragment slot="trail">
    {#if (!$user)}
      <a class="btn variant-ghost-surface" href="/auth/login" rel="noreferrer">Iniciar sesión</a>
    {:else}
      <Avatar
        src={$user.foto || "/no_foto_perfil.png"}
        fallback="/no_foto_perfil.png"
        width="w-16"
        rounded="rounded-3xl"
      />
      <button on:click={logout} type="button" class="btn variant-ghost-surface"
        >Cerrar sesion</button
      >
    {/if}
  </svelte:fragment>
</AppBar>

<!-- https://www.skeleton.dev/components/app-bar -->
