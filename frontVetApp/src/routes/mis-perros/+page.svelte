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
        mostrar = perros.filter((perro) => !perro.fallecido);
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
</script>

<Modal />

<h1>Mis perros</h1>

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
                        <span class="font-medium">Fecha de nacimiento: </span>
                        {new Date(perro.fechaNacimiento).toJSON().slice(0, 10)}
                    </p>
                    <p>
                        <span class="font-medium">Observaciones: </span>
                    </p>
                    <p>
                        <span class="font-medium">Peso: COMPLETAR</span>
                    </p>
                    <p>
                        <span class="font-medium"
                            >Vacunas aplicadas: COMPLETAR</span
                        >
                    </p>
                </div>
                {#if $user?.rol === "veterinario"}
                    <footer class="flex">
                        <a
                            class="btn variant-ghost-surface mr-2"
                            rel="noreferrer"
                            href="/mis-perros/editar-perro?nombre={perro.nombre}&owner={perro.owner}"
                            >Editar</a
                        >
                        <button
                            on:click={(event) => handleMarcarFallecido(perro)}
                            class="btn btn-sm bg-red-500"
                            >Marcar perro como fallecido</button
                        >
                    </footer>
                {/if}
            </div>
        </div>
    {/each}
</div>
