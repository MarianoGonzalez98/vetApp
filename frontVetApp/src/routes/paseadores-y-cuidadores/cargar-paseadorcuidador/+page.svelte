<script lang="ts">
    import { goto } from "$app/navigation";
    import { user } from "$lib/stores/user";
    import type { Oficio } from "$lib/interfaces/PaseadoresYCuidadores.interface";
    import {
        popup,
        type ModalSettings,
        type PopupSettings,
        Autocomplete,
        type AutocompleteOption,
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

    let popupSettings: PopupSettings = {
        event: "focus-click",
        target: "popupAutocomplete",
        placement: "bottom",
    };

    const zonas: AutocompleteOption[] = [
        {
            label: "Plaza Alsina",
            value: "Plaza Alsina",
            keywords: "plaza",
        },
        {
            label: "Plaza Olazábal",
            value: "Plaza Olazábal",
            keywords: "plaza",
        },
        {
            label: "Plaza Belgrano",
            value: "Plaza Belgrano",
            keywords: "plaza",
        },
        {
            label: "Plaza Güemes",
            value: "Plaza Güemes",
            keywords: "plaza",
        },
        {
            label: "Parque Alberti",
            value: "Parque Alberti",
            keywords: "parque",
        },
        {
            label: "Plaza 19 De Noviembre",
            value: "Plaza 19 De Noviembre",
            keywords: "plaza",
        },
        {
            label: "Plaza Azcuénaga",
            value: "Plaza Azcuénaga",
            keywords: "plaza",
        },
        {
            label: "Plaza Paso",
            value: "Plaza Paso",
            keywords: "plaza",
        },
        {
            label: "Plaza Italia",
            value: "Plaza Italia",
            keywords: "plaza",
        },
        {
            label: "Parque Vucetich (San Martín)",
            value: "Parque Vucetich (San Martín)",
            keywords: "parque",
        },
        {
            label: "Plaza Islas Malvinas",
            value: "Plaza Islas Malvinas",
            keywords: "plaza",
        },
        {
            label: "Plaza Moreno",
            value: "Plaza Moreno",
            keywords: "plaza",
        },
        {
            label: "Plaza San Martín",
            value: "Plaza San Martín",
            keywords: "plaza",
        },
        {
            label: "Plaza Rivadavia",
            value: "Plaza Rivadavia",
            keywords: "plaza",
        },
        {
            label: "Paseo Del Bosque",
            value: "Paseo Del Bosque",
            keywords: "paseo",
        },
        {
            label: "Plaza Juan D. Perón",
            value: "Plaza Juan D. Perón",
            keywords: "plaza",
        },
        {
            label: "Plaza Yrigoyen",
            value: "Plaza Yrigoyen",
            keywords: "plaza",
        },
        {
            label: "Plaza Rocha",
            value: "Plaza Rocha",
            keywords: "plaza",
        },
        {
            label: "Parque Castelli",
            value: "Parque Castelli",
            keywords: "parque",
        },
        {
            label: "Plaza Sarmiento",
            value: "Plaza Sarmiento",
            keywords: "plaza",
        },
        {
            label: "Parque Saavedra",
            value: "Parque Saavedra",
            keywords: "parque",
        },
        {
            label: "Plaza España",
            value: "Plaza España",
            keywords: "plaza",
        },
        {
            label: "Plaza Matheu",
            value: "Plaza Matheu",
            keywords: "plaza",
        },
        {
            label: "Parque Meridiano V",
            value: "Parque Meridiano V",
            keywords: "parque",
        },
        {
            label: "Plaza Máximo Paz",
            value: "Plaza Máximo Paz",
            keywords: "plaza",
        },
    ];

    function onPopupDemoSelect(event: any): void {
        zona = event.detail.label;
    }
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

        <div class="text-token w-full max-w-sm space-y-2">
            <input
                class="input autocomplete"
                type="search"
                name="autocomplete-search"
                bind:value={zona}
                placeholder="Ej: Plaza Moreno"
                use:popup={popupSettings}
            />
            <div
                data-popup="popupAutocomplete"
                class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto"
            >
                <Autocomplete
                    bind:input={zona}
                    options={zonas}
                    on:selection={onPopupDemoSelect}
                />
            </div>
        </div>

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
