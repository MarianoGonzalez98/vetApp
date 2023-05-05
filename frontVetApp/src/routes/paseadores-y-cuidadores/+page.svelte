<script lang="ts">
    import { getPaseadoresData } from "$lib/dataFetching/dataFetching";
    import type { ApiResponse } from "$lib/interfaces/ApiResponse.interface";
    import type { PaseadorCuidador } from "$lib/interfaces/PaseadoresYCuidadores.interface";

    let datos: ApiResponse<PaseadorCuidador[]> = { data: [], statusCode: -1 };
    let endpoint: string = "http://localhost:3000/api/paseadoresycuidadores";

    async function getDatos() {
        datos = await getPaseadoresData(endpoint);
    }
    getDatos();
</script>

<h1>Paseadores y Cuidadores</h1>
{#each datos.data as tarjeta}
    <div class="card">
        <h2>{tarjeta.nombre}</h2>
    </div>
{/each}
