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
				<a
					class="btn bg-gradient-to-br variant-gradient-primary-secondary"
					rel="noreferrer"
					href="/cargar-perro">Cargar nuevo perro</a
				>
				<a
					class="btn bg-gradient-to-br variant-gradient-primary-secondary"
					rel="noreferrer"
					href="/mis-perros">Mis perros</a
				>
				<a
					class="btn bg-gradient-to-br variant-gradient-primary-secondary"
					href="/paseadores-y-cuidadores">Paseadores y Cuidadores</a
				>
			{/if}
		{/if}
	</div>
</div>

<style>
	.container{
		background-image: url("/perrito-desde-abajo.png");	
		background-repeat:no-repeat;
		background-position: center bottom ;
		background-size: 20%;
		
	}

			
</style>