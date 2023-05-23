<script lang="ts">

    //----------------------------ACEPTADOS-------------------------------//

    import { onMount } from "svelte";
    import { user } from "$lib/stores/user";
    import { Modal, modalStore, type ModalSettings, type ModalComponent } from "@skeletonlabs/skeleton";
    import type { Turno } from "$lib/interfaces/Turno.interface";
    import { goto } from "$app/navigation";
    import ModificarTurno from "./modificarTurno.svelte";

    import type { PerroTurno } from "$lib/interfaces/Perro.interface";
    import CancelarTurnoConfirmacion from "./cancelarTurnoConfirmacion.svelte";

    let cliente = $user?.email;
    let turnos: Turno[] = [];
    let idTurnoSelec:number
    let turnoModificar:Turno 
    let perros: PerroTurno[] = [];

    const compararFechas = (fechaTurno: Date) => { //la fecha del turno debe ser un dia mas (por lo menos) a la fecha de hoy
        let fechaHoy = new Date();
        fechaHoy.setDate(fechaHoy.getDate() + 1); //mañana
        let fechaHoyTiempo = fechaHoy.getTime();

        const nuevaFechaTurnoString = fechaTurno.toString();
        const nuevaFecha = Date.parse(nuevaFechaTurnoString);
        let nuevaFechaDate = new Date(nuevaFecha);
        let fechaTurnoTiempo = nuevaFechaDate.getTime();

        return fechaTurnoTiempo >= fechaHoyTiempo 
    }

    const mostarFechaArg = (fechaTurno:Date) => {
        const nuevaFechaTurnoString = fechaTurno.toString();
        const nuevaFecha = Date.parse(nuevaFechaTurnoString);
        let nuevaFechaDate = new Date(nuevaFecha);

        return nuevaFechaDate.toLocaleDateString('es-AR');
    }
    

    onMount(async () => { 
        await fetch(
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

        await  fetch(
            `http://localhost:3000/listar-perros?cliente=${cliente}`, 
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        )
            .then((res) => res.json())
            .then((apiResponse) => (perros = apiResponse.data));
    });



    //----------------------------Modificar turno----------------------------------------//

    const handleModificar = (turno:Turno) => {
        turnoModificar = turno;

       let modalComponent = {
            // Pass a reference to your custom cosmponent
            ref: ModificarTurno,
            // Add the component properties as key/value pairs
            props: {
                perrosCliente:perros,
                turnoCliente: $user?.email,
                turnoId:turnoModificar.id,
                turnoMotivo: turnoModificar.motivo,
                turnoPerroId:turnoModificar.perroId,
                turnoPerroNombre:turnoModificar.perroNombre,
                turnoFecha: turnoModificar.fecha,
                turnoRango: turnoModificar.rangoHorario
            },
        };

        let modalTest: ModalSettings = {
            type: "component",
            // Pass the component directly:
            component: modalComponent,
            response: (r: any) => console.log("response:", r),
        };
        modalStore.clear();
        modalStore.trigger(modalTest);


    }


    //----------------------------Cancelar turno----------------------------------------//


    const handleCancelar = (turno:Turno) => {
        let modalComponent = {
            ref: CancelarTurnoConfirmacion,
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
        return (turno.aceptado === true)&&(turno.rechazado === false)}).length === 0)
    }
        <h6 class="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-50"> No hay turnos aceptados</h6>
    {/if} 
    {#each turnos as turno}
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
                            <span class="font-medium">Perro: </span>
                            {turno.perroNombre}
                        </p>
                        <p>
                            <span class="font-medium">Motivo: </span>
                            {turno.motivo} 
                        
                        </p>
                    </div>
                        {#if compararFechas(turno.fecha)}
                            <footer class="flex">
                                <button  on:click={(event) => handleModificar(turno)} class="btn btn-sm variant-ghost-surface"
                                    >Modificar</button
                                >
                                <button  on:click={(event) => handleCancelar(turno)} class="btn btn-sm variant-ghost-surface"
                                    >Cancelar</button
                                >
                            </footer>
                        {/if}
                </div>
            </div>
        {/if}
    {/each}
</div>