<script lang="ts">
    import type { Producto } from "$lib/interfaces/Producto.interface";
    import { user } from "$lib/stores/user";
    import { backendURL } from "$lib/utils/constantFactory";
    import { onMount } from "svelte";

    let productos:Producto[] = [];

    onMount( async ()  => {
        await fetch(`${backendURL}/productos`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            })
        .then((res) => res.json())
        .then((apiResponse) => (productos = apiResponse.productos));

    });

</script>

{#if ($user?.rol === 'veterinario')}
<div class="w-full ">
    <a class="btn variant-filled m-4 mb-0" rel="noreferrer" href="/">Atras</a>
    <a href="/productos/cargar-producto"><button class="btn rounded-lg variant-filled-secondary mt-5">Cargar nuevo producto</button></a>
</div>
{/if}
<div class="container my-8 mx-auto ">
    <h1 class="h1 ml-15">Productos: </h1>
    <div class="flex flex-wrap  ">
        {#each productos.filter( (prod) => {
            return (prod)
        }) as prod}
            <div class="card  variant-ghost-secondary p-1 max-w-xs m-2 ">
                <header class="card-header">Nombre: {prod.nombre}</header>
                <section class="p-2">
                    <p>Stock: {prod.stock}</p>
                    <p>Precio:{prod.precio}</p>
                    <p>Marca: {prod.marca}</p>
                    <p>Descripción: {prod.descripcion}</p>
                </section>
                <footer class="card-footer">
                </footer>
            </div>
        {/each}
    </div>
</div>