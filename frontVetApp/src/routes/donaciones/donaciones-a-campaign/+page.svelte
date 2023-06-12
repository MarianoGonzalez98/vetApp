<script lang="ts">
    import type {
        Donacion,
        PaymentID,
    } from "$lib/interfaces/Donaciones.interface";
    import { backendURL } from "$lib/utils/constantFactory";
    import { onMount } from "svelte";

    let campaign: string =
        new URLSearchParams(window.location.search).get("campaign") ?? "";

    let donaciones: Donacion[] = [];

    onMount(async () => {
        await fetch(
            `${backendURL}/donaciones/donaciones-a-campaign?campaign=${campaign}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        )
            .then((res) => res.json())
            .then((apiResponse) => (donaciones = apiResponse.donaciones));

        console.log(donaciones);
    });
</script>

<div class="flex flex-wrap mb-4">
    <a class="btn variant-filled m-4 mb-0" rel="noreferrer" href="/donaciones/"
        >Atras</a
    >
    <h1 class="h1 font-medium mt-4">
        Donaciones realizadas a la campaña {campaign}
    </h1>
</div>

{#if donaciones.length > 0}
    <div class="ml-2 flex flex-wrap">
        {#each donaciones as donacion}
            <div
                class="card grayscale hover:grayscale-0 duration-300 variant-ghost-secondary p-1 max-w-xs m-2"
            >
                <section class="p-4">
                    <p>
                        <span class="font-medium"
                            >Email del donante:
                        </span>{donacion.emailDonante}
                    </p>
                    <p>
                        <span class="font-medium"
                            >Fecha y hora:
                        </span>{new Date(donacion.fechaHora).toLocaleDateString(
                            "es-AR"
                        )}
                        {new Date(donacion.fechaHora).toLocaleTimeString(
                            "es-AR",
                            {
                                timeStyle: "short",
                            }
                        )}
                    </p>
                    <p>
                        <span class="font-medium"
                            >Monto neto donado:
                        </span>${donacion.monto}
                    </p>
                </section>
            </div>
        {/each}
    </div>
{:else}
    <div class="flex justify-center items-center h-full">
        <h1 class="text-4xl font-bold">
            No hay donaciones registradas.
        </h1>
    </div>
{/if}
