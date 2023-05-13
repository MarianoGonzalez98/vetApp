<script lang="ts">
    import { goto } from "$app/navigation";
    import { user } from "$lib/stores/user";
    import {
        popup,
        type ModalSettings,
        type PopupSettings,
    } from "@skeletonlabs/skeleton";
    import { Modal, modalStore } from "@skeletonlabs/skeleton";
    import { onMount } from "svelte";
    import { FileDropzone } from '@skeletonlabs/skeleton';

    let submittedClass = "";
    const emailPattern: string =
        "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,}$";
    const letrasEspaciosPattern: string =
        "^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ]+$";

    const numbersPattern: string = "^[0-9]*$";
    let emailErrorMsj = "";

    const clienteCargado: ModalSettings = {
        type: "alert",
        title: "Cliente cargado",
        body: "Cliente registrado correctamente",
        buttonTextCancel: "Ok",
        response: (r: boolean) => goto("/"),
    };

    const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Error desconocido",
        body: "No se pudo registrar el nuevo cliente",
        buttonTextCancel: "Ok",
    };

    const fallaServidor: ModalSettings = {
        type: "alert",
        title: "Fallo de la carga del cliente",
        body: "Falla del servidor",
        buttonTextCancel: "Ok",
    };

    const popupFocusBlur: PopupSettings = {
        event: "focus-blur",
        target: "popupFocusBlur",
        placement: "top",
    };

    let nombre = "";
    let apellido = "";
    let email = "";
    let dni = "";
    let direccion = "";
    let telefono = "";
    let fechaNacimiento: string; //
    let fechaMax: string = new Date().toJSON().slice(0, 10);
    let FotoFile: FileList; //por ahora ni tiene utilidad

    let avatar:any;

// then in the function
    const onChangeFile = async (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (!target.files){
            return
        }
        let image = target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = e => {
            if (!e.target){
                return
            }
            avatar = e.target.result
            console.log(avatar);
        };
    }

    const handleCarga = () => {
        fetch("http://localhost:3000/registrar-cliente", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                nombre,
                apellido,
                email,
                dni,
                direccion,
                telefono,
                fechaNacimiento,
                foto: null,
            }),
        })
            .then((res) => {
                if (res.status < 299) {
                    modalStore.clear();
                    modalStore.trigger(clienteCargado);
                    return res;
                }
                if (res.status === 400) {
                    //error por modificacion del token jwt.
                    $user = null;
                    goto("/auth/login");
                    return;
                }
                if (res.status === 409) {
                    emailErrorMsj = "El email ya se encuentra registrado";
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
                console.log("Error en carga del cliente desconocido: ", error);
            });
    };

    onMount( () => {
        nombre="Mi nombre";
        apellido = "Mi apellido";
        dni = "1234556";
        direccion = "Mi direccion";
        telefono = "221454256";
        fechaNacimiento = new Date().toJSON().slice(0, 10);
    } )

</script>

<Modal />

<div
    class="container mt-2 mb-10 h-full mx-auto flex justify-center items-center"
>
    <form
        on:submit|preventDefault={handleCarga}
        class="space-y-2 {submittedClass}"
    >
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

        <label class="label" for="fechaNacimiento">Fecha de nacimiento:</label>
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
        <p>Foto:</p> 
        <input bind:files={FotoFile} type="file" accept="image/png, image/jpeg"
            on:change={onChangeFile}>
            <div>
                {#if avatar}
                    <img class="object-contain h-32 w-32" src="{avatar}" alt="foto de perfil" />
                {:else}
                    <img class="object-contain h-32 w-32" src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png" alt="" /> 
                {/if}
            </div>
        <button class="btn rounded-lg variant-filled-primary" type="submit"
            >Actualizar</button
        >
    </form>
</div>
