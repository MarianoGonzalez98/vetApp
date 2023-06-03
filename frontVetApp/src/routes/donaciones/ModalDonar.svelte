
<svelte:head>
	<script src="https://sdk.mercadopago.com/js/v2"></script>
	<!--   <script src="https://sdk.mercadopago.com/js/v2" on:load={initializeRemarkable}></script> -->
</svelte:head>


<script lang="ts">
    import type { PublicacionAdopcion } from '$lib/interfaces/Adopciones.interface';
    import type { Campaign } from '$lib/interfaces/Donaciones.interface';
    import type { Id } from '$lib/interfaces/Id.interface';
    import { user } from '$lib/stores/user';
    import { backendURL } from '$lib/utils/constantFactory';
	import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;
	export let campaign:Campaign;
    let monto=100;
	let emailDonante= $user?.email || "";
    let montoInputDisabled = false;

	async function getPreferenceId(){
		const res = await fetch(`${backendURL}/create_preference_donacion`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body:JSON.stringify({
				monto:Number(monto),
				campaign:campaign,
				emailDonante:emailDonante,
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
        const mp = new MercadoPago('APP_USR-22da8af9-1320-49f0-a159-4ca8370a1414', {
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
			<label for="">Monto:</label>
            <input class="input" bind:value={monto} disabled={montoInputDisabled} type="number" required>
			{#if (!$user)}
				<label for="">Su email:</label>
				<input class="input" bind:value={emailDonante} disabled={montoInputDisabled} type="text" required>
			{/if}
			<button type="button" class="btn {buttonNeutral}" on:click={onClose}>Cancelar</button>
			<button type="button" class="btn {buttonPositive}" on:click={onConfirm}>Confirmar monto</button>
		<footer class="modal-footer {parent.regionFooter}">

    </footer>
	<div id="wallet_container"></div> <!-- boton de mercadoPago -->
	</div>
{/if}
