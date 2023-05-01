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
	</div>


</div>
