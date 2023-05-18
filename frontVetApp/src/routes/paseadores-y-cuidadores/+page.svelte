<script lang="ts">
    import type { PaseadorCuidador } from "$lib/interfaces/PaseadoresYCuidadores.interface";
    import { onMount } from "svelte";
    import { user } from "$lib/stores/user";
    import {
        Modal,
        modalStore,
        type ModalSettings,
    } from "@skeletonlabs/skeleton";
    import { goto } from "$app/navigation";
    let paseadorescuidadores: PaseadorCuidador[] = [];

    const fallaServidor: ModalSettings = {
        type: "alert",
        title: "Fallo de la carga del perro",
        body: "Falla del servidor",
        buttonTextCancel: "Ok",
    };

    const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Fallo de la carga del perro",
        body: "No se pudo cargar el nuevo perro",
        buttonTextCancel: "Ok",
    };

    onMount(async () => {
        const res = await fetch(
            "http://localhost:3000/listar-paseadorescuidadores",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        )
            .then((res) => res.json())
            .then((apiResponse) => (paseadorescuidadores = apiResponse.data));

        if (!($user?.rol === "veterinario")) {
            paseadorescuidadores = paseadorescuidadores.filter(
                (pc) => pc.disponible
            );
        }
    });

    const cambiarDisponibilidad = async (
        email: string,
        disponible: boolean
    ) => {
        let error: boolean = false;

        await fetch("http://localhost:3000/cambiar-disponible", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                email: email,
                disponible: disponible,
            }),
        })
            .then((res) => {
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
                console.log(
                    "Error desconocido en carga del paseador/cuidador : ",
                    error
                );
            });
    };

    let inputZona: string;
    let inputHorario: string;
    let inputNombre: string;

    $: mostrar = paseadorescuidadores.filter((pc) => {
        const zonaMatch = inputZona
            ? pc.zona.toLowerCase().match(`.*${inputZona.toLowerCase()}.*`)
            : true;
        const horarioMatch = inputHorario
            ? pc.disponibilidad
                  .toLowerCase()
                  .match(`.*${inputHorario.toLowerCase()}.*`)
            : true;
        const nombreMatch = inputNombre
            ? pc.nombre
                  .toLowerCase()
                  .concat(" " + pc.apellido.toLowerCase())
                  .match(`.*${inputNombre.toLowerCase()}.*`)
            : true;
        return zonaMatch && horarioMatch && nombreMatch;
    });
</script>

<Modal />

<h1>Paseadores y Cuidadores</h1>
{#if paseadorescuidadores.length > 0}
    <div class="flex">
        {#if $user?.rol === "veterinario"}
            <div class="mt-6">
                <a
                    class="ml-4 btn variant-ghost-secondary hover:variant-filled-secondary"
                    rel="noreferrer"
                    href="/paseadores-y-cuidadores/cargar-paseadorcuidador"
                    >Cargar paseador/cuidador</a
                >
            </div>
        {/if}
        <div class="ml-2">
            <label for="filtroRaza" class="text-left whitespace-nowrap"
                >Filtrar por zona:
            </label>
            <input
                type="text"
                bind:value={inputZona}
                class="input"
                name="filtroRaza"
                id=""
            />
        </div>
        <div class="ml-2">
            <label for="filtroRaza" class="text-left whitespace-nowrap"
                >Filtrar por disponibilidad:
            </label>
            <input
                type="text"
                bind:value={inputHorario}
                class="input"
                name="filtroRaza"
                id=""
            />
        </div>
        <div class="ml-2">
            <label for="filtroRaza" class="text-left whitespace-nowrap"
                >Filtrar por nombre:
            </label>
            <input
                type="text"
                bind:value={inputNombre}
                class="input"
                name="filtroRaza"
                id=""
            />
        </div>
    </div>
    <div class="ml-2 flex flex-wrap">
        {#each mostrar as pc}
            <div
                class="m-2 grayscale hover:grayscale-0 duration-300 rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] variant-ghost-secondary md:max-w-xl md:flex-row md:"
            >
                <div class="flex flex-col justify-start p-6">
                    <h5
                        class="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-50"
                    >
                        {pc.nombre}
                        {pc.apellido}
                    </h5>
                    <div
                        class="text-base text-neutral-600 dark:text-neutral-200"
                    >
                        <p>
                            <span class="font-medium">Zona: </span>
                            {pc.zona}
                        </p>
                        <p>
                            <span class="font-medium">Oficio: </span>
                            {pc.oficio}
                        </p>
                        <p>
                            <span class="font-medium">Email: </span>
                            {pc.email}
                        </p>
                        <p>
                            <span class="font-medium">Teléfono: </span>
                            {pc.telefono}
                        </p>
                        <p>
                            <span class="font-medium">Disponibilidad: </span>
                            {pc.disponibilidad}
                        </p>
                    </div>
                    {#if $user?.rol === "veterinario"}
                        <footer class="flex mt-4">
                            <button
                                on:click={() => {
                                    pc.disponible = !pc.disponible;
                                    cambiarDisponibilidad(
                                        pc.email,
                                        pc.disponible
                                    );
                                }}
                                class="btn btn-sm variant-ghost-surface mr-2"
                                >Marcar como {#if pc.disponible}
                                    "No disponible"
                                {:else}
                                    "Disponible"
                                {/if}
                            </button>
                        </footer>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
{:else}
    <div class="flex justify-center items-center h-screen">
        {#if $user?.rol === "veterinario"}
            <div class="flex-none">
                <h1 class="text-4xl font-bold mb-6">
                    Todavía no cargaste ningún paseador o cuidador.
                </h1>
                <div class="flex justify-center">
                    <a
                        class="btn variant-filled-secondary"
                        rel="noreferrer"
                        href="/paseadores-y-cuidadores/cargar-paseadorcuidador"
                        >Cargar paseador/cuidador</a
                    >
                </div>
            </div>
        {:else}
            <h1 class="text-4xl font-bold">
                Ups! Parece que no hay paseadores disponibles.
            </h1>
        {/if}
    </div>
{/if}
