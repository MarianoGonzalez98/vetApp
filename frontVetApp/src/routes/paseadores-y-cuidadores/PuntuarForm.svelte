<script lang="ts">
    import {
        backendURL,
        emailPatternFactory,
        letrasEspaciosPatternFactory,
    } from "$lib/utils/constantFactory";

    // Props
    /** Exposes parent props to this component. */
    export let parent: any;
    export let emailPC: string;

    // Stores
    import {
        modalStore,
        popup,
        type ModalSettings,
        type PopupSettings,
    } from "@skeletonlabs/skeleton";

    const pcPuntuado: ModalSettings = {
        type: "alert",
        title: "Paseador/cuidador puntuado",
        body: "Se puntuó correctamente el paseador/cuidador.",
        buttonTextCancel: "Ok",
    };

    const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Fallo en la puntuación",
        body: "No se pudo puntuar al paseador/cuidador.",
        buttonTextCancel: "Ok",
    };

    async function onConfirm() {
        
        
        
        // HACER


        
        await fetch(`${backendURL}/puntuar-pc`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
            .then((res) => {
                if (res.status < 299) {
                    modalStore.clear();
                    modalStore.trigger(pcPuntuado);
                    return res;
                }
            })
            .catch((error) => {
                modalStore.clear();
                modalStore.trigger(fallaDesconocida);
                console.log(
                    "Error desconocido la puntuación del paseador/cuidador",
                    error
                );
            });
    }

    // Base Classes
    const cBase = "card p-4 w-modal shadow-xl space-y-4";
    const cHeader = "text-2xl font-bold";
    const cForm =
        "border border-surface-500 p-4 space-y-4 rounded-container-token";

    import { onMount } from "svelte";

    let rating = 0;
    let selectedStars = 0;

    const selectStar = (starCount: number) => {
        selectedStars = starCount;
    };

    const confirmRating = () => {
        rating = selectedStars;
    };

    onMount(() => {
        // Inicializar el estado de las estrellas
        selectedStars = rating;
    });

    function onClose(): void {
        if ($modalStore[0].response) $modalStore[0].response(false);
        modalStore.close();
    }
</script>

{#if $modalStore[0]}
    <div class="modal-example-form {cBase}">
        <header class={cHeader}>Puntuar paseador/cuidador</header>
        <div class="flex items-center justify-center">
            <div class="flex space-x-1">
                {#each [1, 2, 3, 4, 5] as starCount}
                    {#if starCount <= selectedStars}
                        <button
                            class="h-10 w-10 fill-current"
                            on:click={() => selectStar(starCount)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                class="text-yellow-500"
                            >
                                <path
                                    class="heroicon-ui"
                                    d="M12 17.27l-4.55 2.75 1.09-5.99L3.5 9.75l6.03-.88L12 3l2.47 5.87 6.03.88-4.04 3.18 1.09 5.99z"
                                />
                            </svg>
                        </button>
                    {:else}
                        <!-- PONER QUE SE MARQUE OSCURITA LA ESTRELLA CUANDO SE SELECCIONE -->
                        <button
                            class="h-10 w-10 fill-current"
                            on:click={() => selectStar(starCount)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                class="text-gray-300"
                            >
                                <path
                                    class="heroicon-ui"
                                    d="M12 17.27l-4.55 2.75 1.09-5.99L3.5 9.75l6.03-.88L12 3l2.47 5.87 6.03.88-4.04 3.18 1.09 5.99z"
                                />
                            </svg>
                        </button>
                    {/if}
                {/each}
            </div>
        </div>

        <div class="flex justify-between">
            <button
                type="button"
                class="btn variant-ghost-surface}"
                on:click={onClose}>Cancelar</button
            >
            <button
                type="button"
                class="btn variant-filled"
                on:click={confirmRating}>Confirmar</button
            >
        </div>
    </div>
{/if}

<p class="mt-2">
    Puntuación actual: {rating} estrella{rating !== 1 && "s"}
</p>
