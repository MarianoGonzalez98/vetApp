<script lang="ts">
    import type { Producto } from "$lib/interfaces/Producto.interface";
    import { user } from "$lib/stores/user";
    import { backendURL } from "$lib/utils/constantFactory";
    import { onMount } from "svelte";
    import { productosCarrito } from "$lib/stores/carrito";
    import type { ItemCarrito } from "$lib/interfaces/Carrito.interface";
    import ModalConfirmarEliminarProducto from "./ModalConfirmarEliminarProducto.svelte";
    import { modalStore, type ModalSettings, Modal } from "@skeletonlabs/skeleton";

    let productos:Producto[] = [];

    onMount( async ()  => {
        await loadProductos();
    });

    const loadProductos = async () => {
        console.log("loadProductos: se cargaron productos")
        await fetch(`${backendURL}/productos`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            })
        .then((res) => res.json())
        .then((apiResponse) => (productos = apiResponse.productos));
    }

    const handleIncrementar = (prod:Producto) => {
        if ((!prod) || (prod.stock==0)){
            return;
        }
        let productoDelCarrito = $productosCarrito.find( p => p.idProducto===prod.id);
        if (!productoDelCarrito){ //si no se encuentra ya cargado
            let prodAgregado:ItemCarrito = {
                idProducto:prod.id,
                cant:1,
                nombre:prod.nombre,
                marca:prod.marca,
                precioUnitario:prod.precio,
            };
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
            $productosCarrito = $productosCarrito.filter(p => p.idProducto !== prod.idProducto);
        }else{
            prod.cant--;
            $productosCarrito = $productosCarrito;
        }
    }

    const handleEliminar = (prod:Producto) => {
        let modalComponent = {
            ref: ModalConfirmarEliminarProducto,
            props: {
                prod: prod,
            },
        };

        let modalConfirm: ModalSettings = {
            //esto sí lo uso
            type: "component",
            // Pass the component directly:
            component: modalComponent,
            response: (confirmo: any) => {
                if (confirmo) {
                    
                }
            },
        };
        modalStore.clear();
        modalStore.trigger(modalConfirm);
    }
</script>

<Modal/>
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
            {@const prodCarrito = $productosCarrito.find( p => p.idProducto === prod.id)}
            <div class="card  variant-ghost-secondary p-1 max-w-xs m-2 ">
                <header class="card-header">Nombre: {prod.nombre}</header>
                <section class="p-2">
                    <p>Stock: {prod.stock}</p>
                    <p>Precio:{prod.precio}</p>
                    <p>Marca: {prod.marca}</p>
                    <p>Descripción: {prod.descripcion}</p>
                </section>
                <footer class="card-footer">
                    {#if Number(prod.stock)>0}
                        {#if $user?.rol!=='veterinario'}    
                            <p>Cantidad pedida: </p>
                            <div class="custom-number-input h-10 w-32">
                                <div class="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                                    {#if prodCarrito && prodCarrito.cant>0}
                                    <button on:click={(event) => handleDecrementar(prodCarrito)} data-action="decrement" class=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none">
                                        <span class="m-auto text-2xl font-thin">−</span>
                                    </button>
                                    {/if}
                                    
                                    <input type="number" disabled class="outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none" name="custom-input-number" value="{$productosCarrito.find( p => p.idProducto === prod.id)?.cant || 0}">
                                    {#if !prodCarrito || (prodCarrito && prodCarrito.cant<prod.stock)}
                                    <button on:click={(event) => handleIncrementar(prod)} data-action="increment" class="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer">
                                        <span class="m-auto text-2xl font-thin">+</span>
                                    </button>
                                    {/if}
                                    
                                </div>
                            </div>
                        {/if}
                    {:else}
                        <p>No hay stock</p>
                    {/if}
                    <div>
                        {#if prod.foto}
                            <img class="object-contain h-32 w-32" src="{prod.foto}" alt="foto de perfil" />
                        {:else}
                            <img class="object-contain h-32 w-32" src="/no_foto_perfil.png" alt="" />  <!-- guardar en static!! -->
                        {/if}
                    </div>
                    {#if ($user?.rol ==='veterinario')}
                        <div>
                            <a href= "/productos/editar-producto?idProducto={prod.id}">
                                <button class="btn btn-sm variant-ghost-surface mr-2">Editar producto</button>
                            </a>
                            <button on:click={(event) => handleEliminar(prod)} class="btn btn-sm variant-filled-warning mr-2">Eliminar producto</button>
                        </div>
                    {/if}
                </footer>
            </div>
        {/each}
    </div>
    {#if $user?.rol!=='veterinario'}        
        <a class="btn variant-filled m-4 mb-0" rel="noreferrer" href="/productos/carrito-de-compras">Ver mi carrito de compras</a>
    {/if}
</div>