<script lang="ts">
    import { onMount } from "svelte";
    import { user } from "$lib/stores/user";
    import type { Perro } from "$lib/interfaces/Perro.interface";
    import { Modal } from "@skeletonlabs/skeleton";

    let cliente = $user?.email;
    let perros: Perro[] = [];

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
    });
</script>

<Modal />

<h1>Mis perros</h1>

<div class="ml-2 flex flex-wrap">
    {#each perros as perro}
        <div
            class="m-2 grayscale hover:grayscale-0 duration-300 rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] variant-ghost-secondary md:max-w-xl md:flex-row"
        >
            <header>
                <img
                    class="object-cover h-full w-full rounded-t-lg"
                    src="https://i.pinimg.com/originals/ce/80/f5/ce80f5cdff3aa5ec3eb7072348d41075.jpg"
                    alt=""
                />
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
                        {perro.fechaNacimiento}
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
                        <button class="btn btn-sm variant-ghost-surface mr-2"
                            >Editar</button
                        >
                        <button class="btn btn-sm variant-ghost-surface"
                            >Marcar perro como fallecido</button
                        >
                    </footer>
                {/if}
            </div>
        </div>
    {/each}
</div>
<!-- <div
    class="grayscale hover:grayscale-0 duration-300 flex flex-col rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 md:max-w-xl md:flex-row"
>
    <img
        class="h-96 w-full rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
        src="https://i.pinimg.com/originals/ce/80/f5/ce80f5cdff3aa5ec3eb7072348d41075.jpg"
        alt=""
    />
    <div class="flex flex-col justify-start p-6">
        <h5
            class="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-50"
        >
            Card title
        </h5>
        <p class="mb-4 text-base text-neutral-600 dark:text-neutral-200">
            This is a wider card with supporting text below as a natural lead-in
            to additional content. This content is a little bit longer.
        </p>
        <p class="text-xs text-neutral-500 dark:text-neutral-300">
            Last updated 3 mins ago
        </p>
    </div>
</div> -->

<!-- <div>
    <div class="container my-8 mx-3">
        <div class="flex flex-wrap">
            {#each perros as perro}
                <div class="card variant-ghost-secondary p-1 max-w-xs m-2 flex">
                    <img
                        class="w-40 h-40 grayscale hover:grayscale-0 duration-300"
                        src="https://i.pinimg.com/originals/ce/80/f5/ce80f5cdff3aa5ec3eb7072348d41075.jpg"
                        alt="Foto del perro llamado {perro.nombre}"
                    />
                    <div class="info_perro ml">
                        <header class="font-bold">
                            {perro.nombre}
                        </header>
                        <section>
                            <p>Raza: {perro.raza}</p>
                            <p>Sexo: {perro.sexo}</p>
                        </section>
                        <footer>
                            <a
                                class="btn btn-sm variant-ghost-surface"
                                rel="noreferrer"
                                href="/modificar-perro">Modificar perro</a
                            >
                            <button class="btn btn-sm variant-ghost-surface"
                                >Marcar perro como fallecido</button
                            >
                        </footer>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div> -->
