<script lang="ts">
    import { user } from "$lib/stores/user";

</script>

    {#if ($user)}
        <a href="/adopciones/crear-publicacion"><button>Publicar perro</button></a>
    {/if}