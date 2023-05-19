<script lang="ts">
    import type { PublicacionAdopcion } from '$lib/interfaces/Adopciones.interface';

	// Props
	/** Exposes parent props to this component. */
	export let parent: any;
	export let datosParaContacto:any
	export let publicacion:PublicacionAdopcion;

	// Stores
	import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';

	// Form Data
	const formData = {
		nombreApellido: datosParaContacto.nombreApellido,
		telefono: datosParaContacto.telefono,
		email: datosParaContacto.email,
	};
	
	async function onFormSubmit() {
		await fetch('http://localhost:3000/send-mail',{
			method:'POST',
			headers:{
				'Content-Type':'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({
				emailData: {
					emailDestino:publicacion.email,
					asunto:"Alguien quiere contactarse por su publicacion",
					cuerpo:`Alguien se ha contacado con usted por su publicacion del perro ${publicacion.nombre} disponible para adoptar. <br>
					Los datos de contacto del interesado son: <br>
					<br>
					Apellido y nombre: ${formData.nombreApellido}<br>
					Email: ${formData.email}<br>
					Teléfono: ${formData.telefono} <br>
					`,
				}
			}),
        }).then((res) => {
                if (res.status < 299) {
					modalStore.close();
					modalStore.trigger(ContactoRealizadoModal);
                }
                if (res.status === 500) {
                    modalStore.clear();
                    modalStore.trigger(fallaServidor);
                }
				if (res.status === 424) {
                    modalStore.clear();
                    modalStore.trigger(ContactoFallidoModal);
                }
				return res;
            })
            .catch((err) => {
                modalStore.clear();
                modalStore.trigger(fallaDesconocida);
                console.log("Error en el contacto: ", err);
            });
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
        body: 'No se pudo realizar el contacto. Hubo una falla en el envio del mail',
        buttonTextCancel: "Ok",
    };

	const fallaServidor: ModalSettings = {
        type: "alert",
        title: "Fallo de la carga del cliente",
        body: "Falla del servidor",
        buttonTextCancel: "Ok",
    };

	const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Error desconocido",
        body: "No se pudo realizar el contacto",
        buttonTextCancel: "Ok",
    };
	// Base Classes for css
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
