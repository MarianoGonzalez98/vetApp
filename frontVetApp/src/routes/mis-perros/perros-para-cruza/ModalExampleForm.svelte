<script lang="ts">
    import type { Cliente, ExtrasCliente } from "$lib/interfaces/Cliente.interface";
    import type { Perro, Sexo } from "$lib/interfaces/Perro.interface";
    import { backendURL, emailPatternFactory, letrasEspaciosPatternFactory } from "$lib/utils/constantFactory";

    // Props
    /** Exposes parent props to this component. */ 
    export let parent: any;   
    export let cliente: Cliente&ExtrasCliente;
    export let emailCliente: string;
    export let nombrePerroOriginal: string;
    export let sexoPerroOriginal: Sexo;
    export let perrosCliente: Perro[];
    export let perroSeleccionado: Perro;

    // Stores
    import {
        modalStore,
        popup,
        type ModalSettings,
        type PopupSettings,
    } from "@skeletonlabs/skeleton";

    const numbersPattern: string = "^[0-9]*$";

    let nombre = cliente.nombre;
    let apellido = cliente.apellido;
    let telefono = cliente.telefono;
    let emailRemitente = emailCliente;
    let perro: Perro;
    let mensaje = "";
    let emailDestinatario = perroSeleccionado.owner;

    const mailEnviado: ModalSettings = {
        type: "alert",
        title: "Dueño contactado",
        body: "Se envió un mail al dueño del perro con sus datos.",
        buttonTextCancel: "Ok",
    };

    const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Fallo en el contacto",
        body: "No se pudo enviar un mail al dueño del perro.",
        buttonTextCancel: "Ok",
    };

    const popupFocusBlur: PopupSettings = {
        event: "focus-blur",
        target: "popupFocusBlur",
        placement: "top",
    };

    // We've created a custom submit function to pass the response and close the modal.
    async function onFormSubmit() {
        await fetch(`${backendURL}/enviar-mail-perro-cruza`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                nombre,
                apellido,
                telefono,
                emailRemitente,
                emailDestinatario,
                perroSeleccionado,
                mensaje,
            }),
        })
            .then((res) => {
                if (res.status < 299) {
                    modalStore.clear();
                    modalStore.trigger(mailEnviado);
                    return res;
                }
            })
            .catch((error) => {
                modalStore.clear();
                modalStore.trigger(fallaDesconocida);
                console.log("Error desconocido en contacto con el dueño", error);
            });
    }

    // Base Classes
    const cBase = "card p-4 w-modal shadow-xl space-y-4";
    const cHeader = "text-2xl font-bold";
    const cForm =
        "border border-surface-500 p-4 space-y-4 rounded-container-token";
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
    <div class="modal-example-form {cBase}">
        <header class={cHeader}>Contacto</header>
        <form
            on:submit|preventDefault={onFormSubmit}
            class="modal-form {cForm}"
        >
            <label class="label">
                <span>Nombre:</span>
                <input
                    class="input focus:invalid:border-red-500"
                    type="text"
                    bind:value={nombre}
                    placeholder="Ej: Juan"
                    pattern={letrasEspaciosPatternFactory}
                    required
                />
            </label>
            <label class="label">
                <span>Apellido:</span>
                <input
                    class="input focus:invalid:border-red-500"
                    type="text"
                    bind:value={apellido}
                    placeholder="Ej: Carlos"
                    pattern={letrasEspaciosPatternFactory}
                    required
                />
            </label>
            <label class="label">
                <span>Teléfono:</span>
                <input
                    class="input focus:invalid:border-red-500"
                    type="tel"
                    bind:value={telefono}
                    placeholder="Ej: 2213856723"
                    use:popup={popupFocusBlur}
                    pattern={numbersPattern}
                    required
                />
            </label>
            <label class="label">
                <span>Email:</span>
                <input
                    class="input focus:invalid:border-red-500"
                    type="email"
                    bind:value={emailRemitente}
                    placeholder="Ej: juan.carlos@gmail.com"
                    pattern={emailPatternFactory}
                    required
                />
            </label>

            <label class="label">
                <span>Mensaje:</span>
                <textarea
                    class="input rounded-3xl"
                    bind:value={mensaje}
                    placeholder="Si lo desea, puede escribir un mensaje para que le llegue al dueño del perro."
                />
            </label>
            <footer class="modal-footer {parent.regionFooter}">
                <button
                    class="btn {parent.buttonNeutral}"
                    on:click={parent.onClose}>Cancelar</button
                >
                <button class="btn {parent.buttonPositive}" type="submit"
                    >Contactar dueño/a</button
                >
            </footer>
        </form>
    </div>
{/if}
