<script lang="ts">

    import { modalStore, type ModalSettings } from "@skeletonlabs/skeleton";
    import RechazarTurno from "../veterinarioPendientes/rechazarTurno.svelte";

    export let parent: any;
    export let idTurnoSelec:number;
    export let turnoFecha:Date;

	async function onConfirm() {
            let modalComponent = {
                ref: RechazarTurno,
                props: { idTurnoSelec:idTurnoSelec},
            };
            
            let modalConfirm: ModalSettings = { 
                type: 'component',
                // Pass the component directly:
                component: modalComponent,
                response: (confirmo: any) => {
                },
            };
            modalStore.clear();
            modalStore.trigger(modalConfirm);
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
		<header class={cHeader}>Rechazar el turno</header>
		<article>¿Está seguro de rechazar el turno con fecha {turnoFecha.toString().slice(0,10)}? </article>

			<button type="button" class="btn {buttonNeutral}" on:click={onClose}>Cancelar</button>
			<button type="button" class="btn {buttonPositive}" on:click={onConfirm}>Confirmar</button>
		<footer class="modal-footer {parent.regionFooter}">

    </footer>
	</div>
{/if}