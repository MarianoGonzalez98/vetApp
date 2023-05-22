<script>
	import { user } from "$lib/stores/user";
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10">
		{#if $user}
			{#if $user.rol === "veterinario"}
				<a
					class="btn variant-filled"
					rel="noreferrer"
					href="/cargar-cliente">Cargar nuevo cliente</a
				>
				<a
					class="btn variant-filled"
					rel="noreferrer"
					href="/clientes">Ver clientes</a
				>
			{:else}
				<a
					class="btn variant-filled"
					rel="noreferrer"
					href="/mis-perros">Mis perros</a
				>
				<a
					class="btn variant-filled"
					rel="noreferrer"
					href="/cargar-perro">Cargar nuevo perro</a
				>
			{/if}
			<a
				class="btn variant-filled"
				rel="noreferrer"
				href="/turnos">Ir a turnos</a
			>
		{/if}
		<div class="flex justify-center">
			<a class="btn variant-ghost-surface mr-1" href="/paseadores-y-cuidadores"
			>Paseadores y Cuidadores</a
		>
			<a class="btn variant-ghost-surface" rel="noreferrer" href="/adopciones"
				>Adopciones</a
			>
		</div>

	</div>
</div>

<style>
	.container {
		background-image: url("/perrito-desde-abajo.png"), url("/perritos.png");
		background-repeat: no-repeat;
		background-position: center bottom, left bottom;
		background-size: 20%;
	}
</style>
