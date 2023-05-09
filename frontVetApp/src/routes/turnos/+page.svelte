<script>
    import { AppBar } from "@skeletonlabs/skeleton";
</script>


<br>
<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
	<svelte:fragment slot="lead"></svelte:fragment>
	<h1>Turnos</h1>
	<svelte:fragment slot="trail"></svelte:fragment>
</AppBar>

<br>
<br>

<a class="btn rounded-lg variant-filled" rel="noreferrer" href="/turnos/turnos-tabla">Visualizar Turno</a>

<br>
<br>

<a class="btn rounded-lg variant-filled" rel="noreferrer" href="/turnos/turnos-form">Solicitar Turno</a>

<br>
<br>

<a class="btn rounded-lg variant-filled" rel="noreferrer" href="/turnos/urgencia-form">Registrar Urgencia</a>

