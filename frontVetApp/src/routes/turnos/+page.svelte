<script>
    import { AppBar } from "@skeletonlabs/skeleton";
	import { user } from "$lib/stores/user";
</script>



<h1 class="h1 m-4 font-medium">Turnos</h1>
<div class= "ml-10">
	{#if $user?.rol === "cliente"}
		<a class="btn rounded-lg variant-filled" rel="noreferrer" href="/turnos/mis-turnos/cliente">Visualizar Turnos Aceptados</a> <!--CLIENTE!-->
		<a class="btn rounded-lg variant-filled" rel="noreferrer" href="/turnos/mis-turnos/clientePendientes">Visualizar Turnos Pendientes</a> <!--CLIENTE!-->
		<a class="btn rounded-lg variant-filled" rel="noreferrer" href="/turnos/turnos-form">Solicitar Turno</a>

	{/if}

	{#if $user?.rol === "veterinario"}
		<a class="btn rounded-lg variant-filled" rel="noreferrer" href="/turnos/mis-turnos/veterinarioFinalizados">Visualizar Turnos Finalizados</a> <!--VETERINARIO!-->
		<a class="btn rounded-lg variant-filled" rel="noreferrer" href="/turnos/mis-turnos/veterinario">Visualizar Turnos Aceptados</a> <!--VETERINARIO!-->
		<a class="btn rounded-lg variant-filled" rel="noreferrer" href="/turnos/mis-turnos/veterinarioPendientes">Visualizar Turnos Pendientes</a> <!--VETERINARIO!-->

		<a class="btn rounded-lg variant-filled" rel="noreferrer" href="/turnos/urgencia-form">Registrar Urgencia</a>
	{/if}
</div>
