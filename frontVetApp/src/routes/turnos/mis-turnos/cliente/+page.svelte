<script lang="ts">

    //----------------------------ACEPTADOS-------------------------------//

    import { onMount } from "svelte";
    import { user } from "$lib/stores/user";
    import { Modal, modalStore, type ModalSettings, type ModalComponent } from "@skeletonlabs/skeleton";
    import type { Turno } from "$lib/interfaces/Turno.interface";
    import { goto } from "$app/navigation";
    import ModificarTurno from "./modificarTurno.svelte";
    import type { PerroTurno } from "$lib/interfaces/Perro.interface";

    let cliente = $user?.email;
    let turnos: Turno[] = [];
    let idTurnoSelec:number
    let turnoModificar:Turno 
    let perros: PerroTurno[] = [];

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
    //----------------------------Modificar turno----------------------------------------//

    const handleModificar = (turno:Turno) => {
        turnoModificar = turno;

        const modalTest: ModalSettings = {
            type: "component",
            // Pass the component directly:
            component: modalComponent,
            response: (r: any) => console.log("response:", r),
        };
        modalStore.clear();
        modalStore.trigger(modalTest);
    }

    $: modalComponent = {
        // Pass a reference to your custom cosmponent
        ref: ModificarTurno,
        // Add the component properties as key/value pairs
        props: {
            perrosCliente:perros,
            turnoId:turnoModificar.id,
            turnoMotivo: turnoModificar.motivo,
            turnoPerroId:turnoModificar.perroId,
            turnoPerroNombre:turnoModificar.perroNombre,
            turnoFecha: turnoModificar.fecha,
            turnoRango: turnoModificar.rangoHorario
        },
        // Provide a template literal for the default component slot
        slot: "<p>Skeleton</p>",
    };

    //----------------------------Cancelar turno----------------------------------------//
    const TurnoCancelado: ModalSettings = {
        type: 'alert',
        title: 'Turno cancelado',
        body: 'Turno cancelado',
        buttonTextCancel: "Ok",
        response: () => location.reload() // Como hago para que se recargue al seleccionar ok
    };

    const handleModalConfirmCancelación  = async(cancelado: boolean) =>  {
        if (cancelado === true) {
            await fetch("http://localhost:3000/turnos/cancelar-turno",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    cancelado,
                    idTurnoSelec
                })
            })
            .then((res) => {
                if (res.status < 299) {
                        modalStore.clear();
                        modalStore.trigger(TurnoCancelado);
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
        location.reload()
    }

    const handleCancelar = (fecha:Date, rango:string, cliente:string, id:number) => {
        const modal1: ModalSettings = {
            type: 'confirm',
            title: 'Confirmar cancelar turno',
            body: `¿Está seguro de cancelar el turno solicitado en el rango horario ${rango} de la fecha ${fecha.toString().slice(0,10)}?`,
            buttonTextCancel:"Cancelar",
            buttonTextConfirm:"Confirmar",

            response: handleModalConfirmCancelación,
        }
        modalStore.clear();
        modalStore.trigger(modal1);
        idTurnoSelec = id; 
    } 
      
</script>

<Modal />


<h1>Mis TURNOS</h1>

<div class="ml-2 flex flex-wrap">
    {#each turnos as turno}
        {#if (turno.rechazado === false)&&(turno.aceptado === true)}
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
                            Turno Aceptado
                            </h6>
                    {/if}   
                    <h5
                        class="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-50"
                    >
                        {turno.fecha.toString().slice(0,10) + " "} 
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
                        <p>
                            <span class="font-medium">Descripción: </span>
                            {#if turno.descripcion !== null} {turno.descripcion} {/if}
                            {#if turno.descripcion === null} Sin descripción {/if}
                            {#if turno.descripcion === ""} Sin descripción {/if}
                        </p>
                    </div>
                        {#if turno.urgencia === false}
                            <footer class="flex">
                                <button  on:click={(event) => handleModificar(turno)} class="btn btn-sm variant-ghost-surface"
                                    >Modificar</button
                                >
                                <button  on:click={(event) => handleCancelar(turno.fecha,turno.rangoHorario,turno.emailOwner,turno.id)} class="btn btn-sm variant-ghost-surface"
                                    >Cancelar</button
                                >
                            </footer>
                        {/if}
                </div>
            </div>
        {/if}
    {/each}
</div>