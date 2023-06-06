<script lang="ts">
    import { afterNavigate, goto } from "$app/navigation";
    import { user } from "$lib/stores/user";
    import { backendURL } from "$lib/utils/constantFactory";
    import {
        Modal,
        modalStore,
        type ModalSettings,
        type PopupSettings,
    } from "@skeletonlabs/skeleton";
    import type { AfterNavigate } from "@sveltejs/kit";
    import { onMount } from "svelte";

    const nombreAnterior: string =
        new URLSearchParams(window.location.search).get("nombre") ??
        $user?.email ??
        "";

    let owner: string =
        new URLSearchParams(window.location.search).get("owner") ?? "";

    let nombre = nombreAnterior;
    let raza = "";
    let sexo = "";
    let fechaNacimiento: string; //
    let observaciones = "";
    let foto: any;

    let FotoFile: any; //por ahora ni tiene utilidad
    let submittedClass = "";
    let fechaMax: string = new Date().toJSON().slice(0, 10);

    const letrasEspaciosPattern: string =
        "^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ]+$";

    const numbersPattern: string = "^[0-9]*$";
    let emailErrorMsj = "";
    let fileErrorMsj = "";
    const perroActualizado: ModalSettings = {
        type: "alert",
        title: "Perro actualizado",
        body: "La información del perro se actualizó correctamente.",
        buttonTextCancel: "Ok",
        response: (r: boolean) => goto(`/mis-perros?cliente=${owner}`),
    };

    const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Error desconocido",
        body: "No se pudo actualizar la información del perro.",
        buttonTextCancel: "Ok",
    };

    const fallaServidor: ModalSettings = {
        type: "alert",
        title: "Fallo en actualizacion de la información del perro.",
        body: "Falla del servidor",
        buttonTextCancel: "Ok",
    };

    const fallaYaCargado: ModalSettings = {
        type: "alert",
        title: "Fallo de la carga del perro",
        body: "Ya tiene un perro con ese nombre.",
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
        body: "¿Está seguro de eliminar la foto del perro? La eliminación se hará efectiva al actualizar la información",
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
        fetch(
            `${backendURL}/get-perro?owner=${owner}&nombre=${nombre}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        )
            .then((res) => {
                if (res.status < 299) {
                    //si entra acá no hubo error
                    return res.json();
                }
                return Promise.reject(res);
            })
            .then((res) => {
                nombre = res.data.nombre;
                raza = res.data.raza;
                sexo = res.data.sexo;
                fechaNacimiento = res.data.fechaNacimiento.slice(0, 10); //despues capaz tenga que cambiar el formato??
                observaciones = res.data.observaciones;
                foto = res.data.foto;
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
        fetch(`${backendURL}/actualizar-perro`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                nombre,
                owner,
                raza,
                sexo,
                fechaNacimiento,
                observaciones,
                foto: foto,
                nombreAnterior,
            }),
        })
            .then((res) => {
                if (res.status < 299) {
                    modalStore.clear();
                    modalStore.trigger(perroActualizado);
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
                    modalStore.clear();
                    modalStore.trigger(fallaYaCargado);
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

            <label class="label" for="raza">Raza:</label>
            <input
                bind:value={raza}
                class="input focus:invalid:border-red-500"
                type="text"
                placeholder="Ej: Dálmata"
                name="raza"
                pattern={letrasEspaciosPattern}
                required
            />

            <label class="label" for="sexo">Sexo:</label>
            <select
                bind:value={sexo}
                class="input"
                placeholder="Ej: Macho"
                name="sexo"
                required
            >
                <option value="" disabled selected>{sexo}</option>
                {#each ["Macho", "Hembra"] as value}
                    <option {value}>{value}</option>
                {/each}
            </select>

            <label class="label" for="fechaNacimiento"
                >Fecha de nacimiento:</label
            >
            <input
                bind:value={fechaNacimiento}
                class="input"
                type="date"
                placeholder="Ej: 21/08/2022"
                name="fechaNacimiento"
                max={fechaMax}
                required
            />

            <label class="label" for="observaciones">Observaciones:</label>
            <textarea
                bind:value={observaciones}
                class="input rounded-3xl"
                placeholder="Ej: Es blanco, tiene la cola cortada, etc..."
                name="observaciones"
            />

            <p>Foto:</p>
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
                        src="/no_foto_perro.png"
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

        <a href="/mis-perros/"
            ><button class="btn rounded-lg variant-filled-secondary"
                >Cancelar edición</button
            ></a
        >

        <button class="btn rounded-lg variant-filled-primary" type="submit"
            >Actualizar información</button
        >
    </form>
</div>
