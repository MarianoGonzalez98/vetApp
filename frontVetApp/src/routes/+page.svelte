<script>
	import { user } from "$lib/stores/user";
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		{#if $user}
			<div class="mb-20">
				<a
				class="btn variant-ghost-surface"
				rel="noreferrer"
				href="/auth/mi-perfil">Ver mi perfil</a
				>
			</div>

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

		<a class="btn rounded-lg variant-filled" rel="noreferrer" href="/turnos">Ir a turnos</a>

	</div>
</div>
