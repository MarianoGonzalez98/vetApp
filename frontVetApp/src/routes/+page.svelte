<script>
	import { user } from "$lib/stores/user";
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		{#if $user}
			<a
				class="btn variant-ghost-surface"
				rel="noreferrer"
				href="/auth/cambiar-password">Cambiar mi contraseña</a
			>
			{#if $user.rol === "veterinario"}
				<a
					class="btn variant-ghost-surface"
					rel="noreferrer"
					href="/cargar-cliente">Cargar nuevo cliente</a
				>
				<a
					class="btn variant-ghost-surface"
					rel="noreferrer"
					href="/cargar-perro">Cargar nuevo perro</a
				>
				<a
					class="btn variant-ghost-surface"
					rel="noreferrer"
					href="/mis-perros">Mis perros</a
				>
				<a
					class="btn variant-ghost-surface"
					href="/paseadores-y-cuidadores">Paseadores y Cuidadores</a
				>
			{/if}
		{/if}
	</div>
</div>
