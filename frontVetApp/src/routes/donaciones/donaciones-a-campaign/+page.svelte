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
    });

    let inputEmail: String;
    let inputFechaDesde: Date;
    let inputFechaHasta: Date;

    $: mostrar = donaciones.filter((donacion) => {
        const nombreMatch = inputEmail
            ? donacion.emailDonante
                  .toLowerCase()
                  .match(`.*${inputEmail.toLowerCase()}.*`)
            : true;
        let fechaDonacionDesde = new Date(donacion.fechaHora);
        fechaDonacionDesde.setHours(0,0,0,0);
        const fechaDesdeMatch = inputFechaDesde
            ? fechaDonacionDesde >= new Date(inputFechaDesde + "T00:00:00-03:00")
            : true;
        let fechaDonacionHasta = new Date(donacion.fechaHora);
        fechaDonacionHasta.setHours(0,0,0,0);
        const fechaHastaMatch = inputFechaHasta
            ? fechaDonacionHasta <= new Date(inputFechaHasta + "T00:00:00-03:00")
            : true;
        console.log(fechaDonacionDesde.toLocaleDateString());
        console.log(new Date(inputFechaDesde + "T00:00:00-03:00").toLocaleDateString());
        console.log(fechaDesdeMatch);
        return nombreMatch && fechaDesdeMatch && fechaHastaMatch;
    }) as Donacion[];
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
    <div class="ml-2 flex">
        <div class="ml-2">
            <label for="filtroNombre" class="text-left whitespace-nowrap"
                >Filtrar por nombre:
            </label>
            <input
                type="text"
                bind:value={inputEmail}
                class="input rounded-lg"
                name="filtroNombre"
                id=""
            />
        </div>
        <div class="ml-2">
            <label for="filtroFechaDesde" class="text-left whitespace-nowrap"
                >Filtrar por fecha (desde):
            </label>
            <input
                bind:value={inputFechaDesde}
                class="input"
                type="date"
                placeholder="Desde"
                name="filtroFechaDesde"
            />
        </div>
        <div class="ml-2">
            <label for="filtroFechaHasta" class="text-left whitespace-nowrap"
                >Filtrar por fecha (hasta):
            </label>
            <input
                bind:value={inputFechaHasta}
                class="input"
                type="date"
                placeholder="Hasta"
                name="filtroFechaHasta"
            />
        </div>
    </div>
    <div class="ml-2 flex flex-wrap">
        {#each mostrar as donacion}
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
        <h1 class="text-4xl font-bold">No hay donaciones registradas.</h1>
    </div>
{/if}
