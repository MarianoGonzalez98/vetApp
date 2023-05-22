<script>
    import { AppBar } from "@skeletonlabs/skeleton";
	import { user } from "$lib/stores/user";
</script>



<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
	<svelte:fragment slot="lead"></svelte:fragment>
	<h1>Turnos</h1>
	<svelte:fragment slot="trail"></svelte:fragment>
</AppBar>


{#if $user?.rol === "cliente"}
	<a class="btn rounded-lg variant-filled" rel="noreferrer" href="/turnos/mis-turnos/cliente">Visualizar Turnos Aceptados</a> <!--CLIENTE!-->
	<a class="btn rounded-lg variant-filled" rel="noreferrer" href="/turnos/mis-turnos/clientePendientes">Visualizar Turnos Pendientes</a> <!--CLIENTE!-->
	<a class="btn rounded-lg variant-filled" rel="noreferrer" href="/turnos/turnos-form">Solicitar Turno</a>

{/if}

{#if $user?.rol === "veterinario"}
	<a class="btn rounded-lg variant-filled" rel="noreferrer" href="/turnos/mis-turnos/veterinario">Visualizar Turnos Aceptados</a> <!--VETERINARIO!-->
	<a class="btn rounded-lg variant-filled" rel="noreferrer" href="/turnos/mis-turnos/veterinarioPendientes">Visualizar Turnos Pendientes</a> <!--VETERINARIO!-->
	<!-- <a class="btn rounded-lg variant-filled" rel="noreferrer" href="/turnos/urgencia-form">Registrar Urgencia</a> -->
{/if}