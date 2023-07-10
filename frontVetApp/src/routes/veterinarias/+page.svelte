<script lang="ts">
  import { onMount } from "svelte";
  import { backendURL } from "$lib/utils/constantFactory";
    import type { Veterinaria } from "$lib/interfaces/Veterinarias.interface";

  let veterinarias: Veterinaria[] = [];

  onMount(async () => {
    const res = await fetch(`${backendURL}/listar-veterinarias`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((apiResponse) => (veterinarias = apiResponse.data));
      veterinariasDeTurno = shuffle();
  });

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  let index:number = new Date().getMonth();

  $: mes = meses[index];
  let cant = new Date(new Date().getFullYear(), index + 1, 0).getDate();
  let veterinariasDeTurno: {dia:number, veterinaria:Veterinaria}[] = [];
  
  function shuffle() {
    cant = new Date(new Date().getFullYear(), index + 1, 0).getDate();
    veterinariasDeTurno = [];
    for (let i = 0; i < cant; i++) {
      veterinariasDeTurno.push({dia:i, veterinaria:veterinarias[Math.floor(Math.random() * (veterinarias.length))]});
    }
    console.log(veterinariasDeTurno);
    return veterinariasDeTurno;
  };

  function mesAdelante() {
    index = index == 11 ? 0 : index + 1;
    veterinariasDeTurno = shuffle();
  }

  function mesAtras() {
    index = index == 0 ? 11 : index - 1;
    veterinariasDeTurno = shuffle();
  }

  const flechaAtras = "<";
  const flechaAdelante = ">";
</script>

<div class="flex">
  <h1 class="h1 m-4 font-medium">Veterinarias de turno del mes:</h1>
  <button
    class="mt-4 ml-4 mb-4 btn variant-ghost-primary hover:variant-filled-primary font-bold"
    on:click={mesAtras}>{flechaAtras}</button
  >
  <p class="pl-4 mb-6 h1 pt-4 pb-0 mb-0 font-medium">{mes}</p>
  <button
    class="mt-4 ml-4 mb-4 btn variant-ghost-primary hover:variant-filled-primary font-bold"
    on:click={mesAdelante}>{flechaAdelante}</button
  >
</div>

<div class="grid grid-cols-5 grid-rows-7">
  {#each veterinariasDeTurno as elemento}
    <div class="border border-gray-400 pb-2">
      <header class="text-center h2 font-medium">
        {elemento.dia + 1}
      </header>
      <div class="ml-2">
        <p><span class="font-medium">Veterinaria de turno: </span>{elemento.veterinaria.nombre}</p>
        <p><span class="font-medium">Dirección: </span>{elemento.veterinaria.direccion}</p>
        <p><span class="font-medium">Teléfono: </span>{elemento.veterinaria.telefono}</p>
      </div>
    </div>
  {/each}
</div>
