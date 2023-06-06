<script lang="ts">

    //----------------------------ACEPTADOS-------------------------------//

    import { onMount } from "svelte";
    import type { Turno } from "$lib/interfaces/Turno.interface";
    import { modalStore, type ModalSettings, Modal } from "@skeletonlabs/skeleton";
    import { goto } from "$app/navigation";
    import { user } from "$lib/stores/user";
    import ConfirmarRechazo from "../veterinarioPendientes/confirmarRechazo.svelte";
    import { backendURL } from "$lib/utils/constantFactory";
  

    
    let turnos: Turno[] = [];

    let idTurnoSelec:number

    const mostarFechaArg = (fechaTurno:Date) => {
        const nuevaFechaTurnoString = fechaTurno.toString();
        const nuevaFecha = Date.parse(nuevaFechaTurnoString);
        let nuevaFechaDate = new Date(nuevaFecha);

        return nuevaFechaDate.toLocaleDateString('es-AR');
    }

    const compararFechas = (fechaTurno: Date) => { //la fecha del turno debe ser un dia mas (por lo menos) a la fecha de hoy
        let fechaHoy = new Date();
        let fechaHoyTiempo = fechaHoy.getTime();

        const nuevaFechaTurnoString = fechaTurno.toString();
        const nuevaFecha = Date.parse(nuevaFechaTurnoString);
        let nuevaFechaDate = new Date(nuevaFecha);
        let fechaTurnoTiempo = nuevaFechaDate.getTime();

        return fechaTurnoTiempo >= fechaHoyTiempo 
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
<div class="ml-2 flex flex-wrap">
    {#each turnos as turno}
        {#if turnos.length === 0}
            No hay turnos para visualizar
        {/if}
        {#if (turno.rechazado === false)&&(turno.aceptado === true)&&(turno.urgencia === false)}
            <div
                class="m-2 grayscale hover:grayscale-0 duration-300 rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] variant-ghost-secondary md:max-w-xl md:flex-row"
            >
                <div class="flex flex-col justify-start p-6">
                    {#if turno.urgencia === false}
                            <h6 class="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-50">
                            Turno Aceptado
                            </h6>
                    {/if}   
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
                        {#if (compararFechas(turno.fecha))}
                            <button on:click={(event) => handleRechazar(turno)}  class="btn btn-sm variant-ghost-surface"
                                >Rechazar</button
                            >
                        {/if}
                    </footer>          
                </div>
            </div>
        {/if}
    {/each}
</div>

