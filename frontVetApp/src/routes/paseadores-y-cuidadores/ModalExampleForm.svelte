<script lang="ts">
    import { emailPatternFactory, letrasEspaciosPatternFactory } from "$lib/utils/constantFactory";

    // Props
    /** Exposes parent props to this component. */
    export let parent: any;
    export let miNombre: string;
    export let miApellido: string;
    export let miEmail: string;
    export let miTelefono: string;
    export let emailDestinatario: string;

    // Stores
    import {
        modalStore,
        popup,
        type ModalSettings,
        type PopupSettings,
    } from "@skeletonlabs/skeleton";

    const numbersPattern: string = "^[0-9]*$";

    let nombre = miNombre;
    let apellido = miApellido;
    let telefono = miTelefono;
    let emailRemitente = miEmail;
    let mensaje = "";

    const perroCargado: ModalSettings = {
        type: "alert",
        title: "Paseador/cuidador contactado",
        body: "Se envió un mail al paseador/cuidador con sus datos.",
        buttonTextCancel: "Ok",
    };

    const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Fallo en el contacto",
        body: "No se pudo enviar un mail al paseador/cuidador.",
        buttonTextCancel: "Ok",
    };

    const popupFocusBlur: PopupSettings = {
        event: "focus-blur",
        target: "popupFocusBlur",
        placement: "top",
    };

    // We've created a custom submit function to pass the response and close the modal.
    async function onFormSubmit() {
        await fetch("http://localhost:3000/enviar-mail-pc", {
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
                mensaje,
                emailDestinatario,
            }),
        })
            .then((res) => {
                if (res.status < 299) {
                    modalStore.clear();
                    modalStore.trigger(perroCargado);
                    return res;
                }
            })
            .catch((error) => {
                modalStore.clear();
                modalStore.trigger(fallaDesconocida);
                console.log("Error desconocido en carga del perro", error);
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
                    placeholder="Ej: Me gustaría contratar sus servicios para los días... en los horarios..."
                />
            </label>
            <footer class="modal-footer {parent.regionFooter}">
                <button
                    class="btn {parent.buttonNeutral}"
                    on:click={parent.onClose}>Cancelar</button
                >
                <button class="btn {parent.buttonPositive}" type="submit"
                    >Contactar paseador/cuidador</button
                >
            </footer>
        </form>
    </div>
{/if}
