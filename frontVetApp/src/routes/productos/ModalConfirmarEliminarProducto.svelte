<script lang="ts">

    import type { Producto } from '$lib/interfaces/Producto.interface';
    import { backendURL } from '$lib/utils/constantFactory';



	// Props
	/** Exposes parent props to this component. */
	export let parent: any;
	export let prod:Producto;

	// Stores
	import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';


	
	async function onConfirm() {
		await fetch(`${backendURL}/productos/${prod.id}`,{
                method:'DELETE',
                headers:{
                    'Content-Type':'application/json',
                },
                credentials: 'include'
            }).then( (res) => {
                if (res.status < 299) {  //si entra acá no hubo error
					if ($modalStore[0].response) {
						$modalStore[0].response(true);
					}
                    modalStore.clear();
                    modalStore.trigger(productoEliminadoModal);
                    return res;
                }
                return Promise.reject(res);
            }).catch( (e)  => {
                console.log(e);
                modalStore.clear();
                modalStore.trigger(fallaDesconocida);
        });
	}

    const productoEliminadoModal: ModalSettings = {
        type: "alert",
        title: "Producto eliminado",
        body: `Se ha eliminado el producto ${prod.nombre} marca ${prod.marca}`,
        buttonTextCancel: "Ok",
		response: () => location.reload(),
    };


	const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Error desconocido",
        body: "No se pudo eliminar el producto",
        buttonTextCancel: "Ok",
    };

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
		<header class={cHeader}>Confirme su acción</header>
		<article>¿Está seguro de eliminar el producto {prod.nombre} marca {prod.marca}?</article>
			<button type="button" class="btn {buttonNeutral}" on:click={onClose}>Cancelar</button>
			<button type="button" class="btn {buttonPositive}" on:click={onConfirm}>Confirmar</button>
		<footer class="modal-footer {parent.regionFooter}">

    </footer>
	</div>
{/if}
