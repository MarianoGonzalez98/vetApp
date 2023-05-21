<script lang="ts">

    //----------------------------PENDIENTES-------------------------------//

    import { onMount } from "svelte";
    import type { Turno } from "$lib/interfaces/Turno.interface";
    import { modalStore, type ModalSettings, Modal } from "@skeletonlabs/skeleton";
    import { goto } from "$app/navigation";
    import { user } from "$lib/stores/user";
    import RechazarTurno from "./rechazarTurno.svelte";
    import ConfirmarRechazo from "./confirmarRechazo.svelte";

    
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

    const handleModalConfirmAceptación = async(aceptado: boolean) =>  {
        if (aceptado === true) {
            await fetch("http://localhost:3000/turnos/aceptar-turno",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    aceptado,
                    idTurnoSelec
                })
            })
            .then((res) => {
                if (res.status < 299) {
                        modalStore.clear();
                        modalStore.trigger(TurnoAceptado);
                        return res;
                }
                if (res.status === 400) {
                        //error por modificacion del token jwt.
                        $user = null;
                        goto("/auth/login");
                        return;
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
                    console.log("Error en la aceptación del turno desconocido: ", error);
            });

        }
    }

    const handleAceptar = (fecha:Date, rango:string, cliente:string, id:number) => {
        const modal: ModalSettings = {
            type: 'confirm',
            title: 'Confirmar aceptación de turno',
            body: `¿Está seguro de aceptar el turno del cliente ${cliente}  
            en el rango horario ${rango} de la fecha ${fecha.toString().slice(0,10)}?`,
            buttonTextCancel:"Cancelar",
            buttonTextConfirm:"Confirmar",

            response: handleModalConfirmAceptación,
        }
        modalStore.clear();
        modalStore.trigger(modal);
        idTurnoSelec = id;
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


<h1>Turnos</h1>
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
                        <p>
                            <span class="font-medium">Descripción: </span>
                            {#if turno.descripcion !== null} {turno.descripcion} {/if}
                            {#if turno.descripcion === null} Sin descripción {/if}
                            {#if turno.descripcion === ""} Sin descripción {/if}
                        </p>
                    </div>
                        <footer class="flex">
                            <button on:click={(event) => handleAceptar(turno.fecha,turno.rangoHorario,turno.emailOwner,turno.id)} class="btn btn-sm variant-ghost-surface mr-2" 
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

