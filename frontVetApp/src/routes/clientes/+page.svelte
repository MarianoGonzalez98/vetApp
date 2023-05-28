<script lang="ts">
    import type {
        Cliente,
        ExtrasCliente,
    } from "$lib/interfaces/Cliente.interface";
    import { onMount } from "svelte";

    let clientes: (Cliente & ExtrasCliente)[] = [];
    let inputNombre: string;
    let inputEmail: string;
    let inputDni: string;

    onMount(async () => {
        const res = await fetch("http://localhost:3000/listar-clientes", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
            .then((res) => res.json())
            .then((res) => {
                clientes = res.clientes;
            });
    });

    $: mostrar = clientes.filter((cliente) => {
        const nombreMatch = inputNombre
            ? cliente.nombre
                  .toLowerCase()
                  .concat(" " + cliente.apellido.toLowerCase())
                  .match(`.*${inputNombre.toLowerCase()}.*`)
            : true;
        const emailMatch = inputEmail
            ? cliente.email
                  .toLowerCase()
                  .match(`.*${inputEmail.toLowerCase()}.*`)
            : true;
        const dniMatch = inputDni
            ? cliente.dni.toLowerCase().match(`.*${inputDni.toLowerCase()}.*`)
            : true;
        return nombreMatch && emailMatch && dniMatch;
    });
</script>

<h1 class="h1 m-4 font-medium">Clientes</h1>
{#if clientes.length > 0}
    <div class="flex">
        <div class="mt-6">
            <a
                class="ml-4 btn variant-ghost-secondary hover:variant-filled-secondary"
                rel="noreferrer"
                href="/cargar-cliente">Cargar cliente</a
            >
        </div>
        <div class="ml-2">
            <label for="filtroNombre" class="text-left whitespace-nowrap"
                >Filtrar por nombre:
            </label>
            <input
                type="text"
                bind:value={inputNombre}
                class="input"
                name="filtroNombre"
                id=""
            />
        </div>
        <div class="ml-2">
            <label for="filtroEmail" class="text-left whitespace-nowrap"
                >Filtrar por email:
            </label>
            <input
                type="text"
                bind:value={inputEmail}
                class="input"
                name="filtroEmail"
                id=""
            />
        </div>
        <div class="ml-2">
            <label for="filtroDni" class="text-left whitespace-nowrap"
                >Filtrar por DNI:
            </label>
            <input
                type="text"
                bind:value={inputDni}
                class="input"
                name="filtroDni"
                id=""
            />
        </div>
    </div>
    <div class="ml-2 flex flex-wrap">
        {#each mostrar as cliente}
            <div
                class="m-2 grayscale hover:grayscale-0 duration-300 rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] variant-ghost-secondary md:max-w-xl md:flex-row"
            >
                <div class="flex flex-col justify-start p-6">
                    <h5
                        class="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-50"
                    >
                        {cliente.nombre}
                        {cliente.apellido}
                    </h5>
                    <div
                        class="text-base text-neutral-600 dark:text-neutral-200"
                    >
                        <p>
                            <span class="font-medium">Email: </span>
                            {cliente.email}
                        </p>
                        <p>
                            <span class="font-medium">DNI: </span>
                            {cliente.dni}
                        </p>
                        <p>
                            <span class="font-medium"
                                >Fecha de nacimiento:
                            </span>
                            {new Date(cliente.fechaNacimiento)
                                .toJSON()
                                .slice(0, 10)}
                        </p>
                        <p>
                            <span class="font-medium">Dirección: </span>
                            {cliente.direccion}
                        </p>
                        <p>
                            <span class="font-medium">Teléfono: </span>
                            {cliente.telefono}
                        </p>
                    </div>
                    <footer class="flex mt-4">
                        <a
                            class="btn variant-ghost-surface"
                            rel="noreferrer"
                            href="/mis-perros?cliente={cliente.email}"
                            >Ver perros</a
                        >
                    </footer>
                </div>
            </div>
        {/each}
    </div>
{:else}
    <div class="flex justify-center items-center h-screen">
        <div class="flex-none">
            <h1 class="text-4xl font-bold mb-6">No hay clientes cargados.</h1>
            <div class="flex justify-center">
                <a
                    class="ml-4 btn variant-ghost-secondary hover:variant-filled-secondary"
                    rel="noreferrer"
                    href="/cargar-cliente">Cargar cliente</a
                >
            </div>
        </div>
    </div>
{/if}
