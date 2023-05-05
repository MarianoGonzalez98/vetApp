<script lang="ts">
    import { goto } from "$app/navigation";
    import { user } from "$lib/stores/user";
    import type { ModalSettings } from "@skeletonlabs/skeleton";
    import { Modal,modalStore } from '@skeletonlabs/skeleton';



    const fallaDesconocida: ModalSettings = {
	type: 'alert',
	title: 'Fallo del cambio de contraseña',
	body: 'Posible problema del servidor.',
    };

    const cambioHecho: ModalSettings = {
	type: 'alert',
	title: 'Contraseña cambiada',
	body: 'Cambio de contraseña realizada.',
    buttonTextCancel:'Ok',
    response: (r: boolean) => goto('/'),
    };

    let password='';
    
    const changePass = () => {
        fetch('http://localhost:3000/changePass',{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({email:$user?.email, password:password})
        })
        .then( (res:Response) => {
            modalStore.clear();
            modalStore.trigger(cambioHecho);

        })
        .catch((error) => {
            modalStore.clear();
            modalStore.trigger(fallaDesconocida);
            console.log("Error de cambio de contraseña: ",error);
        })
    }
</script>

<Modal />
<div class="container h-full mx-auto justify-center items-center">
    <form on:submit|preventDefault={changePass} class='space-y-2 mx-20 mt-10'>
        <h4>Es su primera vez iniciando sesión. Realice un cambio de contraseña.</h4>
        <label class="label" for="password">Nueva contraseña: </label>
        <input bind:value={password} class="input max-w-md" type="password" placeholder="Ingrese su nueva contraseña" name="password" required>
    </form>

</div>