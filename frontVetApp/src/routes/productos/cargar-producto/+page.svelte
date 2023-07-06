<script lang="ts">
    import { goto } from "$app/navigation";
    import type { Producto } from "$lib/interfaces/Producto.interface";
    import { user } from "$lib/stores/user";
    import { backendURL } from "$lib/utils/constantFactory";
    import { Modal, modalStore } from "@skeletonlabs/skeleton";
    import { fallaDesconocida, fallaServidor, productoCargado } from "./modals";


    
    let producto = {
        nombre: '',
        precio:'',
        stock:'',
        descripcion:'',
        marca:'',
        foto:'',
    }
    let errorMsj:string='';

    
    const handleCarga = async () => {
        errorMsj='';
        fetch(`${backendURL}/productos/crear-producto`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                producto:producto,
            }),
        })
            .then((res) => {
                if (res.status < 299) {
                    modalStore.clear();
                    modalStore.trigger(productoCargado);
                    return res;
                }
                if (res.status === 400) {
                    //error por modificacion del token jwt.
                    $user = null;
                    goto('/auth/login');
                    return;
                }
                if (res.status ===  409) {
                    console.log("Producto ya existente");
                    errorMsj='Error: hay un producto cargado con ese nombre y marca';
                    return res;
                }
                if (res.status === 500) {
                    modalStore.clear();
                    modalStore.trigger(fallaServidor);
                    return res;
                }
            })
            .catch((error) => {
                modalStore.clear();
                modalStore.trigger(fallaDesconocida);
                console.log("Error desconocido: ", error);
            });
    }

</script>

<Modal></Modal>
<a class="btn variant-filled m-4 mb-0" rel="noreferrer" href="/productos">Atras</a>
<div class="container mt-2 mb-10 h-full mx-auto flex justify-center items-center">
    <div class="w-6/12">
        <h3 class="h3 mt-3">Datos del nuevo producto:</h3>
        <form class="space-y-2 mt-5 mb-5 max-w-md" on:submit|preventDefault={handleCarga} action="">
            <label class="label" for="nombre">Nombre:</label>
            <input bind:value={producto.nombre} class="input focus:invalid:border-red-500" type="text" placeholder="Nombre del producto" name="nombre" required/>
            <p class="text-red-500">{errorMsj}</p>
            <label class="label" for="marca">Marca:</label>
            <input bind:value={producto.marca} class="input focus:invalid:border-red-500"type="text" placeholder="Marca del producto" name="marca" required/>
            <label class="label" for="stock">Stock:</label>
            <input bind:value={producto.stock} class="input focus:invalid:border-red-500" type="number" placeholder="Stock del producto" name="stock" required />

            <label class="label" for="precio">Precio:</label>
            <input bind:value={producto.precio} class="input focus:invalid:border-red-500" type="number" placeholder="Precio del producto" name="precio" required />


            <label class="label" for="descripcion">Descripcion:</label>
            <input bind:value={producto.descripcion} class="input focus:invalid:border-red-500"type="text" placeholder="Descripcion del producto" name="descripcion"/>

            <hr class="!border-t-2" />
            <div></div> <!-- para mas espacio con el último elemento(horrible, ya se) -->
            <button class="btn rounded-lg variant-filled-primary mt-5" type="submit">Cargar producto</button>
        </form>
    </div>
</div>