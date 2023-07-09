<script lang="ts">
    import type {
        Cliente,
        ExtrasCliente,
    } from "$lib/interfaces/Cliente.interface";
    import type { Perro, Sexo } from "$lib/interfaces/Perro.interface";
    import {
        backendURL,
        emailPatternFactory,
        letrasEspaciosPatternFactory,
    } from "$lib/utils/constantFactory";

    // Props
    /** Exposes parent props to this component. */
    export let parent: any;
    export let perro: Perro;

    // Stores
    import {
        modalStore,
        popup,
        type ModalSettings,
        type PopupSettings,
    } from "@skeletonlabs/skeleton";

    const fallaServidor: ModalSettings = {
        type: "alert",
        title: "Fallo de la carga del perro",
        body: "Falla del servidor",
        buttonTextCancel: "Ok",
    };

    const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Fallo en el contacto",
        body: "No se pudo enviar un mail al paseador/cuidador.",
        buttonTextCancel: "Ok",
    };

    async function onFormSubmit() {
        await fetch(`${backendURL}/cambiar-disponible-para-cruza`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                owner: perro.owner,
                nombre: perro.nombre,
                paraCruza: !perro.paraCruza,
                sexo: "Hembra",
                fechaDeCelo: fechaDeCelo,
            }),
        })
            .then((res) => {
                if (res.status < 299) {
                    //si entra acá no hubo error
                    if ($modalStore[0].response) {
                        $modalStore[0].response({ success: true, message: fechaDeCelo });
        }
                    modalStore.clear();
                    return res;
                }
                return Promise.reject(res);
            })
            .catch((e) => {
                console.log(e);
                modalStore.clear();
                modalStore.trigger(fallaDesconocida);
            });
    }

    // Base Classes
    const cBase = "card p-4 w-modal shadow-xl space-y-4";
    const cHeader = "text-2xl font-bold";
    const cForm =
        "border border-surface-500 p-4 space-y-4 rounded-container-token";
    let fechaDeCelo = "";
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
    <div class="modal-example-form {cBase}">
        <header class={cHeader}>Ingrese la fecha de celo</header>
        <article>
            Para registrar una perra para la cruza, debe ingresar la fecha aproximada de celo de la misma.
        </article>
        <form
            on:submit|preventDefault={onFormSubmit}
            class="modal-form {cForm}"
        >
            <label class="label">
                <span>Fecha de celo:</span>
                <textarea
                    class="input rounded-3xl"
                    bind:value={fechaDeCelo}
                    required
                />
            </label>

            <footer class="modal-footer {parent.regionFooter}">
                <button
                    class="btn {parent.buttonNeutral}"
                    on:click={parent.onClose}>Cancelar</button
                >
                <button class="btn {parent.buttonPositive}" type="submit"
                    >Confirmar</button
                >
            </footer>
        </form>
    </div>
{/if}
