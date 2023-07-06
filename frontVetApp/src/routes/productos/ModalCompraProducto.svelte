
<svelte:head>
	<script src="https://sdk.mercadopago.com/js/v2"></script>
</svelte:head>

<script lang="ts">
    import type { ItemCarrito } from '$lib/interfaces/Carrito.interface';
    import { productosCarrito } from '$lib/stores/carrito';
    import { user } from '$lib/stores/user';
    import { backendURL, emailPatternFactory } from '$lib/utils/constantFactory';
	import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
    import { createEventDispatcher } from 'svelte';
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;
	export let itemsCarrito:ItemCarrito[];
	export let dispatchEvent:any

	let emailComprador= $user?.email || "";
    let emailDisabled = false;

	async function getPreferenceId(){
		const res = await fetch(`${backendURL}/create_prefrerence_compraProductos`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body:JSON.stringify({
				productosAComprar:itemsCarrito.map( item => ({
					idProducto:item.idProducto,
					cant:item.cant,
				})),
				emailComprador:emailComprador,
			})
		});
		const json = await res.json();

		if (res.ok){
			dispatchEvent();
			$productosCarrito = [];
			if (json.status==='out_of_stock'){
				modalStore.clear();
				modalStore.trigger(fallaStock);
				console.log("NO HAY STOCK")
				return -1;
			}
			return json.id;
		} else {
			throw new Error(json);
		}
	}
	const createMercadoPagoButton = async () => {
        let preferenceIdResponse = await getPreferenceId();
		if (preferenceIdResponse===-1){
			return;
		}
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
		if (!emailDisabled){
			emailDisabled = true;
			await createMercadoPagoButton()
		}
    }

    const fallaStock: ModalSettings = {
        type: "alert",
        title: "Sin stock",
        body: "No hay stock suficiente para uno de sus productos elegidos. Por favor, vuelva a seleccionar los productos que desee comprar",
        buttonTextCancel: "Ok",
    };

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
		<header class={cHeader}>Realizar compra de productos</header>
		<article> Se reservarán sus productos seleccionados durante 5 minutos. Dispone de ese tiempo para realizar el pago a través de Mercado pago.</article>
			<form action="" on:submit|preventDefault={onConfirm}>
				{#if (!$user)}
					<label for="">Su email:</label>
					<input class="input focus:invalid:border-red-500 mb-2" bind:value={emailComprador} disabled={emailDisabled} type="text" title="Ingrese un email válido" required pattern={emailPatternFactory} placeholder="Ingrese su email. Ej: miEmail@gmail.com">
				{/if}
				<button type="button" class="btn {buttonNeutral}" on:click={onClose}>Cancelar</button>
				<button type="submit" class="btn {buttonPositive}" >Confirmar compra</button>
			</form>
		<footer class="modal-footer {parent.regionFooter}">

    </footer>
	<div id="wallet_container"></div> <!-- boton de mercadoPago -->
	</div>
{/if}
