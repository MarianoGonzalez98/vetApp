<script>
	import { user } from "$lib/stores/user";
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		{#if $user}
			{#if $user.rol === "veterinario"}
				<a
					class="btn bg-gradient-to-br variant-gradient-primary-secondary"
					rel="noreferrer"
					href="/cargar-cliente">Cargar nuevo cliente</a
				>
			{:else}
				<a
					class="btn variant-ghost-surface"
					rel="noreferrer"
					href="/mis-perros">Mis perros</a
				>
				<a
					class="btn variant-ghost-surface"
					rel="noreferrer"
					href="/cargar-perro">Cargar nuevo perro</a
				>
			{/if}
			<a
				class="btn rounded-lg variant-filled"
				rel="noreferrer"
				href="/turnos">Ir a turnos</a
			>
		{/if}
		<a class="btn variant-ghost-surface" href="/paseadores-y-cuidadores"
			>Paseadores y Cuidadores</a
		>
		<a class="btn variant-ghost-surface" rel="noreferrer" href="/adopciones"
			>Adopciones</a
		>
	</div>
</div>

<style>
	.container {
		background-image: url("/perrito-desde-abajo.png");
		background-repeat: no-repeat;
		background-position: center bottom;
		background-size: 20%;
	}
</style>
