<script lang="ts">
    import { goto } from "$app/navigation";
    import { user } from "$lib/stores/user";
    import type { Oficio } from "$lib/interfaces/PaseadoresYCuidadores.interface";
    import {
        Modal,
        modalStore,
        type ModalSettings,
        type PopupSettings,
    } from "@skeletonlabs/skeleton";
    import DateInput from "date-picker-svelte/DateInput.svelte";
    import { backendURL } from "$lib/utils/constantFactory";


    let submittedClass = "";

    let emailErrorMsj = "";

    const popupFocusBlur: PopupSettings = {
        event: "focus-blur",
        target: "popupFocusBlur",
        placement: "top",
    };

    const campaignCreada: ModalSettings = {
        type: "alert",
        title: "Campaña creada",
        body: "La campaña se creó correctamente.",
        buttonTextCancel: "Ok",
        response: (r: boolean) => goto("/donaciones"),
    };

    const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Fallo de la creación de la camapaña",
        body: "No se pudo crear la campaña",
        buttonTextCancel: "Ok",
    };

    const fallaServidor: ModalSettings = {
        type: "alert",
        title: "Fallo de la creación de la camapaña",
        body: "Falla del servidor",
        buttonTextCancel: "Ok",
    };

    const fallaYaCreada: ModalSettings = {
        type: "alert",
        title: "Fallo de la creación de la camapaña",
        body: "La campaña ya se encuentra creada.",
        buttonTextCancel: "Ok",
    };

    let nombre = "";
    let montoARecaudar: number;
    let fechaLimite: string = new Date().toJSON().slice(0, 10);
    let descripcion = "";

    const fechaHoy = new Date(Date.now());
    const fechaHoyString = `${fechaHoy.getFullYear()}-${(
        fechaHoy.getMonth() + 1
    )
        .toString()
        .padStart(2, "0")}-${fechaHoy.getDate().toString().padStart(2, "0")}`;

    const handleRegistro = async () => {
        let error: boolean = false;

        await fetch(`${backendURL}/donaciones/crear-campaign`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                nombre,
                montoARecaudar,
                fechaLimite,
                descripcion,
            }),
        })
            .then((res) => {
                if (res.status < 299) {
                    modalStore.clear();
                    modalStore.trigger(campaignCreada);
                    return res;
                }
                if (res.status === 400) {
                    //error por modificacion del token jwt.
                    $user = null;
                    goto("/auth/login");
                    return;
                }
                if (res.status === 409) {
                    modalStore.clear();
                    modalStore.trigger(fallaYaCreada);
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
                console.log(
                    "Error desconocido en carga del paseador/cuidador : ",
                    error
                );
            });
    };

    let popupSettings: PopupSettings = {
        event: "focus-click",
        target: "popupAutocomplete",
        placement: "bottom",
    };
</script>

<Modal />

<a class="btn variant-filled m-4" rel="noreferrer" href="/donaciones">Atras</a>
<div class="container pb-20 h-full mx-auto flex justify-center items-center">
    <div class="modal-example-form card p-4 w-modal shadow-xl space-y-4">
        <header class="text-2xl font-bold">Crear campaña de donación</header>
        <form
            on:submit|preventDefault={handleRegistro}
            class="space-y-2 mb-2 {submittedClass}"
        >
            <label class="label" for="nombre">Nombre:</label>
            <input
                bind:value={nombre}
                class="input focus:invalid:border-red-500"
                type="text"
                placeholder="Ej: Tu Mascota Héroe"
                name="nombre"
                required
            />

            <label class="label" for="montoARecaudar">Monto a recaudar:</label>
            <input
                bind:value={montoARecaudar}
                class="input focus:invalid:border-red-500"
                type="number"
                placeholder="Ej: $1.000.000"
                name="montoARecaudar"
                step="0.01"
                required
            />

            <label class="label" for="fechaLimite"
                >Fecha de límite de cierre de campaña:</label
            >
            <input
                bind:value={fechaLimite}
                class="input"
                type="date"
                min={fechaHoyString}
                name="fechaLimite"
                required
            />

            <label class="label" for="descripcion">Descripción:</label>
            <textarea
                bind:value={descripcion}
                class="input rounded-3xl"
                placeholder="Ej: Campaña de donaciones a la veterinaria Tu Mascota Héroe."
                name="descripcion"
                required
            />

            <footer class="flex justify-between">
                <a class="btn variant-filled" href="/donaciones">Cancelar</a>
                <button class="btn variant-filled-primary" type="submit"
                    >Crear campaña</button
                >
            </footer>
        </form>
    </div>
</div>
