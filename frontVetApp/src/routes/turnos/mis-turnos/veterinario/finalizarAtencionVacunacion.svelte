<script lang="ts">

    import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
    import type { Turno } from '$lib/interfaces/Turno.interface';
    import type { Perro, Vacuna } from '$lib/interfaces/Perro.interface';
    import { onMount } from 'svelte';

    export let parent: any;
    export let turnoInfo:Turno;
    
    let peso:number;
    let observacion:string;
    let vacunaAplicada: Vacuna;
    if (turnoInfo.motivo === "Vacunación a") {
        vacunaAplicada = {
            nombre: "Vacuna A",
            fechaDeAplicacion: turnoInfo.fecha.toString().slice(0,10),
        };
    }
    if (turnoInfo.motivo === "Vacunación b") {
        vacunaAplicada = {
            nombre: "Vacuna B",
            fechaDeAplicacion: turnoInfo.fecha.toString(),
        };
    }

    
    onMount ( () => {
        fetch(
        `http://localhost:3000/get-perroJuli?id=${turnoInfo.perroId}`,  //Traerme al perro solo para mostrar el peso
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        }
        )
            .then((res) => res.json())
            .then((apiResponse) => (peso = apiResponse.data.peso));
    });


    const TurnoFinalizado: ModalSettings = {
        type: 'alert',
        title: 'Turno con motivo Vacunación finalizado',
        body: 'Turno Finalizado',
        buttonTextCancel: "Ok",
        response: () => location.reload() 
    };

    const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Fallo en la finalización del turno",
        body: "No se pudo finalización el nuevo turno",
        buttonTextCancel: "Ok",
    };
    const fallaServidor: ModalSettings = {
        type: "alert",
        title: "Fallo en finalización del perfil",
        body: "Falla del servidor",
        buttonTextCancel: "Ok",
    };

    async function onFormSubmit() {
        await fetch("http://localhost:3000/turnos/finalizar-turno-vacunacion",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    id:turnoInfo.perroId,
                    vacunaAplicada,
                    peso,
                    turnoId:turnoInfo.id,
                    observacion
                })
            })
            .then((res) => {
                if (res.status < 299) {
                    modalStore.clear();
                    modalStore.trigger(TurnoFinalizado);
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
                    console.log("Error en el rechazo del turno desconocido: ", error);
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
        {#if turnoInfo.motivo === "Vacunación a"}
		    <header class={cHeader}>Finalizar atención Vacunación A</header>
		{/if}
        {#if turnoInfo.motivo === "Vacunación b"}
		    <header class={cHeader}>Finalizar atención Vacunación B</header>
		{/if}
        <form class="modal-form {cForm}" on:submit|preventDefault={onFormSubmit}>  
            <label class="label">
                <span>Ingrese el peso del perro</span>
                    <input class="input" bind:value={peso} title="input [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" type="number" step="0.01" min="0" required/>
            </label>

            <label class="label"> 
                <span>Ingrese una observación</span>
                <textarea class="textarea" rows="2"  bind:value={observacion} />
            </label>

            <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>Cancelar</button>
            <button class="btn {parent.buttonPositive}" type="submit">Aceptar</button>
        </form>

   
	</div>
{/if}