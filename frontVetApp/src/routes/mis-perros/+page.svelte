<script lang="ts">
    import { onMount } from "svelte";
    import { user } from "$lib/stores/user";
    import type { Perro } from "$lib/interfaces/Perro.interface";
    import { Modal } from "@skeletonlabs/skeleton";

    let cliente = $user?.email;
    let perros: Perro[] = [];
    let imgSrc = "/LogoPerro.png";

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
<a
    class="btn btn-sm variant-ghost-surface"
    rel="noreferrer"
    href="/modificar-perro">Modificar perro</a
>
<button class="btn btn-sm variant-ghost-surface"
    >Marcar perro como fallecido</button
>
<div>
    {#each perros as perro}{/each}
    <div class="card p-4">Basic</div>
</div>
