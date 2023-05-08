<script>
    import { user } from "$lib/stores/user";
	import BotonConDatos from "./BotonConDatos.svelte";
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		{#if ($user)}
			<h1>Hola {$user.email}!</h1>
		{:else}
			<h1>Hola anónimo!</h1>
		{/if}
		
		<BotonConDatos></BotonConDatos>

		{#if ($user)}
			<a class="btn btn-sm variant-ghost-surface" rel="noreferrer" href="/auth/cambiar-password">Cambiar mi contraseña</a>

			{#if ($user.rol ==='veterinario')}
				<a class="btn btn-sm variant-ghost-surface" rel="noreferrer" href="/cargar-cliente">Cargar nuevo cliente</a>
			{/if}

		{/if}

	</div>


</div>

