<script lang="ts">
    import { goto } from "$app/navigation";
    import type { ModalSettings } from "@skeletonlabs/skeleton";
    import { Modal,modalStore } from '@skeletonlabs/skeleton';
    import { error } from "@sveltejs/kit";



    const fallaDesconocida: ModalSettings = {
	type: 'alert',
	title: 'Fallo del cambio de contraseña',
	body: 'No se pudo realizar el cambio de contraseña.',
    };

    const fallaMismoPass: ModalSettings = {
	type: 'alert',
	title: 'Fallo del cambio de contraseña',
	body: `No se pudo realizar el cambio de contraseña: la contraseña ingresada debe ser diferente a la actual.`,
    buttonTextCancel:'Ok',
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
            body: JSON.stringify({password:password})
        })
        .then( (res) => {
            if (res.status<299){
                console.log("changePass RESPONSE:"+res);
                //falta validar con regex que cumple los requisitos de caracteres
                modalStore.clear();
                modalStore.trigger(cambioHecho);
                return res.json();
            }
            if (res.status === 409){
                modalStore.clear();
                modalStore.trigger(fallaMismoPass);
                return res;
            }
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
        <label class="label" for="password">Nueva contraseña: </label>
        <input bind:value={password} class="input max-w-md" type="password" placeholder="Ingrese su nueva contraseña" name="password" required>
        <button class="btn rounded-lg variant-filled" type="submit">Cambiar contraseña</button>
    </form>

</div>