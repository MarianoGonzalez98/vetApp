<script lang="ts">
    import { user } from "$lib/stores/user";

</script>
<div class="container mt-2 mb-10 h-full mx-auto flex justify-center items-center">
    {#if ($user)}
        <a href="/adopciones/crear-publicacion"><button class="btn rounded-lg variant-filled-secondary">Publicar perro</button></a>
    {/if}
</div>