<script>
    import TurnoForm from "./TurnoForm.svelte";

</script>
<!-- <script lang="ts"> 
    import type { Turno } from "$lib/interfaces/Turno.interface";
</script>
    
    <style>
      .content {
        display: grid;
        grid-template-columns: 20% 80%;
        grid-column-gap: 10px;
      }
    </style>
    
    <h1>Form</h1>
    <form class="content">
      <label>Motivo</label>
      <input type="text" bind:value={$Turno.motivo} />
      <label>Perro</label>
      <input type="text" bind:value={$Turno.} />
      <label>Fecha</label>
      <input type="text" bind:value={$user.phone} />
      <label>Rango Horario</label>
      <input type="text" bind:value={$user.phone} />
    </form>
    <p>
        {JSON.stringify($user, 0, 2)}</p>


<h1> Turnos </h1> -->

<TurnoForm></TurnoForm>