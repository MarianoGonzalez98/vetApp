<script lang="ts">

    //----------------------------PENDIENTES-------------------------------//

    import { onMount } from "svelte";
    import { user } from "$lib/stores/user";
    import { Modal } from "@skeletonlabs/skeleton";
    import type { Turno } from "$lib/interfaces/Turno.interface";

    let cliente = $user?.email;
    let turnos: Turno[] = [];

    onMount(async () => { 
        const res = await fetch(
            `http://localhost:3000/turnos/listar-turnos/cliente?cliente=${cliente}`,
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
</script>

<Modal />


<h1>Mis TURNOS</h1>

<div class="ml-2 flex flex-wrap">
    {#each turnos as turno}
        {#if (turno.rechazado === false)&&(turno.aceptado === false)}
            <div
                class="m-2 grayscale hover:grayscale-0 duration-300 rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] variant-ghost-secondary md:max-w-xl md:flex-row">
                <div class="flex flex-col justify-start p-6">
                    <h6 class="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-50">
                        Turno Pendiente
                    </h6>  
                    <h5 class="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-50">
                        {turno.fecha.toString().slice(0,10) + " "} 
                        {#if turno.rangoHorario === "Manana"} Mañana {/if} 
                        {#if turno.rangoHorario !== "Manana"} {turno.rangoHorario} {/if}
                    </h5>
                    <div class="mb-4 text-base text-neutral-600 dark:text-neutral-200">
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
                            {#if turno.descripcion !== null} {turno.descripcion} {/if}
                            {#if turno.descripcion === null} Sin descripción {/if}
                            {#if turno.descripcion === ""} Sin descripción {/if}
                        </p>
                    </div>
                        <footer class="flex">
                            <button class="btn btn-sm variant-ghost-surface mr-2"
                                >Modificar</button
                            >
                            <button class="btn btn-sm variant-ghost-surface"
                                >Cancelar</button
                            >
                        </footer>
                 </div>
            </div>
        {/if}
    {/each}
</div>