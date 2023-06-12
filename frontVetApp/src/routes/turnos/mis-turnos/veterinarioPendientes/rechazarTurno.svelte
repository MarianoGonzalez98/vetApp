<script lang="ts">
    import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
    import { backendURL } from '$lib/utils/constantFactory';

	// Props
	/** Exposes parent props to this component. */
	export let parent: any;
	export let idTurnoSelec:number;
    let justificacion:string;   

    
    const TurnoRechazado: ModalSettings = {
        type: 'alert',
        title: 'Turno rechazado',
        body: 'Turno rechazado, se enviará al cliente su justificación',
        buttonTextCancel: "Ok",
        response: () => location.reload() 
    };

    const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Fallo en la solicitud del turno",
        body: "No se pudo solicitar el nuevo turno",
        buttonTextCancel: "Ok",
    };
    const fallaServidor: ModalSettings = {
        type: "alert",
        title: "Fallo en actualizacion del perfil",
        body: "Falla del servidor",
        buttonTextCancel: "Ok",
    };
    
    

    async function onFormSubmit() {
        await fetch(`${backendURL}/turnos/rechazar-turno`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    idTurnoSelec:idTurnoSelec,
                    justificacion:justificacion
                })
            })
            .then((res) => {
                if (res.status < 299) {
                    modalStore.clear();
                    modalStore.trigger(TurnoRechazado);
                    return res;
                }
                if (res.status === 500) {
                    modalStore.clear();
                    modalStore.trigger(fallaServidor);
                    return res;
                }
            })
            .catch((error) => {
                    modalStore.clear();
                    modalStore.trigger(fallaDesconocida);
                    console.log("Error en el rechazo del turno desconocido: ", error);
            }); 
	}

    // Base Classes
    const cBase = "card p-4 w-modal shadow-xl space-y-4";
    const cHeader = "text-2xl font-bold";
    const cForm =
        "border border-surface-500 p-4 space-y-4 rounded-container-token";
   
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>Rechazar el turno</header>
		
        <form class="modal-form {cForm}" on:submit|preventDefault={onFormSubmit}>  
            <label class="label">
				<span>Ingrese una justificación</span>
				<input class="input" bind:value={justificacion} type="text" required/>
			</label>

            <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>Cancelar</button>
            <button class="btn {parent.buttonPositive}" type="submit">Aceptar</button>
        </form>

	</div>
{/if}
