<script lang="ts">

    //----------------------------ACEPTADOS-------------------------------//

    import { onMount } from "svelte";
    import type { Turno } from "$lib/interfaces/Turno.interface";
    import { modalStore, type ModalSettings, Modal } from "@skeletonlabs/skeleton";
    import ConfirmarRechazo from "../veterinarioPendientes/confirmarRechazo.svelte";
    import FinalizarAtencionVacunacion from "./finalizarAtencionVacunacion.svelte";
    import FinalizarAtencionCastracion from "./finalizarAtencionCastracion.svelte";
    import FinalizarAtencionAntiparasitacion from "./finalizarAtencionAntiparasitacion.svelte";
    import FinalizarAtencionConsultaGeneral from "./finalizarAtencionConsultaGeneral.svelte";

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
        fechaHoy.setDate(fechaHoy.getDate() + 1)
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

    const handleFinalizar = (turno:Turno) => {
        if((turno.motivo === "Vacunación a")||(turno.motivo === "Vacunación b")) {
            let modalComponent = {
                ref: FinalizarAtencionVacunacion, //Ver como modularizar (es lo único)
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
        if(turno.motivo === "Castración") {
            let modalComponent = {
                ref: FinalizarAtencionCastracion,
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
        if(turno.motivo === "Anti-Parasitación") {
            let modalComponent = {
                ref: FinalizarAtencionAntiparasitacion,
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
        if(turno.motivo === "Consulta general") {
            let modalComponent = {
                ref: FinalizarAtencionConsultaGeneral,
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
    }

</script>

<Modal />



<a class="btn rounded-lg variant-filled m-4" rel="noreferrer" href="/turnos">Volver a turnos</a>
<div class="ml-2 flex flex-wrap">
    {#if (turnos.filter((turno)=> {
        return (turno.aceptado === true)&&(turno.rechazado === false)&&(turno.finalizado === false)}).length === 0)
    }
        <h6 class="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-50"> No hay turnos aceptados</h6>
    {/if} 
    {#each turnos as turno}
        {#if (turno.rechazado === false)&&(turno.aceptado === true)&&(turno.finalizado === false)}
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
                        {#if !(compararFechas(turno.fecha))}
                        <button on:click={(event) => handleFinalizar(turno)}  class="btn btn-sm variant-ghost-surface"
                            >Finalizar</button
                        >
                        {/if}
                    </footer>          
                </div>
            </div>
        {/if}
    {/each}
</div>

