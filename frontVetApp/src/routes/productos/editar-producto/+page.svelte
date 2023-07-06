<script lang="ts">
    import { goto } from "$app/navigation";
    import type { Producto } from "$lib/interfaces/Producto.interface";
    import { user } from "$lib/stores/user";
    import { backendURL} from "$lib/utils/constantFactory";
    import type { ModalSettings } from "@skeletonlabs/skeleton";
    import { Modal, modalStore } from "@skeletonlabs/skeleton";
    import { onMount } from "svelte";

    const idProducto = new URLSearchParams(window.location.search).get("idProducto") || -1;
    let producto:Producto;


    let FotoFile: any; //por ahora ni tiene utilidad
    let submittedClass = "";


    let dniErrorMsj = "";
    let fileErrorMsj = "";
    const productoActualizado: ModalSettings = {
        type: "alert",
        title: "Producto actualizado",
        body: "Producto actualizado correctamente",
        buttonTextCancel: "Ok",
        response: (r: boolean) => goto("/productos"),
    };

    const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Error desconocido",
        body: "No se pudo actualizar el producto",
        buttonTextCancel: "Ok",
    };

    const fallaServidor: ModalSettings = {
        type: "alert",
        title: "Fallo en actualizacion del producto",
        body: "Falla del servidor",
        buttonTextCancel: "Ok",
    };


    const modalConfirmarEliminarFoto: ModalSettings = {
        type: "confirm",
        title: "Confirme su acción",
        body: "¿Está seguro de eliminar su foto? La eliminación se hará efectiva al actualizar su producto",
        buttonTextConfirm: "Si",
        buttonTextCancel: "No",
        response: (confirma: boolean) => {
            if (confirma) {
                producto.foto = "";
                FotoFile = "";
            }
        },
    };

    const eliminarFoto = () => {
        modalStore.clear();
        modalStore.trigger(modalConfirmarEliminarFoto);
    };

    onMount(() => {
        fetch(`${backendURL}/productos/${idProducto}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
            .then((res) => {
                if (res.status < 299) {
                    //si entra acá no hubo error
                    return res.json();
                }
                return Promise.reject(res);
            })
            .then((res) => {
                producto=res.producto;
            })
            .catch((e) => {
                console.log("ERROR:");
                console.log(e);
            });
    });

    const onChangeFile = async (event: Event) => {
        let target = event.target as HTMLInputElement;
        if (!target.files) {
            return;
        }
        let image = target.files[0];
        if (image.size > 5242880) {
            // 5 mb en bytes
            fileErrorMsj = "La imagen debe pesar menos de 5 MB";
            target.value = "";
            return;
        }
        if (image.type !== "image/jpeg" && image.type !== "image/png") {
            fileErrorMsj = "El archivo debe ser una imagen jpg, jpeg o png";
            target.value = "";
            return;
        }
        FotoFile = target.value;
        fileErrorMsj = "";
        let reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = (e) => {
            if (!e.target) {
                return;
            }
            producto.foto = e.target.result as string;
            //console.log(foto);
        };
    };

    const handleCarga = () => {
        fetch(`${backendURL}/productos/${idProducto}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                producto:producto
            }),
        })
            .then((res) => {
                if (res.status < 299) {
                    modalStore.clear();
                    modalStore.trigger(productoActualizado);
                    return res;
                }
                if (res.status === 400) {
                    //error por modificacion del token jwt.
                    $user = null;
                    goto("/auth/login");
                    return;
                }
                if (res.status === 404) {
                    console.log("El usuario no existe...");
                    return res;
                }
                if (res.status === 409) {
                    console.log("Ya hay un usuario con ese dni");
                    dniErrorMsj = "Ya hay un usuario registrado con ese dni";
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
    };
</script>

<Modal />


<div class="container mt-2 mb-10 h-full mx-auto flex justify-center items-center">
    {#if producto}
        
        <form on:submit|preventDefault={handleCarga} class=" {submittedClass}">
            <h1 class="h2">Editando producto:</h1>
            <br>
            <div class="space-y-1 mb-10">
                <p>Nombre: {producto.nombre}</p>

                <p>Marca: {producto.marca}</p>

                <label class="label" for="stock">Stock:</label>
                <input bind:value={producto.stock} class="input focus:invalid:border-red-500" type="number" placeholder="Ingrese stock del producto." name="stock" required/>


                <label class="label" for="precio">Precio:</label>
                <input bind:value={producto.precio} class="input focus:invalid:border-red-500" type="number" max="9999999999" placeholder="Ingrese precio del producto" name="precio" required/>

                <label class="label" for="descripcion">Descripcion:</label>
                <input bind:value={producto.descripcion} class="input focus:invalid:border-red-500" type="text" placeholder="Ingrese descripción del producto" name="descripcion"/>

                <p>Foto de perfil:</p>
                <div>
                    {#if producto.foto}
                        <img class="object-contain h-32 w-32" src={producto.foto} alt="foto del producto"/>
                    {:else}
                        <img class="object-contain h-32 w-32" src="/no_foto_perfil.png" alt=""/>
                    {/if}
                    <button on:click={eliminarFoto} class="btn rounded btn-sm variant-filled-warning" type="button">Eliminar foto</button>
                </div>
                <p class="text-red-500">{fileErrorMsj}</p>

                <input bind:files={FotoFile} type="file" accept="image/png, image/jpeg" on:change={onChangeFile}/>
            </div>

            <a href="/productos"><button class="btn rounded-lg variant-filled-secondary">Cancelar edición</button></a>

            <button class="btn rounded-lg variant-filled-primary" type="submit">Actualizar el producto<button>
        </form>
    {/if}

</div>
