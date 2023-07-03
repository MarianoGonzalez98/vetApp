<script lang="ts">
    import type { Perdida } from '$lib/interfaces/Perdidas.interface';
    import { backendURL } from '$lib/utils/constantFactory';



	// Props
	/** Exposes parent props to this component. */
	export let parent: any;
	export let publicacion:Perdida;

	// Stores
	import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';


	
	async function onConfirm() {
		await fetch(`${backendURL}/perdidas/marcar-encontrado`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    id:publicacion.id,
                })
            }).then( (res) => {
                if (res.status < 299) {  //si entra acá no hubo error
					if ($modalStore[0].response) {
						$modalStore[0].response(true);
					}
                    modalStore.clear();
                    modalStore.trigger(perroMarcadoEncontradoModal);
                    return res;
                }
                return Promise.reject(res);
            }).catch( (e)  => {
                console.log(e);
                modalStore.clear();
                modalStore.trigger(fallaDesconocida);
        });
	}

    const perroMarcadoEncontradoModal: ModalSettings = {
        type: "alert",
        title: "Perro marcado encontrado",
        body: "Se ha marcado correctamente encontrado al perro seleccionado",
        buttonTextCancel: "Ok",
		//response: () => location.reload(),
    };


	const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Error desconocido",
        body: "No se pudo realizar la marcación",
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
		<article>¿Está seguro de marcar el perro {publicacion.nombrePerro} como encontrado?</article>

			<button type="button" class="btn {buttonNeutral}" on:click={onClose}>Cancelar</button>
			<button type="button" class="btn {buttonPositive}" on:click={onConfirm}>Confirmar</button>
		<footer class="modal-footer {parent.regionFooter}">

    </footer>
	</div>
{/if}
