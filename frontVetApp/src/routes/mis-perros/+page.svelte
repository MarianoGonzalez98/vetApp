<script lang="ts">
    import { onMount } from "svelte";
    import { user } from "$lib/stores/user";
    import type { Perro } from "$lib/interfaces/Perro.interface";
    import {
        Modal,
        modalStore,
        type ModalSettings,
    } from "@skeletonlabs/skeleton";
    import { afterNavigate, goto } from "$app/navigation";
    import type { AfterNavigate } from "@sveltejs/kit";
    import ModalConfirmarMarcarFallecido from "./ModalConfirmarMarcarFallecido.svelte";
    import { backendURL } from "$lib/utils/constantFactory";

    let cliente: string =
        new URLSearchParams(window.location.search).get("cliente") ??
        $user?.email ??
        "";

    afterNavigate((nav: AfterNavigate) => {
        if (
            $user?.rol === "veterinario" &&
            new URLSearchParams(window.location.search).get("cliente") === null
        ) {
            goto("/");
        }
    });

    let perros: Perro[] = [];
    let mostrar: Perro[] = [];

    onMount(async () => {
        const res = await fetch(
            `${backendURL}/listar-perros?cliente=${cliente}`,
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
        mostrar = perros;
        console.log(typeof perros[0].vacunas);
    });

    const handleMarcarFallecido = async (perro: Perro) => {
        let modalComponent = {
            ref: ModalConfirmarMarcarFallecido,
            props: { perro: perro },
        };

        let modalConfirm: ModalSettings = {
            //esto sí lo uso
            type: "component",
            // Pass the component directly:
            component: modalComponent,
            response: (confirmo: any) => {
                if (confirmo) {
                    perro.fallecido = true; //marco como fallecido al perro en el front tmb
                    mostrar = mostrar.filter((p) => !(p === perro)); //esta asignación es por la reactividad
                }
            },
        };
        modalStore.clear();
        modalStore.trigger(modalConfirm);
    };
    const espacio = " ";
</script>

<Modal />

<h1 class="h1 m-4 font-medium">Perros</h1>

{#if mostrar.length > 0}
    <div class="ml-2 flex flex-wrap items-start">
        {#each mostrar as perro}
            <div
                class="m-2 grayscale hover:grayscale-0 duration-300 rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] variant-ghost-secondary max-w-sm md:flex-row min-h-0 h-auto"
            >
                <header>
                    {#if perro.foto}
                        <img
                            class="object-cover h-full w-full rounded-t-lg"
                            src={perro.foto}
                            alt="foto de perfil"
                        />
                    {:else}
                        <img
                            class="object-cover h-full w-full rounded-t-lg p-5"
                            src="/no_foto_perro.png"
                            alt=""
                        />
                    {/if}
                </header>
                <div class="flex flex-col justify-start p-6">
                    <h5
                        class="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-50"
                    >
                        {perro.nombre}
                    </h5>
                    <div
                        class="mb-4 text-base text-neutral-600 dark:text-neutral-200"
                    >
                        <p>
                            <span class="font-medium">Raza: </span>
                            {perro.raza}
                        </p>
                        <p>
                            <span class="font-medium">Sexo: </span>
                            {perro.sexo}
                        </p>
                        <p>
                            <span class="font-medium"
                                >Fecha de nacimiento:
                            </span>
                            {new Date(perro.fechaNacimiento).toLocaleDateString(
                                "es-AR"
                            )}
                        </p>
                        <p>
                            <span class="font-medium">Observaciones: </span>
                            {perro.observaciones}
                        </p>
                        <p>
                            <span class="font-medium"
                                >Peso: {perro.peso} Kg</span
                            >
                        </p>
                        <p>
                            <span class="font-medium">Vacunas aplicadas: </span> <br>
                            {#if perro.vacunas !== "[]"}
                                {#each JSON.parse(perro.vacunas) as vacuna}
                                    {espacio}{vacuna.nombre}.
                                {/each}
                            {:else}
                                No se le aplicaron vacunas.
                            {/if}
                        </p>
                        <p>
                            <span class="font-medium"
                                >Antiparasitarios aplicados:
                            </span> <br>
                            {#if perro.antiparasitarios !== "[]"}
                                {#each JSON.parse(perro.antiparasitarios) as antiparasitario}
                                     -{espacio}{antiparasitario.nombre}, aplicado el {new Date(
                                        antiparasitario.fechaDeAplicacion).toLocaleDateString("es-AR")}, 
                                        cantidad aplicada: {antiparasitario.cantidadAplicada} mg/kg.
                                      <br>   
                                {/each}
                            {:else}
                                No se le aplicaron antiparasitarios.
                            {/if}
                        </p>
                        <p class="font-medium">
                            {#if !perro.castrado}
                                No está
                            {:else}
                                Está
                            {/if}castrad{#if perro.sexo === "Macho"}
                                o.
                            {:else}
                                a.
                            {/if}
                        </p>
                    </div>
                    <footer class="flex">
                        <a
                            class="btn variant-ghost-surface mr-2"
                            rel="noreferrer"
                            href="/mis-perros/editar-perro?nombre={perro.nombre}&owner={perro.owner}"
                            >Editar</a
                            >
                        {#if $user?.rol === "veterinario"}
                            <button
                                on:click={(event) =>
                                    handleMarcarFallecido(perro)}
                                class="btn btn-sm bg-red-500"
                                >Ocultar perro</button
                            >
                        {/if}
                    </footer>
                </div>
            </div>
        {/each}
    </div>
{:else}
    <div class="flex justify-center items-center h-screen">
        <div class="flex-none">
            <h1 class="text-4xl font-bold mb-6">No hay perros cargados.</h1>
            {#if $user?.rol === "cliente"}
                <div class="flex justify-center">
                    <a
                        class="ml-4 btn variant-ghost-secondary hover:variant-filled-secondary"
                        rel="noreferrer"
                        href="/cargar-cliente">Cargar perro</a
                    >
                </div>
            {/if}
        </div>
    </div>
{/if}
