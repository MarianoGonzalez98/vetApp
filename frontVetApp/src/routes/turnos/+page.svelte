<script>
    import { AppBar } from "@skeletonlabs/skeleton";
    import TurnoForm from "./TurnoForm.svelte";

    const tableArr = [
        {turno: "Uno", motivo: "Castracion", fecha: "1/2/2023", rangoHor: "Mañana" },
        {turno: "Dos", motivo: "Vacunacion", fecha: "1/5/2023", rangoHor: "Mañana" },
        {turno: "Tres", motivo: "Vacunacion", fecha: "1/9/2023", rangoHor: "Tarde" },
        {turno: "Cuatro", motivo: "Consulta General", fecha: "1/10/2023", rangoHor: "Noche"}
        ];

</script>


<br>
<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
	<svelte:fragment slot="lead"></svelte:fragment>
	<h1>Turnos</h1>
	<svelte:fragment slot="trail"></svelte:fragment>
</AppBar>

<br>
<br>


<!-- Responsive Container (recommended) -->
<div class="table-container">
	<!-- Native Table Element -->
	<table class="table table-hover">
		<thead>
			<tr>
				<th>Turno</th>
				<th>Motivo</th>
				<th>Fecha</th>
				<th>Rango Horario</th>
			</tr>
		</thead>
		<tbody>
			{#each tableArr as row, i}
				<tr>
					<td>{row.turno}</td>
					<td>{row.motivo}</td>
					<td>{row.fecha}</td>
					<td>{row.rangoHor}</td>
				</tr>
			{/each}
		</tbody>
		<!-- <tfoot>
			<tr>
				<th colspan="3">Calculated Total Weight</th>
				<td>{totalWeight}</td>
			</tr>
		</tfoot> -->
	</table>
</div>


<TurnoForm></TurnoForm>