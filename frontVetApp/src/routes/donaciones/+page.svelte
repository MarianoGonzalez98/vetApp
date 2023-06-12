<script lang="ts">
    import type { PaseadorCuidador } from "$lib/interfaces/PaseadoresYCuidadores.interface";
    import { onMount } from "svelte";
    import { user } from "$lib/stores/user";
    import {
        Modal,
        modalStore,
        type ModalSettings,
        type ModalComponent,
        filter,
    } from "@skeletonlabs/skeleton";
    import { goto, preloadCode } from "$app/navigation";
    import type { Campaign } from "$lib/interfaces/Donaciones.interface";
    import ModalDonar from "./ModalDonar.svelte";
    import { backendURL } from "$lib/utils/constantFactory";
    import ModalConfirmarFinalizarCampaign from "./ModalConfirmarFinalizarCampaign.svelte";

    let campaigns: Campaign[] = [];

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

    let nombre = "";
    let apellido = "";
    let email = $user?.email;
    let telefono = "";

    onMount(async () => {
        const res = await fetch(`${backendURL}/donaciones/listar-campaigns`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
            .then((res) => res.json())
            .then((apiResponse) => (campaigns = apiResponse.data));

        if ($user) {
            fetch(`${backendURL}/getPerfil`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            })
                .then((res) => {
                    if (res.status < 299) {
                        //si entra acá no hubo error
                        return res.json();
                    }
                    return Promise.reject(res);
                })
                .then((res) => {
                    nombre = res.nombre;
                    apellido = res.apellido;
                    telefono = res.telefono;
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    });

    const finalizarCampaign = async (campaign: Campaign) => {
        let modalComponent = {
            ref: ModalConfirmarFinalizarCampaign,
            props: { campaign: campaign },
        };
        let modalConfirm: ModalSettings = {
            //esto sí lo uso
            type: "component",
            // Pass the component directly:
            component: modalComponent,
            response: (confirmo: any) => {
                if (confirmo) {
                    campaign.finalizada = true; //marco como finalizada la campaña en el front tmb
                    mostrar = mostrar;
                }
            },
        };
        modalStore.clear();
        modalStore.trigger(modalConfirm);
    };

    let inputNombre: string;
    let inputEstado: string;

    $: mostrar = campaigns.filter((pc) => {
        const nombreMatch = inputNombre
            ? pc.nombre.toLowerCase().match(`.*${inputNombre.toLowerCase()}.*`)
            : true;
        const estadoMatch =
            !inputEstado ||
            (inputEstado == "Finalizadas" && pc.finalizada) ||
            (inputEstado == "Activas" && !pc.finalizada);
        return nombreMatch && estadoMatch;
    }) as Campaign[];

    const handleDonar = (campaign: Campaign) => {
        let modalDonarComponent = {
            ref: ModalDonar,
            props: {
                campaign: campaign,
            },
        };
        const modalDonar: ModalSettings = {
            type: "component",
            component: modalDonarComponent,
            response: (r: any) => console.log("response:", r),
        };
        modalStore.clear();
        modalStore.trigger(modalDonar);
    };
</script>

<Modal />

<div class="flex flex-wrap mb-4">
    <a class="btn variant-filled m-4 mb-0" rel="noreferrer" href="/">Atras</a>
    {#if $user}
        <a
            class="btn variant-filled m-4 ml-0 mb-0"
            rel="noreferrer"
            href="/donaciones/ver-mis-donaciones"
            >Ver mis donaciones realizadas</a
        >
    {/if}
</div>
<h1 class="h1 font-medium ml-3 mb-3">Campañas de donación</h1>
{#if (campaigns.length > 0 && $user?.rol === "veterinario") || campaigns.filter((campaign) => !campaign.finalizada).length < 0}
    <div class="ml-2 flex">
        {#if $user?.rol === "veterinario"}
            <div class="mt-6">
                <a
                    class="ml-2 btn variant-ghost-secondary hover:variant-filled-secondary"
                    rel="noreferrer"
                    href="/donaciones/crear-campaign">Crear campaña</a
                >
            </div>
            <div class="ml-2">
                <label for="filtroEstado" class="text-left whitespace-nowrap"
                    >Filtrar por estado:
                </label>
                <select
                    bind:value={inputEstado}
                    class="input"
                    placeholder="Todas"
                    name="estado"
                    required
                >
                    <option value="" selected>Todas</option>
                    {#each ["Finalizadas", "Activas"] as value}
                        <option {value}>{value}</option>
                    {/each}
                </select>
            </div>
        {/if}
        <div class="ml-2">
            <label for="filtroNombre" class="text-left whitespace-nowrap"
                >Filtrar por nombre:
            </label>
            <input
                type="text"
                bind:value={inputNombre}
                class="input rounded-lg"
                name="filtroNombre"
                id=""
            />
        </div>
    </div>
    <div class="ml-2 flex flex-wrap">
        {#each mostrar as campaign}
            {#if $user?.rol === "veterinario" || !campaign.finalizada}
                <div
                    class="m-2 grayscale hover:grayscale-0 duration-300 rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] variant-ghost-secondary md:max-w-xl md:flex-row"
                >
                    <div class="flex flex-col justify-start p-6">
                        <h5
                            class="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-50"
                        >
                            {campaign.nombre}
                        </h5>
                        <div
                            class="text-base text-neutral-600 dark:text-neutral-200"
                        >
                            {#if campaign.montoARecaudar}
                                <p>
                                    <span class="font-medium"
                                        >Monto a recaudar:
                                    </span>
                                    ${campaign.montoARecaudar}
                                </p>
                            {/if}
                            <p>
                                <span class="font-medium"
                                    >Monto recaudado:
                                </span>
                                ${campaign.montoRecaudado}
                            </p>
                            <p>
                                <span class="font-medium">Fecha límite: </span>
                                {new Date(
                                    campaign.fechaLimite
                                ).toLocaleDateString("es-AR")}
                            </p>
                            <p>
                                <span class="font-medium">Descripción: </span>
                                {campaign.descripcion}
                            </p>
                        </div>
                        <footer class="flex mt-4">
                            {#if !campaign.finalizada}
                                <button
                                    on:click={(event) => handleDonar(campaign)}
                                    class="btn btn-sm variant-ghost-surface mr-2"
                                    >Donar
                                </button>
                                {#if $user?.rol === "veterinario"}
                                    <button
                                        on:click={() => {
                                            finalizarCampaign(campaign);
                                        }}
                                        class="btn btn-sm variant-ghost-surface mr-2"
                                        >Finalizar campaña
                                    </button>
                                {/if}
                            {/if}
                            {#if $user?.rol === "veterinario"}
                                <a
                                    rel="noreferrer"
                                    href="/donaciones/donaciones-a-campaign?campaign={campaign.nombre}"
                                    class="btn btn-sm variant-ghost-surface mr-2"
                                    >Ver donaciones
                                </a>
                            {/if}
                        </footer>
                    </div>
                </div>
            {/if}
        {/each}
    </div>
{:else}
    <div class="flex justify-center items-center h-full">
        {#if $user?.rol === "veterinario"}
            <div class="flex-none">
                <h1 class="text-4xl font-bold mb-6">
                    No hay campañas de donación creadas.
                </h1>
                <div class="flex justify-center">
                    <a
                        class="ml-4 btn variant-ghost-secondary hover:variant-filled-secondary"
                        rel="noreferrer"
                        href="/donaciones/crear-campaign">Crear campaña</a
                    >
                </div>
            </div>
        {:else}
            <h1 class="text-4xl font-bold">
                Ups! Parece que no hay campañas de donación activas.
            </h1>
        {/if}
    </div>
{/if}
