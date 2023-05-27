
<svelte:head>
	<script src="https://sdk.mercadopago.com/js/v2"></script>
	<!--   <script src="https://sdk.mercadopago.com/js/v2" on:load={initializeRemarkable}></script> -->
</svelte:head>


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

	async function getPreferenceId(){
		const res = await fetch(`http://localhost:3000/create_preference_donacion`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body:JSON.stringify({
				monto:Number(monto),
				campaign:campaign,
			})
		});
		const json = await res.json();

		if (res.ok){
			return json.id;
		} else {
			throw new Error(json);
		}
	}
	const createMercadoPagoButton = async () => {
        let preferenceIdResponse = await getPreferenceId();
        const preferenceId = await preferenceIdResponse;
          // @ts-ignore
        const mp = new MercadoPago('TEST-31b0da2a-cecf-4c04-9602-8ac2e8df1590', {
		locale: 'es-AR',
	})

        console.log(mp);
        const bricksBuilder = mp.bricks(); //creo que se puede borrar
        mp.bricks().create("wallet", "wallet_container", {
            initialization: {
				preferenceId: preferenceId,
            },
		});
	}

    const onConfirm = async () => {
        montoInputDisabled = true;
		await createMercadoPagoButton()
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
	<div id="wallet_container"></div> <!-- boton de mercadoPago -->
	</div>
{/if}
