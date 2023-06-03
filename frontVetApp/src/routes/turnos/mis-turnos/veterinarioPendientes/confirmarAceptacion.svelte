<script lang="ts">
    import { goto } from '$app/navigation';
    import type { Turno } from '$lib/interfaces/Turno.interface';
    import { user } from "$lib/stores/user";
    import { backendURL } from '$lib/utils/constantFactory';
    import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
    import { onMount } from 'svelte';


	// Props
	/** Exposes parent props to this component. */
	export let parent: any;
	export let turnoInfo:Turno;


	// Stores 

    const TurnoAceptado: ModalSettings = {
        type: 'alert',
        title: 'Turno aceptado',
        body: 'Turno aceptado',
        buttonTextCancel: "Ok",
        response: () => location.reload() 
    };
 
    const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Fallo en la solicitud del turno",
        body: "No se pudo solicitar el nuevo turno",
        buttonTextCancel: "Ok",
    };

	async function onConfirm() {
        await fetch(`${backendURL}/turnos/aceptar-turno`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    aceptado:true,
                    idTurnoSelec:turnoInfo.id
                })
            })
            .then((res) => {
                if (res.status < 299) {
                        if ($modalStore[0].response) {
                            $modalStore[0].response(true);
                        }
                        modalStore.clear();
                        modalStore.trigger(TurnoAceptado);
                        return res;
                }
                return Promise.reject(res);
            })
            .catch((error) => {
                    modalStore.clear();
                    modalStore.trigger(fallaDesconocida);
                    console.log(error);
            });
	}

	// Base Classes for css
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	let buttonNeutral = 'variant-ghost-surface';
	/** Provide classes for positive actions, such as Confirm or Submit. */
	let buttonPositive = 'variant-filled';
	
	function onClose(): void {
		if ($modalStore[0].response) $modalStore[0].response(false);
		modalStore.close();
	}
</script>


{#if $modalStore[0]}
	<slot></slot>
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>aceptar el turno</header>
		<article>¿Está seguro de aceptar el turno con fecha {turnoInfo.fecha.toString().slice(0,10)}? </article>

			<button type="button" class="btn {buttonNeutral}" on:click={onClose}>Cancelar</button>
			<button type="button" class="btn {buttonPositive}" on:click={onConfirm}>Confirmar</button>
		<footer class="modal-footer {parent.regionFooter}">

    </footer>
	</div>
{/if}
