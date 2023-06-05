<script lang="ts">
    import { goto } from "$app/navigation";
    import { user } from "$lib/stores/user";
    import { backendURL } from "$lib/utils/constantFactory";
    import {
        popup,
        type ModalSettings,
        type PopupSettings,
    } from "@skeletonlabs/skeleton";
    import { Modal, modalStore } from "@skeletonlabs/skeleton";
    import { error } from "@sveltejs/kit";
    import { onMount } from "svelte";

    let nombre = "";
    let apellido = "";
    let dni = "";
    let direccion = "";
    let telefono = "";
    let fechaNacimiento: string; //
    let foto: any;

    let FotoFile: any; //por ahora ni tiene utilidad
    let submittedClass = "";
    let fechaMax: string = new Date().toJSON().slice(0, 10);

    const letrasEspaciosPattern: string =
        "^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ]+$";

    const numbersPattern: string = "^[0-9]*$";
    let dniErrorMsj = "";
    let fileErrorMsj = "";
    const clienteCargado: ModalSettings = {
        type: "alert",
        title: "Perfil actualizado",
        body: "Perfil actualizado correctamente",
        buttonTextCancel: "Ok",
        response: (r: boolean) => goto("/auth/mi-perfil"),
    };

    const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Error desconocido",
        body: "No se pudo actualizar el perfil",
        buttonTextCancel: "Ok",
    };

    const fallaServidor: ModalSettings = {
        type: "alert",
        title: "Fallo en actualizacion del perfil",
        body: "Falla del servidor",
        buttonTextCancel: "Ok",
    };

    const popupFocusBlur: PopupSettings = {
        event: "focus-blur",
        target: "popupFocusBlur",
        placement: "top",
    };

    const modalConfirmarEliminarFoto: ModalSettings = {
        type: "confirm",
        title: "Confirme su acción",
        body: "¿Está seguro de eliminar su foto? La eliminación se hará efectiva al actualizar su perfil",
        buttonTextConfirm: "Si",
        buttonTextCancel: "No",
        response: (confirma: boolean) => {
            if (confirma) {
                foto = "";
                FotoFile = "";
            }
        },
    };

    const eliminarFoto = () => {
        modalStore.clear();
        modalStore.trigger(modalConfirmarEliminarFoto);
    };

    onMount(() => {
        fetch(`${backendURL}/getPerfil`, {
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
                nombre = res.nombre;
                apellido = res.apellido;
                dni = res.dni;
                direccion = res.direccion;
                telefono = res.telefono;
                fechaNacimiento = res.fechaNacimiento.slice(0, 10); //despues capaz tenga que cambiar el formato??
                foto = res.foto;
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
            foto = e.target.result;
            //console.log(foto);
        };
    };

    const handleCarga = () => {
        dniErrorMsj = "";
        fetch(`${backendURL}/updatePerfil`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                nombre,
                apellido,
                dni,
                direccion,
                telefono,
                fechaNacimiento,
                foto: foto,
            }),
        })
            .then((res) => {
                if (res.status < 299) {
                    modalStore.clear();
                    modalStore.trigger(clienteCargado);
                    if ($user) {
                        $user.foto = foto;
                    }
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

<div
    class="container mt-2 mb-10 h-full mx-auto flex justify-center items-center"
>
    <form on:submit|preventDefault={handleCarga} class=" {submittedClass}">
        <div class="space-y-1 mb-10">
            <label class="label" for="nombre">Nombre:</label>
            <input
                bind:value={nombre}
                class="input focus:invalid:border-red-500"
                type="text"
                placeholder="Ingrese su nombre"
                name="nombre"
                pattern={letrasEspaciosPattern}
                required
            />

            <label class="label" for="apellido">Apellido:</label>
            <input
                bind:value={apellido}
                class="input focus:invalid:border-red-500"
                type="text"
                placeholder="Ingrese su apellido"
                name="apellido"
                pattern={letrasEspaciosPattern}
                required
            />

            <label class="label" for="dni">Teléfono:</label>
            <input
                bind:value={telefono}
                class="input focus:invalid:border-red-500"
                type="text"
                placeholder="Ingrese teléfono del cliente. Ej: 2214687634"
                use:popup={popupFocusBlur}
                name="telefono"
                pattern={numbersPattern}
                required
            />

            <div class="card p-4 variant-filled" data-popup="popupFocusBlur">
                <p>Sólo números</p>
                <div class="arrow variant-filled" />
            </div>

            <label class="label" for="dni">DNI:</label>
            <input
                bind:value={dni}
                class="input focus:invalid:border-red-500"
                type="text"
                max="9999999999"
                placeholder="Ingrese dni del cliente"
                name="dni"
                autocomplete="off"
                pattern={numbersPattern}
                required
            />
            <p class="text-red-500">{dniErrorMsj}</p>
            <label class="label" for="fechaNacimiento"
                >Fecha de nacimiento:</label
            >
            <input
                bind:value={fechaNacimiento}
                class="input"
                type="date"
                placeholder="Ingrese fecha de nacimiento del cliente"
                name="fechaNacimiento"
                max={fechaMax}
                required
            />

            <label class="label" for="direccion">Dirección:</label>
            <input
                bind:value={direccion}
                class="input focus:invalid:border-red-500"
                type="text"
                placeholder="Ingrese dirección del cliente"
                name="direccion"
                required
            />

            <p>Foto de perfil:</p>
            <div>
                {#if foto}
                    <img
                        class="object-contain h-32 w-32"
                        src={foto}
                        alt="foto de perfil"
                    />
                {:else}
                    <img
                        class="object-contain h-32 w-32"
                        src="/no_foto_perfil.png"
                        alt=""
                    />
                {/if}
                <button
                    on:click={eliminarFoto}
                    class="btn rounded btn-sm variant-filled-warning"
                    type="button">Eliminar foto</button
                >
            </div>
            <p class="text-red-500">{fileErrorMsj}</p>

            <input
                bind:files={FotoFile}
                type="file"
                accept="image/png, image/jpeg"
                on:change={onChangeFile}
            />
        </div>

        <a href="/auth/mi-perfil/"
            ><button class="btn rounded-lg variant-filled-secondary"
                >Cancelar edición</button
            ></a
        >

        <button class="btn rounded-lg variant-filled-primary" type="submit"
            >Actualizar mi perfil</button
        >
    </form>
</div>
