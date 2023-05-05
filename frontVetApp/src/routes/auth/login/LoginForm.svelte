<script lang="ts">
    import { goto } from "$app/navigation";
    import type { LoginData, ApiResponse } from "$lib/interfaces/ApiResponse.interface";
    import type { UserData } from "$lib/interfaces/User.interface";
    import { user } from "$lib/stores/user";
    import type { ModalSettings } from "@skeletonlabs/skeleton";
    import { Modal,modalStore } from '@skeletonlabs/skeleton';
    import { error } from "@sveltejs/kit";
    let email = '';
    let password = '';
    let currentError='';

    const fallaAuth: ModalSettings = {
	type: 'alert',
	title: 'Fallo del inicio de sesión',
	body: 'Email/contraseña incorrectos',
    };

    const fallaDesconocida: ModalSettings = {
	type: 'alert',
	title: 'Fallo del inicio de sesión',
	body: 'Posible problema del servidor',
    };

    const handleLogin = async () =>{        
	    let cookies = document.cookie;
        console.log(cookies);
        fetch('http://localhost:3000/login',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({email:email, password:password})
        })
        .then((res) => {
            if (res.status < 299) {  //si entra acá no hubo error
                return res.json()
            }
            currentError = "Falla en autenticacion. Satus error: ",res.status;
            modalStore.clear();
            modalStore.trigger(fallaAuth);
            console.log(currentError);
        })
        .then((resp:ApiResponse<LoginData<UserData>>)=>{ //si no hay ningun error
            if (resp) {
                user.update(val => val ={...(resp.data.userData)});
                localStorage.setItem('user',JSON.stringify(resp.data.userData));
                if (!resp.data.userData.primerLoginHecho){
                    goto('/auth/cambiar-password/');
                    return
                }
                goto('/');
            }
        })
        .catch((error) => {
            modalStore.clear();
            modalStore.trigger(fallaDesconocida);
            currentError="server is down";
            console.log("Error login in: ",error);
        })
    }
</script>


<Modal />

<div class="container h-full mx-auto flex justify-center items-center">
    <form on:submit|preventDefault={handleLogin} class="space-y-2">
        <label class="label" for="email">Email</label>
        <input bind:value={email} class="input" type="text" placeholder="Ingrese su email" name="email" required>

        <label class="label" for="password">Contraseña</label>
        <input bind:value={password} class="input" type="password" placeholder="Ingrese contraseña" name="password" required>

        <button class="btn rounded-lg variant-filled" type="submit">Login</button>
    </form>

    {#if $user}
        {$user.email}
    {/if}

</div>