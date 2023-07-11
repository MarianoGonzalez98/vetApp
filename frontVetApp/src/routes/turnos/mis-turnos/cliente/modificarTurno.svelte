<script lang="ts">
    import type { PerroTurno } from "$lib/interfaces/Perro.interface";
    import { backendURL } from "$lib/utils/constantFactory";
    import { modalStore, type ModalSettings } from "@skeletonlabs/skeleton";

    
    let fechaMin = new Date();

    // Props
    /** Exposes parent props to this component. */
    export let perrosCliente:PerroTurno[]
    export let turnoCliente:string
    export let parent: any;
    export let turnoId:number;
    export let turnoMotivo:string
    export let turnoPerroId: number;
    export let turnoPerroNombre:string;;
    export let turnoFecha:Date;
    export let turnoRango:string;

    
    let fechaParaMostrar:Date =  new Date (turnoFecha);

    // Form Data
    let formData ={
        perros : perrosCliente,
        cliente :turnoCliente,
        id :turnoId,
        perroId:turnoPerroId,
        perroNombre:turnoPerroNombre,
        motivo:turnoMotivo,
        fecha: new Date (turnoFecha),
        rango:turnoRango
    }

    let perroSelect: PerroTurno = {
        nombre: turnoPerroNombre,
        id:turnoPerroId
    }
    const actualizarFormPerro = () => {
        formData.perroId=perroSelect.id;
        formData.perroNombre = perroSelect.nombre;
    }


     const turnoModificado: ModalSettings = {
        type: "alert",
        title: "truno actualizado",
        body: "Turno actualizado correctamente",
        buttonTextCancel: "Ok",
        response: () => location.reload(),
    };

    const fallaRangoCompleto: ModalSettings = {
        type: "alert",
        title: "Fallo en la modificación del turno por cupo completo",
        body: "No se pudo modificar turno. Seleccione otro rango horario u otra fecha",
        buttonTextCancel: "Ok",
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
        await fetch(`${backendURL}/turnos/modificar-turno`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                turnoId: formData.id,
                emailOwner: formData.cliente,
                perroId: formData.perroId,
                perroNombre: formData.perroNombre,
                motivo: formData.motivo,
                fecha: formData.fecha,
                rango: formData.rango
            }),
        })
        .then((res) => {
                if (res.status < 299) {
                    modalStore.clear();
                    modalStore.trigger(turnoModificado);
                    return res;
                }
                if (res.status === 409) {
                    modalStore.clear();
                    modalStore.trigger(fallaRangoCompleto);
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

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
    <div class="modal-example-form {cBase}">
        <header class={cHeader}>Modificar turno</header>
        <header class={cHeader}>Fecha: {fechaParaMostrar.toLocaleDateString()}</header>

        <form class="modal-form {cForm}">     
                <label class="label">
                    <span>Seleccione el perro:</span>
                        <select class="select" bind:value={perroSelect} on:change={actualizarFormPerro}>
                            <option value={perroSelect} disabled selected>{perroSelect.nombre}</option>
                            {#each formData.perros as perro}
                                <option value={perro}>
                                    <span>{perro.nombre} </span>
                                </option>
                            {/each}
                        </select>

                </label>

                <label class="label">
                    <span>Motivo:</span>
                    <select bind:value={formData.motivo} class="select"  name="motivo" required>
                        <option value="Vacunación a">Vacunación a</option>
                        <option value="Vacunación b">Vacunación b</option>
                        <option value="Castración">Castración</option>
                        <option value="Anti-Parasitación">Anti-Parasitación</option>
                        <option value="Consulta general">Consulta general</option>
                    </select>
                </label>
                

                <label class="label" for="formData.fecha">Fecha deL turno:</label>
                <input
                    bind:value={formData.fecha}
                    class="input"
                    type="date"
                    min={fechaMin.toJSON().slice(0,10)}
                    name="formData.fecha"
                    required
                />

                <label class="label">
                    <span>Rango horario:</span>
                    <select bind:value={formData.rango} class="select"  name="rangoHorario" required>
                        <option value="Manana">Mañana</option>
                        <option value="Tarde">Tarde</option>
                        <option value="Noche">Noche</option>
                    </select>
                </label>

                <footer class="modal-footer {parent.regionFooter}">
                    <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
                    <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Aceptar</button>
                </footer>

        </form>
        
        <!-- prettier-ignore -->
    
    </div>
{/if}
