<script lang="ts">
    import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
    import type { Turno } from '$lib/interfaces/Turno.interface';
    import { backendURL } from '$lib/utils/constantFactory';


	// Props
	/** Exposes parent props to this component. */
	export let parent: any;
	export let turnoInfo:Turno;


	// Stores
	

    
    const TurnoCancelado: ModalSettings = {
            type: 'alert',
            title: 'Turno cancelado',
            body: 'Turno cancelado',
            buttonTextCancel: "Ok",
            response: () => location.reload(),
    };

    const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Fallo en la solicitud del turno",
        body: "No se pudo solicitar el nuevo turno",
        buttonTextCancel: "Ok",
    };

	async function onConfirm() {
        await fetch(`${backendURL}/turnos/cancelar-turno`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    cancelado:true,
                    idTurnoSelec:turnoInfo.id
                })
            })
            .then((res) => {
                if (res.status < 299) {
                        if ($modalStore[0].response) {
                            $modalStore[0].response(true);
                        }
                        modalStore.clear();
                        modalStore.trigger(TurnoCancelado);
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
		<header class={cHeader}>Cancelar el turno</header>
		<article>¿Está seguro de cancelar el turno con fecha {turnoInfo.fecha.toString().slice(0,10)}? </article>

			<button type="button" class="btn {buttonNeutral}" on:click={onClose}>Cancelar</button>
			<button type="button" class="btn {buttonPositive}" on:click={onConfirm}>Confirmar</button>
		<footer class="modal-footer {parent.regionFooter}">

    </footer>
	</div>
{/if}
