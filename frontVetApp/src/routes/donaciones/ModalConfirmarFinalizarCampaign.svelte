<script lang="ts">
    import type { Campaign } from "$lib/interfaces/Donaciones.interface";

    // Props
    /** Exposes parent props to this component. */
    export let parent: any;
    export let campaign: Campaign;

    // Stores
    import { modalStore, type ModalSettings } from "@skeletonlabs/skeleton";

    async function onConfirm() {
        await fetch("http://localhost:3000/donaciones/finalizar-campaign", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                nombre: campaign.nombre
            }),
        })
            .then((res) => {
                if (res.status < 299) {
                    //si entra acá no hubo error
                    if ($modalStore[0].response) {
                        $modalStore[0].response(true);
                    }
                    modalStore.clear();
                    modalStore.trigger(campaignFinalizada);
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

    const campaignFinalizada: ModalSettings = {
        type: "alert",
        title: "Finalización correcta",
        body: "Se finalizó correctamente la campaña.",
        buttonTextCancel: "Ok",
    };

    const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Error desconocido",
        body: "No se pudo finalizar la campaña",
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
            ¿Está seguro de finalizar la campaña "{campaign.nombre}"?
            Esta acción no puede deshacerse.
        </article>

        <button type="button" class="btn {buttonNeutral}" on:click={onClose}
            >Cancelar</button
        >
        <button type="button" class="btn {buttonPositive}" on:click={onConfirm}
            >Finalizar campaña</button
        >
        <footer class="modal-footer {parent.regionFooter}" />
    </div>
{/if}
