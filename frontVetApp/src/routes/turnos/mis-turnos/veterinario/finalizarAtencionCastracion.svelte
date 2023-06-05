<script lang="ts">

    import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
    import type { Turno } from '$lib/interfaces/Turno.interface';
    import { onMount } from 'svelte';
    import type { ClienteConMonto } from '$lib/interfaces/Cliente.interface';

    export let parent: any;
    export let turnoInfo:Turno;
    
    let peso:number;
    let observacion:string;
    let castrado:boolean = true;

    let precio:number = 0;
    let hayPrecio:boolean = false;

    let cliente:ClienteConMonto = {
        nombre:"",
        apellido:"",
        email: turnoInfo.emailOwner,
        montoAcumuladoDescuento: 0
    };

    let descuento50: number;

    
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

            fetch(`http://localhost:3000/clienteJuli?email=${turnoInfo.emailOwner}`,  //Traerme al cliente para saber el descuento acumulado
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        }
        )
            .then((res) => res.json())
            .then((apiResponse) => (cliente = apiResponse.data));
    });

    const actualizar50Desc = () => {
        descuento50 = 50 * precio / 100;
        hayPrecio = true;
    }

    const TurnoFinalizado: ModalSettings = {
        type: 'alert',
        title: 'Turno con motivo Castración finalizado',
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
        await fetch("http://localhost:3000/turnos/finalizar-turno-castracion",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    id:turnoInfo.perroId,
                    castrado,
                    peso,
                    turnoId:turnoInfo.id,
                    observacion,
                    precio,
                    descuentoCliente: cliente.montoAcumuladoDescuento
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
		<header class={cHeader}>Finalizar atención Castración</header>
		
        <form class="modal-form {cForm}" on:submit|preventDefault={onFormSubmit}>  
            <label class="label">
                <span>Ingrese el peso del perro</span>
                    <input class="input" bind:value={peso} title="input [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" type="number" step="0.01" min="0" required/>
            </label>

            <label class="label"> 
                <span>Ingrese una observación</span>
                <textarea class="textarea" rows="2"  bind:value={observacion} />
            </label>

            <label class="label">
                <span>Ingrese el precio del turno</span>
                    <input class="input" bind:value={precio} title="input [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" type="number" step="0.01" min="0" on:change={actualizar50Desc} required/>
            </label>
            <div class="card p-4">
                {#if hayPrecio}
                    {#if cliente.montoAcumuladoDescuento <= descuento50}
                        <span>Descuento acumulado del cliente por donaciones: {cliente.montoAcumuladoDescuento}</span> <br>
                        <span>Descuento máximo (50% del precio): {descuento50}</span><br>
                        <header class={cHeader}>Precio final del turno: {precio - cliente.montoAcumuladoDescuento}</header>
                    {/if}
                    {#if cliente.montoAcumuladoDescuento > descuento50}
                        <span>Descuento acumulado del cliente por donaciones: {cliente.montoAcumuladoDescuento}</span> <br>
                        <span>Descuento máximo (50% del precio): {descuento50}</span><br>
                        <header class={cHeader}>Precio final: {precio - descuento50}</header>
                    {/if}   
                {/if}
            </div>

            <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>Cancelar</button>
            <button class="btn {parent.buttonPositive}" type="submit">Aceptar</button>
        </form>

   
	</div>
{/if}