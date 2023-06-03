<script lang="ts">

    //----------------------------PENDIENTES-------------------------------//

    import { onMount } from "svelte";
    import type { Turno } from "$lib/interfaces/Turno.interface";
    import { modalStore, type ModalSettings, Modal } from "@skeletonlabs/skeleton";
    import { goto } from "$app/navigation";
    import { user } from "$lib/stores/user";
    import ConfirmarRechazo from "./confirmarRechazo.svelte";
    import ConfirmarAceptacion from "./confirmarAceptacion.svelte";
    import { backendURL } from "$lib/utils/constantFactory";

    
    let turnos: Turno[] = [];

    let idTurnoSelec:number

    const mostarFechaArg = (fechaTurno:Date) => {
        const nuevaFechaTurnoString = fechaTurno.toString();
        const nuevaFecha = Date.parse(nuevaFechaTurnoString);
        let nuevaFechaDate = new Date(nuevaFecha);

        return nuevaFechaDate.toLocaleDateString('es-AR');
    }

    onMount(async () => { 
        const res = await fetch(
            `${backendURL}/turnos/listar-turnos/veterinario`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        )
            .then((res) => res.json())
            .then((apiResponse) => (turnos = apiResponse.data));
    });


    const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Fallo en la solicitud del turno",
        body: "No se pudo solicitar el nuevo turno",
        buttonTextCancel: "Ok",
    };

    const fallaServidor: ModalSettings = {
        type: "alert",
        title: "Fallo en la solicitud del turno",
        body: "Falla del servidor",
        buttonTextCancel: "Ok",
    };


    //----------------------------Aceptar turno----------------------------------------//
    const TurnoAceptado: ModalSettings = {
        type: 'alert',
        title: 'Turno aceptado',
        body: 'Turno aceptado',
        buttonTextCancel: "Ok",
        response: () => location.reload() // Como hago para que se recargue al seleccionar ok
    };

    

    const handleAceptar = (turno:Turno) => {
        let modalComponent = {
            ref: ConfirmarAceptacion,
            props: { turnoInfo:turno},
        };

        let modalConfirm: ModalSettings = { 
            type: 'component',
            // Pass the component directly:
            component: modalComponent,
            response: (confirmo: any) => {
            },
        };
        modalStore.clear();
        modalStore.trigger(modalConfirm);
    }


    //----------------------------Rechazar turno----------------------------------------//

    const handleRechazar = (turno:Turno) =>  {
            let modalComponent = {
                ref: ConfirmarRechazo,
                props: { idTurnoSelec:turno.id, 
                        turnoFecha:turno.fecha,
                        },
            };
            
            let modalConfirm: ModalSettings = { 
                type: 'component',
                // Pass the component directly:
                component: modalComponent,
                response: (confirmo: any) => {
                },
            };
            modalStore.clear();
            modalStore.trigger(modalConfirm);
    }


</script>

<Modal />

<a class="btn rounded-lg variant-filled m-4" rel="noreferrer" href="/turnos">Volver a turnos</a>
{#if (turnos.filter((turno)=> {
    return (turno.aceptado === false)&&(turno.rechazado === false)}).length === 0)
}
    <h6 class="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-50"> No hay turnos pendientes</h6>
{/if} 
<div class="ml-2 flex flex-wrap">
    {#each turnos as turno}
        {#if (turno.rechazado === false)&&(turno.aceptado === false)}
            <div
                class="m-2 grayscale hover:grayscale-0 duration-300 rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] variant-ghost-secondary md:max-w-xl md:flex-row"
            >
                <div class="flex flex-col justify-start p-6">  
                        <h6 class="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-50">
                        Turno Pendiente
                        </h6>  
                    <h5
                        class="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-50"
                    >
                    {mostarFechaArg(turno.fecha)} 
                    {#if turno.rangoHorario === "Manana"} Mañana {/if} 
                    {#if turno.rangoHorario !== "Manana"} {turno.rangoHorario} {/if}

                    </h5>
                    <div
                        class="mb-4 text-base text-neutral-600 dark:text-neutral-200"
                    >   
                        <p>
                            <span class="font-medium">Cliente: </span>
                            {turno.emailOwner}
                        </p>
                        <p>
                            <span class="font-medium">Perro: </span>
                            {turno.perroNombre}
                        </p>
                        <p>
                            <span class="font-medium">Motivo: </span>
                            {turno.motivo} 
                        
                        </p>
                    </div>
                        <footer class="flex">
                            <button on:click={(event) => handleAceptar(turno)} class="btn btn-sm variant-ghost-surface mr-2" 
                                >Aceptar </button
                            >
                            <button on:click={(event) => handleRechazar(turno)} class="btn btn-sm variant-ghost-surface"
                                >Rechazar</button
                            >
                        </footer>                   
                    </div>
             </div>
        {/if}
        

    {/each}
</div>

