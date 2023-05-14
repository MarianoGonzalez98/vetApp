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

{#each perros as perro}
    <div class="w-full text-token grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Detailed -->
        <a class="card card-hover overflow-hidden" href="/elements/cards">
            <header>
                <img
                    src="https://i.pinimg.com/originals/ce/80/f5/ce80f5cdff3aa5ec3eb7072348d41075.jpg"
                    class="bg-black/50 object-cover aspect-[21/9] grayscale hover:grayscale-0 duration-300"
                    alt="Post"
                />
            </header>
            <div class="p-4 space-y-4">
                <h3 class="h2 font-bold">{perro.nombre}</h3>
                <article>
                    <p>Raza: {perro.raza}</p>
                    <p>Sexo: {perro.sexo}</p>
                </article>
            </div>
            <footer class="p-4 flex justify-start items-center space-x-4">
                <div class="flex-auto flex justify-between items-center">
                    <h6 class="font-bold">By Alex</h6>
                    <small>On {new Date().toLocaleDateString()}</small>
                </div>
            </footer>
        </a>
    </div>
{/each}

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
