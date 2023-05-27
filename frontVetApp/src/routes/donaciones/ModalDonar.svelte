<script lang="ts">
    import type { PublicacionAdopcion } from '$lib/interfaces/Adopciones.interface';
    import type { Campaign } from '$lib/interfaces/Donaciones.interface';
    import type { Id } from '$lib/interfaces/Id.interface';
	import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;
	export let campaign:Campaign;
    let monto=100;
    let montoInputDisabled = false;

    const onConfirm = () => {
        montoInputDisabled = true;
    }


	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	let buttonNeutral = 'variant-ghost-surface';

	let buttonPositive = 'variant-filled';
	
	function onClose(): void {
		if ($modalStore[0].response) $modalStore[0].response(false);
		modalStore.close();
	}
</script>


{#if $modalStore[0]}
	<slot></slot>
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>Donar a campaña {campaign.nombre}</header>
		<article>Ingrese el monto que desea donar en pesos Argentinos</article>
            <input class="input" bind:value={monto} disabled={montoInputDisabled} type="number">
			<button type="button" class="btn {buttonNeutral}" on:click={onClose}>Cancelar</button>
			<button type="button" class="btn {buttonPositive}" on:click={onConfirm}>Confirmar monto</button>
		<footer class="modal-footer {parent.regionFooter}">

    </footer>
	</div>
{/if}
