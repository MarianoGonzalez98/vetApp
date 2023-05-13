<script lang="ts">
    import { beforeNavigate } from "$app/navigation";
    import type { BeforeNavigate } from "@sveltejs/kit";

</script>

<div class="container h-full mx-auto flex justify-center items-center">
    <div>
        <div>
            <p class="text-lg">Nombre: </p>
            <p class="text-lg">Apellido: </p>
            <p class="text-lg">Email: </p>
            <p class="text-lg">DNI: </p>
            <p class="text-lg">Telefono: </p>
            <p class="text-lg">Foto de perfil: </p> <img src="" alt="">
        </div>

        <a
        class="btn variant-ghost-surface mt-10"
        rel="noreferrer"
        href="/auth/mi-perfil/editar-perfil">Editar mi perfil</a
        >
        <a
        class="btn variant-ghost-surface mt-10"
        rel="noreferrer"
        href="/auth/cambiar-password">Cambiar mi contraseña</a
        >
    </div>
</div>
