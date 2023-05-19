<script lang="ts">
    import type { PerroTurno } from "$lib/interfaces/Perro.interface";
    import type { Turno } from "$lib/interfaces/Turno.interface";
    import { Modal, modalStore, type ModalSettings } from "@skeletonlabs/skeleton";
    import { goto } from "$app/navigation";

    let fechaMin = new Date().toJSON().slice(0, 10);
    let turno:Turno;

    // Props
    /** Exposes parent props to this component. */
    export let perrosCliente:PerroTurno[]
    export let parent: any;
    export let turnoId:number;
    export let turnoMotivo:string
    export let turnoPerroId: number;
    export let turnoPerroNombre:string;;
    export let turnoFecha:Date;
    export let turnoRango:string;
    
    // Form Data
    let perros = perrosCliente
    let id = turnoId
    let perroId=turnoPerroId
    let perroNombre=turnoPerroNombre
    let motivo=turnoMotivo
    let fecha=turnoFecha
    let rango=turnoRango

    let perroSelect: PerroTurno = {
        nombre: perroNombre,
        id: perroId
    }
    const actualizarFormPerro = () => {
        perroId=perroSelect.id;
        perroNombre = perroSelect.nombre;
    }


     const turnoModificado: ModalSettings = {
        type: "alert",
        title: "truno actualizado",
        body: "Turno actualizado correctamente",
        buttonTextCancel: "Ok",
        response: (r: boolean) => goto("/turnos"),
    };

     const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Error desconocido",
        body: "No se pudo actualizar el perfil",
        buttonTextCancel: "Ok",
    };

    const fallaServidor: ModalSettings = {
        type: "alert",
        title: "Fallo en actualizacion del perfil",
        body: "Falla del servidor",
        buttonTextCancel: "Ok",
    };
    

    // We've created a custom submit function to pass the response and close the modal.
    async function onFormSubmit() {
        turno.id = id
        turno.perroId = perroId
        turno.perroNombre =perroNombre
        turno.motivo = motivo
        turno.fecha = fecha
        turno.rangoHorario = rango
        console.log(turno.motivo)

        await fetch("http://localhost:3000/turnos/modificar-turno", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                turno
            }),
        })
        .then((res) => {
                if (res.status < 299) {
                    modalStore.clear();
                    modalStore.trigger(turnoModificado);
                    return res;
                }
                if (res.status === 500) {
                    modalStore.clear();
                    modalStore.trigger(fallaServidor);
                    return res;
                }
            })
            .catch((error) => {
                modalStore.clear();
                modalStore.trigger(fallaDesconocida);
                console.log("Error desconocido: ", error);
            });
    }

    // Base Classes
    const cBase = "card p-4 w-modal shadow-xl space-y-4";
    const cHeader = "text-2xl font-bold";
    const cForm =
        "border border-surface-500 p-4 space-y-4 rounded-container-token";
   
</script>
<Modal/>
<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
    <div class="modal-example-form {cBase}">
        <header class={cHeader}>Modificar turno</header>

        <form class="modal-form {cForm}">     
                <label class="label">
                    <span>Seleccione el perro:</span>
                    <select id="seleccionPerro" style="color: black;" bind:value={perroSelect} on:change={actualizarFormPerro}>
                        {#each perros as perro}
                            <option value={perro}>
                                <span>{perro.nombre} </span>
                            </option>
                        {/each}
                    </select>
                </label>

                <label class="label">
                    <span>Motivo:</span>
                    <select bind:value={motivo} class="select"  name="motivo" required>
                        <option value="Vacunación a">Vacunación a</option>
                        <option value="Vacunación b">Vacunación b</option>
                        <option value="Castración">Castración</option>
                        <option value="Anti-Parasitación">Anti-Parasitación</option>
                        <option value="Consulta general">Consulta general</option>
                    </select>
                </label>
                

                <label class="label" for="fecha">Fecha deL turno:</label>
                <input
                    bind:value={fecha}
                    class="input"
                    type="date"
                    min={fechaMin}
                    name="fecha"
                    required
                />

                <label class="label">
                    <span>Rango horario:</span>
                    <select bind:value={rango} class="select"  name="rangoHorario" required>
                        <option value="Manana">Mañana</option>
                        <option value="Tarde">Tarde</option>
                        <option value="Noche">Noche</option>
                    </select>
                </label>

        </form>
        
        <!-- prettier-ignore -->
        <footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Submit Form</button>
    </footer>
    </div>
{/if}
