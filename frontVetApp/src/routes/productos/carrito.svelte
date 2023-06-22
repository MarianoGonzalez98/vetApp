
<script lang="ts">
    import type { ItemCarrito } from "$lib/interfaces/Carrito.interface";
    import { productosCarrito } from "$lib/stores/carrito";

    
    const handleEliminarDelCarrito = (prod:ItemCarrito) =>{
        $productosCarrito = $productosCarrito.filter( p => p.nombre!== prod.nombre);
    }
</script>

<div class="flex flex-wrap  ">
    {#each $productosCarrito as prod}
        <div class="card  variant-ghost-secondary p-1 max-w-xs m-2 ">
            <header class="card-header">Nombre: {prod.nombre}</header>
            <section class="p-2">
                <p>Cantidad: {prod.cant}</p>
            </section>
            <footer class="card-footer">
                <button on:click={(event) => handleEliminarDelCarrito(prod)} class="btn rounded-sm variant-filled-secondary block mt-2" >Eliminar</button>
            </footer>
        </div>
    {/each}
</div>
