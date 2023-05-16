<script lang="ts">
    import type { PaseadorCuidador } from "$lib/interfaces/PaseadoresYCuidadores.interface";
    import { onMount } from "svelte";
    import { user } from "$lib/stores/user";
    import { Modal } from "@skeletonlabs/skeleton";
    let paseadorescuidadores: PaseadorCuidador[] = [];

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
    });
</script>

<Modal />

<h1>Paseadores y Cuidadores</h1>
<a
				class="btn variant-ghost-surface"
				rel="noreferrer"
				href="/paseadores-y-cuidadores/cargar-paseadorcuidador">Cargar paseador/cuidador</a>
{#each paseadorescuidadores as tarjeta}
    <div class="card">
        <h2>{tarjeta.nombre}</h2>
    </div>
{/each}
