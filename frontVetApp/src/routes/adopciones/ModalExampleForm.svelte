<script lang="ts">
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;
	export let datos:any

	// Stores
	import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';

	// Form Data
	const formData = {
		nombreApellido: datos.nombreApellido,
		telefono: datos.telefono,
		email: datos.email,
	};
	
	// We've created a custom submit function to pass the response and close the modal.
	async function onFormSubmit() {
		console.log(datos);
		await new Promise((resolve, reject) => { //esto seria el fetch
			setTimeout(() => resolve("done!"), 1000)
		});

		modalStore.close();
		//if fetch fue correcto
		modalStore.trigger(ContactoRealizadoModal);

		//if hubo error en el fetch
		modalStore.trigger(ContactoFallidoModal);
	}


	const ContactoRealizadoModal: ModalSettings = {
        type: 'alert',
        title: 'Contacto realizado',
        body: 'Se ha enviado un correo con sus datos a la direccion de email de la publicación',
        buttonTextCancel: "Ok",
    };

	const ContactoFallidoModal: ModalSettings = {
        type: 'alert',
        title: 'Contacto fallido',
        body: 'No se pudo realizar el contacto.',
        buttonTextCancel: "Ok",
    };
	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<slot></slot>
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>Contactar a un paseador</header>
		<article>Ingrese sus datos de contacto:</article>

		<form class="modal-form {cForm}">
			<label class="label">
				<span>Apellido y nombre</span>
				<input class="input" type="text" bind:value={formData.nombreApellido} placeholder="Ingrese su apellido y nombre" />
			</label>
			<label class="label">
				<span>Teléfono</span>
				<input class="input" type="tel" bind:value={formData.telefono} placeholder="Ingrese su teléfono" />
			</label>
			<label class="label">
				<span>Email</span>
				<input class="input" type="email" bind:value={formData.email} placeholder="Ingrese su email" />
			</label>
		</form>

		<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Submit Form</button>
    </footer>
	</div>
{/if}
