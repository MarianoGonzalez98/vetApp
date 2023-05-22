<script lang="ts">
    import type { Perro } from "$lib/interfaces/Perro.interface";

    // Props
    /** Exposes parent props to this component. */
    export let parent: any;
    export let perro: Perro;

    // Stores
    import { modalStore, type ModalSettings } from "@skeletonlabs/skeleton";

    async function onConfirm() {
        await fetch("http://localhost:3000/marcar-como-fallecido", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                nombre: perro.nombre,
                owner: perro.owner,
                id: perro.id,
            }),
        })
            .then((res) => {
                if (res.status < 299) {
                    //si entra acá no hubo error
                    if ($modalStore[0].response) {
                        $modalStore[0].response(true);
                    }
                    modalStore.clear();
                    modalStore.trigger(perroMarcadoComoFallecidoModal);
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

    const perroMarcadoComoFallecidoModal: ModalSettings = {
        type: "alert",
        title: "Marcado correcto",
        body: "El perro se marcó como fallecido.",
        buttonTextCancel: "Ok",
    };

    const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Error desconocido",
        body: "No se pudo realizar el contacto",
        buttonTextCancel: "Ok",
    };

    // Base Classes for css
    const cBase = "card p-4 w-modal shadow-xl space-y-4";
    const cHeader = "text-2xl font-bold";
    let buttonNeutral = "variant-ghost-surface";
    /** Provide classes for positive actions, such as Confirm or Submit. */
    let buttonPositive = "variant-filled";

    function onClose(): void {
        if ($modalStore[0].response) $modalStore[0].response(false);
        modalStore.close();
    }
</script>

{#if $modalStore[0]}
    <slot />
    <div class="modal-example-form {cBase}">
        <header class={cHeader}>Confirme su acción</header>
        <article>
            ¿Está seguro de ocultar al perro {perro.nombre} del cliente {perro.owner}?
            Esta acción no puede deshacerse.
        </article>

        <button type="button" class="btn {buttonNeutral}" on:click={onClose}
            >Cancelar</button
        >
        <button type="button" class="btn {buttonPositive}" on:click={onConfirm}
            >Confirmar</button
        >
        <footer class="modal-footer {parent.regionFooter}" />
    </div>
{/if}
