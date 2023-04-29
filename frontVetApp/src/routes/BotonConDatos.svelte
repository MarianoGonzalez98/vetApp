<script lang="ts">
  import { getTestData } from "$lib/dataFetching/dataFetching";
	import type { ApiResponse } from "$lib/interfaces/ApiResponse.interface";

  let datos:ApiResponse = {data:"noData",statusCode:-1};

  async function getDatos(){
		datos = await getTestData('http://localhost:3000/api/mensaje');
	}

</script>

<button type="button" class="btn rounded-lg variant-filled" on:click={getDatos}>Hacer llamada get</button>  
<h1>Datos: {datos.data}</h1>