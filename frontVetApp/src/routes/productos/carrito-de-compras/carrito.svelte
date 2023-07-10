
<script lang="ts">
    import type { ItemCarrito } from "$lib/interfaces/Carrito.interface";
    import { productosCarrito } from "$lib/stores/carrito";
    import { Modal, modalStore, type ModalSettings } from "@skeletonlabs/skeleton";
    import ModalCompraProducto from "./ModalCompraProducto.svelte";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    const handleEliminarDelCarrito = (prod:ItemCarrito) =>{
        $productosCarrito = $productosCarrito.filter( p => p.idProducto!== prod.idProducto);
    }

    const dispatchEvent = () => {
        dispatch('reloadProducts', {
				text: 'Hello!'
			});
    }

    const handleGenerarCompra = ()=> {
        let modalComponent = {
            ref: ModalCompraProducto,
            props: {
                itemsCarrito: $productosCarrito,
                //dispatchEvent:dispatchEvent,
            },
        };
        console.log("generando compra")
        const modalCompra: ModalSettings = {
            type: "component",
            component: modalComponent,
            response: (r: any) => console.log("response:", r),
        };
        modalStore.clear();
        modalStore.trigger(modalCompra);
    }
</script>

<Modal/>
<div class="flex flex-wrap  ">
    {#each $productosCarrito as prod}
        <div class="card  variant-ghost-secondary p-1 max-w-xs m-2 ">
            <header class="card-header">
                <p>Nombre: {prod.nombre}</p>
                <p>Marca: {prod.marca}</p>
            </header>
            <section class="p-2">
                <p>Cantidad: {prod.cant}</p>
                <p>Precio unitario: {prod.precioUnitario}</p>
                <p>Precio total: {prod.precioUnitario * prod.cant}</p>
            </section>
            <footer class="card-footer">
                <button on:click={(event) => handleEliminarDelCarrito(prod)} class="btn rounded-sm variant-filled-secondary block mt-2" >Eliminar</button>
            </footer>
        </div>
    {/each}
</div>
{#if $productosCarrito.length>0}
    <h3 class="h3 mb-5">
        Monto total: {$productosCarrito
                        .reduce((partialSum, a) => partialSum + (a.precioUnitario * a.cant), 0)}
    </h3>
    <button on:click={(event) => handleGenerarCompra()} class="btn btn-sm variant-ghost-surface mr-2">Pagar compra</button>
{:else}
    <h3 class="h3 mt-5">Su carrito de compras está vacio</h3>
{/if}
