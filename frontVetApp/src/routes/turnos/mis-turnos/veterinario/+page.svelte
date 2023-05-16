<script lang="ts">
    import { onMount } from "svelte";
    import type { Turno } from "$lib/interfaces/Turno.interface";
    import { modalStore, type ModalSettings, Modal } from "@skeletonlabs/skeleton";
    import { goto } from "$app/navigation";
    import { user } from "$lib/stores/user";
    
    
    let turnos: Turno[] = [];

    let idTurnoSelec:number

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

    const TurnoAceptado: ModalSettings = {
        type: 'alert',
        title: 'Turno aceptado',
        body: 'Turno aceptado',
        buttonTextCancel: "Ok",
        response: (r: boolean) => goto("/"),
    };

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

    const handleModalConfirmContacto = async(aceptado: boolean) =>  {
        fetch("http://localhost:3000/turnos/aceptar-turno",{
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
                console.log("Error en la solicitud del turno desconocido: ", error);
        });

        location.reload();
    }

    

    const handleAceptar = (fecha:Date, rango:string, cliente:string, id:number) => {
        const modal: ModalSettings = {
            type: 'confirm',
            title: 'Confirmar aceptación de turno',
            body: `¿Está seguro de aceptar el turno del cliente ${cliente}  
            en el rango horario ${rango} de la fecha ${fecha.toString().slice(0,10)}?`,
            buttonTextCancel:"Cancelar",
            buttonTextConfirm:"Confirmar",

            response: handleModalConfirmContacto,
        }
        modalStore.clear();
        modalStore.trigger(modal);
        idTurnoSelec = id;
    }

</script>

<Modal />


<h1>Turnos</h1>

<div class="ml-2 flex flex-wrap">
    {#each turnos as turno}
        <div
            class="m-2 grayscale hover:grayscale-0 duration-300 rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] variant-ghost-secondary md:max-w-xl md:flex-row"
        >
            <div class="flex flex-col justify-start p-6">
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
                    {#if turno.aceptado === false}
                        <footer class="flex">
                            <button on:click={(event) => handleAceptar(turno.fecha,turno.rangoHorario,turno.emailOwner,turno.id)} class="btn btn-sm variant-ghost-surface mr-2" 
                                >Aceptar </button
                            >
                            <button class="btn btn-sm variant-ghost-surface"
                                >Rechazar</button
                            >
                        </footer>
                    {/if}
                    {#if turno.aceptado === true}
                        <h5 class="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-50">
                        Aceptado 
                        </h5>
                    {/if}
            </div>
        </div>
    {/each}
</div>