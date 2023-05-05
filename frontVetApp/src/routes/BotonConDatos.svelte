<script lang="ts">
	import { getTestData } from "$lib/dataFetching/dataFetching";
	import type { ApiResponse } from "$lib/interfaces/ApiResponse.interface";

	let datos: ApiResponse<string> = { data: "noData", statusCode: -1 };
	let endpoint: string = "http://localhost:3000/api/mensaje";

	async function getDatos() {
		datos = await getTestData(endpoint);
	}
</script>

<button type="button" class="btn rounded-lg variant-filled" on:click={getDatos}
	>Hacer llamada get</button
>
<h1>Datos: {datos.data}</h1>
<a href="/paseadores-y-cuidadores">Paseadores y Cuidadores</a>
