<script lang="ts">
    import type { Turno } from "$lib/interfaces/Turno.interface";
    import { onMount } from "svelte";
    import ConfirmarArchivar from "./confirmarArchivar.svelte";
    import { modalStore, type ModalSettings, Modal } from "@skeletonlabs/skeleton";

    //----------------------------FINALIZADOS-------------------------------//


    let turnos: Turno[] = [];

    const mostarFechaArg = (fechaTurno:Date) => {
        const nuevaFechaTurnoString = fechaTurno.toString();
        const nuevaFecha = Date.parse(nuevaFechaTurnoString);
        let nuevaFechaDate = new Date(nuevaFecha);

        return nuevaFechaDate.toLocaleDateString('es-AR');
    }

    onMount(async () => { 
        const res = await fetch(
            `http://localhost:3000/turnos/listar-turnos/veterinario`,
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


    const handleArchivar = (turno:Turno) => {
        let modalComponent = {
            ref: ConfirmarArchivar,
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
</script>

<Modal />

<a class="btn rounded-lg variant-filled m-4" rel="noreferrer" href="/turnos">Volver a turnos</a>
<div class="ml-2 flex flex-wrap">
    {#if (turnos.filter((turno)=> {
        return (turno.finalizado === true)}).length === 0)
    }
        <h6 class="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-50"> No hay turnos finalizados</h6>
    {/if} 
    {#each turnos as turno}
        {#if (turno.finalizado === true)&&(turno.archivado === false)}
            <div
                class="m-2 grayscale hover:grayscale-0 duration-300 rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] variant-ghost-secondary md:max-w-xl md:flex-row"
            >
                <div class="flex flex-col justify-start p-6">
                    {#if turno.urgencia === true}
                            <h6 class="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-50">
                            Urgencia
                            </h6>
                    {/if}   
                    {#if turno.urgencia === false}
                            <h6 class="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-50">
                            Turno finalizado
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
                        <p>
                            <span class="font-medium">Descripción: </span>
                            {turno.descripcion} 
                        
                        </p>
                        <p>
                            <span class="font-medium">Precio: </span>
                            {turno.precio} 
                        
                        </p>
                    </div>
                    <footer class="flex">
                        <button on:click={(event) => handleArchivar(turno)}  class="btn btn-sm variant-ghost-surface"
                            >Archivar</button
                        >
                    </footer>          
                </div>
            </div>
        {/if}
    {/each}
</div>

