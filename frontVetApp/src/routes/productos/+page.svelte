<script lang="ts">
    import type { Producto } from "$lib/interfaces/Producto.interface";
    import { user } from "$lib/stores/user";
    import { backendURL } from "$lib/utils/constantFactory";
    import { onMount } from "svelte";
    import Carrito from "./carrito.svelte";
    import { productosCarrito } from "$lib/stores/carrito";
    import type { ItemCarrito } from "$lib/interfaces/Carrito.interface";

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

    const handleIncrementar = (prod:Producto) => {
        let productoDelCarrito = $productosCarrito.find( p => p.nombre===prod.nombre);
        if (!productoDelCarrito){ //si no se encuentra ya cargado
            let prodAgregado:ItemCarrito = {nombre:prod.nombre,cant:1};
            console.log('entra');
            $productosCarrito.push(prodAgregado);
        }
        else if(productoDelCarrito.cant<prod.stock){
            productoDelCarrito.cant++;
        }
        $productosCarrito = $productosCarrito;
    }

    const handleDecrementar = (prod:(ItemCarrito| undefined)) => {
        if ((!prod) || (prod.cant===0)){
            return;
        }
        if (prod.cant===1){
            $productosCarrito = $productosCarrito.filter(p => p.nombre !== prod.nombre);
        }else{
            prod.cant--;
            $productosCarrito = $productosCarrito;
        }
    }
</script>

<div class="w-full ">
    <a class="btn variant-filled m-4 mb-0" rel="noreferrer" href="/">Atras</a>
    {#if ($user?.rol === 'veterinario')}
    <a href="/productos/cargar-producto"><button class="btn rounded-lg variant-filled-secondary mt-5">Cargar nuevo producto</button></a>
    {/if}
</div>
<div class="container my-8 mx-auto ">
    <h1 class="h1 ml-15 mt-10">Productos: </h1>
    <div class="flex flex-wrap  ">
        {#each productos.filter( (prod) => {
            return (prod)
        }) as prod}
            {@const prodCarrito = $productosCarrito.find( p => p.nombre === prod.nombre)}
            <div class="card  variant-ghost-secondary p-1 max-w-xs m-2 ">
                <header class="card-header">Nombre: {prod.nombre}</header>
                <section class="p-2">
                    <p>Stock: {prod.stock}</p>
                    <p>Precio:{prod.precio}</p>
                    <p>Marca: {prod.marca}</p>
                    <p>Descripción: {prod.descripcion}</p>
                </section>
                <footer class="card-footer">
                    {#if $user?.rol!=='veterinario'}    
                        <p>Cantidad pedida: </p>
                        <div class="custom-number-input h-10 w-32">
                            <div class="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                                <button on:click={(event) => handleDecrementar(prodCarrito)} data-action="decrement" class=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none">
                                    <span class="m-auto text-2xl font-thin">−</span>
                                </button>

                                <input type="number" disabled class="outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none" name="custom-input-number" value="{$productosCarrito.find( p => p.nombre === prod.nombre)?.cant || 0}">
                                
                                <button on:click={(event) => handleIncrementar(prod)} data-action="increment" class="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer">
                                    <span class="m-auto text-2xl font-thin">+</span>
                                </button>
                            </div>
                        </div>
                    {/if}
                </footer>
            </div>
        {/each}
    </div>
    {#if $user?.rol!=='veterinario'}        
        <h1 class="h1 ml-15">Carrito de compras: </h1>
        <Carrito></Carrito>
    {/if}
</div>