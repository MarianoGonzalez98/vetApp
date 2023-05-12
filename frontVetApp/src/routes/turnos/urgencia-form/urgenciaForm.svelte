<script lang="ts">
import { type AutocompleteOption,Autocomplete } from "@skeletonlabs/skeleton";
import DateInput from "date-picker-svelte/DateInput.svelte";

let cliente = '';
const clientsOptions: AutocompleteOption[] = [ 
    {label: "Carlos", value: "carlos"},
    {label: "Luis", value: "luis"},
    {label: "Fabiana", value: "fabiana"},
    {label: "Hilda", value: "hilda"},
    {label: "Rodolfo", value: "rodolfo"},
    {label: "Pedro", value: "pedro"}
]

function onClientSelection(event: any): void {
	cliente = event.detail.label;
}

let motivo = '';
let fecha = new Date();
let format = 'dd-MM-yyyy'
let placeholder= 'Elija una fecha'
let rangoHorario = '';

</script>


<div class="container h-full mx-auto flex justify-center items-center">
    <div class="card p-4">
        <h2>Registar urgencia</h2>
        <br>
        <form  class="space-y-2">

            <input class="input" type="search" name="cliente" bind:value={cliente} placeholder="Search..." />
            <div class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto">
                <Autocomplete bind:input={cliente} options={clientsOptions} on:selection={onClientSelection} />
            </div>
            

            <label class="label" for="motivo">Motivo</label>
            <select bind:value={motivo} class="select"  name="motivo" required>
                <option value="1">Vacunación</option>
                <option value="2">Castración</option>
                <option value="3">Anti-Parasitación</option>
                <option value="4">Consulta general</option>
            </select>
            
            <!-- El perro va a tener que elegirse de la lista de perros del cliente   -->

            <label class="label" for="fecha">Fecha del turno</label>
            <DateInput bind:value={fecha} bind:format={format} bind:placeholder={placeholder}/> 

            <label class="label" for="rangoHorario">Rango Horario</label>
            <select bind:value={rangoHorario} class="select"  name="rangoHorario" required>
                <option value="1">Mañana</option>
                <option value="2">Tarde</option>
                <option value="3">Noche</option>
            </select>

            <label class="label">
                <span>Descripción</span>
                <textarea class="textarea" rows="2" placeholder="Ingrese una descripción" />
            </label>

            <br>
            <br>
            <button class="btn rounded-lg variant-filled" type="submit">Aceptar</button>
        </form>

    </div>

</div>