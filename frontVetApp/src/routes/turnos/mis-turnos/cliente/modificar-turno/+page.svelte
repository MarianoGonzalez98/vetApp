<script lang="ts">
    import type { PerroTurno } from "$lib/interfaces/Perro.interface";
    import type { Turno } from "$lib/interfaces/Turno.interface";
    import { Modal } from "@skeletonlabs/skeleton";
    import DateInput from "date-picker-svelte/DateInput.svelte";
    import { onMount } from "svelte";

    let format = 'dd-MM-yyyy'
    let fechaMin = new Date();

    let turno:Turno;

    let perro: PerroTurno = {
        nombre: "",
        id: -1
    }
    let inputPerro: PerroTurno = {
        nombre: "",
        id: -1
    }
    let perros: PerroTurno[] = [];

    const actualizarFormPerro = () => {
        inputPerro.nombre=perro.nombre;
        inputPerro.id = perro.id;
    }

    onMount ( async () => {

        await  fetch(
            `http://localhost:3000/listar-perros?cliente=${emailOwner}`, 
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        )
            .then((res) => res.json())
            .then((apiResponse) => (perros = apiResponse.data));

     })
     
</script>

<Modal />


<div class="container h-full mx-auto flex justify-center items-center">
    <div class="card p-4">
        <h2>Modificar turno</h2>
        <br>

        <div>
            <label for="seleccionPerro">Seleccione el perro</label>
            <select id="seleccionPerro" style="color: black;" bind:value={perro} on:change={actualizarFormPerro}>
                {#each perros as perro}
                    <option value={perro}>
                        <span>{perro.nombre} </span>
                    </option>
                {/each}
            </select>
        </div>

        <form on:submit|preventDefault={handleModificacion} class="space-y-2">

            <label class="label" for="motivo">Motivo</label>
            <select bind:value={turno.motivo} class="select"  name="motivo" required>
                <option value="Vacunación a">Vacunación a</option>
                <option value="Vacunación b">Vacunación b</option>
                <option value="Castración">Castración</option>
                <option value="Anti-Parasitación">Anti-Parasitación</option>
                <option value="Consulta general">Consulta general</option>
            </select>
            
            <!-- El perro va a tener que elegirse de la lista de perros del cliente   -->

            <label class="label" for="fecha">Fecha del turno</label>
            <DateInput bind:value={turno.fecha} bind:format={format}  bind:min={fechaMin} /> 

            <label class="label" for="rangoHorario">Rango Horario</label>
            <select bind:value={turno.rangoHorario} class="select"  name="rangoHorario" required>
                <option value="Manana">Mañana</option>
                <option value="Tarde">Tarde</option>
                <option value="Noche">Noche</option>
            </select>

            <br>
            <br>
            <button class="btn rounded-lg variant-filled" type="submit">Aceptar</button>
        </form>

    </div>

</div>