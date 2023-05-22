<script lang="ts">
    import { goto } from "$app/navigation";
    import { user } from "$lib/stores/user";
    import type { Oficio } from "$lib/interfaces/PaseadoresYCuidadores.interface";
    import {
        popup,
        type ModalSettings,
        type PopupSettings,
    } from "@skeletonlabs/skeleton";
    import { Modal, modalStore } from "@skeletonlabs/skeleton";
    import DateInput from "date-picker-svelte/DateInput.svelte";

    let submittedClass = "";
    const emailPattern: string =
        "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,}$";
    const letrasEspaciosPattern: string =
        "^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ]+$";

    const numbersPattern: string = "^[0-9]*$";
    let emailErrorMsj = "";

    const popupFocusBlur: PopupSettings = {
        event: "focus-blur",
        target: "popupFocusBlur",
        placement: "top",
    };

    const paseadorCuidadorCargado: ModalSettings = {
        type: "alert",
        title: "Paseador/cuidador cargado",
        body: "Paseador/cuidador cargado correctamente",
        buttonTextCancel: "Ok",
        response: (r: boolean) => goto("/paseadores-y-cuidadores"),
    };

    const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Fallo de la carga del paseador/cuidador",
        body: "No se pudo cargar el nuevo paseador/cuidador",
        buttonTextCancel: "Ok",
    };

    const fallaServidor: ModalSettings = {
        type: "alert",
        title: "Fallo de la carga del paseador/cuidador",
        body: "Falla del servidor",
        buttonTextCancel: "Ok",
    };

    const fallaYaCargado: ModalSettings = {
        type: "alert",
        title: "Fallo de la carga del paseador/cuidador",
        body: "El paseador/cuidador ya se encuentra cargado",
        buttonTextCancel: "Ok",
    };

    const zonas = [
        "Plaza Alsina",
        "Plaza Olazábal",
        "Plaza Belgrano",
        "Plaza Güemes",
        "Parque Alberti",
        "Plaza 19 De Noviembre",
        "Plaza Azcuénaga",
        "Paza Paso",
        "Plaza Italia",
        "Parque Vucetich (San Martín)",
        "Plaza Islas Malvinas",
        "Plaza Moreno",
        "Plaza San Martín",
        "Plaza Rivadavia",
        "Paseo Del Bosque",
        "Plaza Juan D. Perón",
        "Plaza Yrigoyen",
        "Plaza Rocha",
        "Parque Castelli",
        "Plaza Sarmiento",
        "Parque Saavedra",
        "Plaza España",
        "Plaza Matheu",
        "Parque Meridiano V",
        "Plaza Máximo Paz",
    ];
    let nombre = "";
    let apellido = "";
    let zona = "";
    let telefono = "";
    let email = "";
    let oficio: Oficio;
    let horarios = "";

    const handleRegistro = async () => {
        let error: boolean = false;

        await fetch("http://localhost:3000/cargar-paseadorcuidador", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                nombre: nombre,
                apellido: apellido,
                zona: zona,
                telefono: telefono,
                email: email,
                oficio: oficio,
                horarios: horarios,
            }),
        })
            .then((res) => {
                if (res.status < 299) {
                    modalStore.clear();
                    modalStore.trigger(paseadorCuidadorCargado);
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
                console.log(
                    "Error desconocido en carga del paseador/cuidador : ",
                    error
                );
            });
    };
</script>

<Modal />

<div
    class="container mt-10 mb-10 h-full mx-auto flex justify-center items-center"
>
    <form
        on:submit|preventDefault={handleRegistro}
        class="space-y-2 mb-2 {submittedClass}"
    >
        <label class="label" for="nombre">Nombre:</label>
        <input
            bind:value={nombre}
            class="input focus:invalid:border-red-500"
            type="text"
            placeholder="Ej: Marcos"
            name="nombre"
            pattern={letrasEspaciosPattern}
            required
        />

        <label class="label" for="apellido">Apellido:</label>
        <input
            bind:value={apellido}
            class="input focus:invalid:border-red-500"
            type="text"
            placeholder="Ej: Norton"
            name="apellido"
            pattern={letrasEspaciosPattern}
            required
        />

        <label class="label" for="zona">Zona:</label>
        <select
            bind:value={zona}
            class="input"
            placeholder="Zona"
            name="zona"
            required
        >
            <option value="" disabled selected>Seleccione una</option>
            {#each zonas as value}
                <option {value}>{value}</option>
            {/each}
        </select>

        <p>Disponibilidad horaria:</p>
        <textarea
            bind:value={horarios}
            class="input rounded-3xl"
            placeholder="Ej: Sábados de 13:00hs a 17:00hs, domingos de 14:00hs a 18:00hs, etc..."
            name="observaciones"
            required
        />

        <label class="label" for="dni">Teléfono:</label>
        <input
            bind:value={telefono}
            class="input focus:invalid:border-red-500"
            type="text"
            placeholder="Ej: 2214687634"
            use:popup={popupFocusBlur}
            name="telefono"
            pattern={numbersPattern}
            required
        />

        <label class="label" for="email">Email:</label>
        <input
            pattern={emailPattern}
            title="Ingrese un mail valido"
            bind:value={email}
            class="input focus:invalid:border-red-500"
            type="text"
            placeholder="Ej: marcosnorton@gmail.com"
            name="email"
            required
        />
        <p class="text-red-500">{emailErrorMsj}</p>

        <div class="card p-4 variant-filled" data-popup="popupFocusBlur">
            <p>Sólo números</p>
            <div class="arrow variant-filled" />
        </div>

        <label class="label" for="oficio">Oficio:</label>
        <select
            bind:value={oficio}
            class="input"
            placeholder="Oficio"
            name="oficio"
            required
        >
            <option value="" disabled selected>Seleccione uno</option>
            {#each ["Paseador", "Cuidador", "Ambos"] as value}
                <option {value}>{value}</option>
            {/each}
        </select>

        <button class="btn rounded-lg variant-filled-primary" type="submit"
            >Cargar paseador/cuidador</button
        >
    </form>
</div>
