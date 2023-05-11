<script lang="ts">
    import { goto } from "$app/navigation";
    import type { LoginData, ApiResponse } from "$lib/interfaces/ApiResponse.interface";
    import type { UserData } from "$lib/interfaces/User.interface";
    import { user } from "$lib/stores/user";
    import type { ModalSettings } from "@skeletonlabs/skeleton";
    import { Modal,modalStore } from '@skeletonlabs/skeleton';
    let email = '';
    let password = '';
    let currentError='';
    const emailPattern:string = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[\.][a-zA-Z]{2,}$";

    const fallaAuth: ModalSettings = {
	type: 'alert',
	title: 'Fallo del inicio de sesión',
	body: 'Email/contraseña incorrectos',
    buttonTextCancel:'Ok',
    };

    const fallaDesconocida: ModalSettings = {
	type: 'alert',
	title: 'Fallo del inicio de sesión',
	body: 'Posible problema del servidor',
    buttonTextCancel:'Ok',
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
        .then((res) => { //primer then es para trabajar con los headers que primero se devuelvel
            if (res.status < 299) {  //si entra acá no hubo error
                return res.json()
            }
            currentError = "Falla en autenticacion. Satus error: ",res.status;
            modalStore.clear();
            modalStore.trigger(fallaAuth);
            console.log(currentError);
        })
        .then((resp:ApiResponse<LoginData<UserData>>)=>{ //si no hay ningun error, sigue con el contenido del fetch
            if (resp) {
                user.update(val => val ={...(resp.data.userData)});
                localStorage.setItem('user',JSON.stringify(resp.data.userData));
                if (!resp.data.userData.seCambioPassword){
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
        <input bind:value={email} class="input" type="text" title="Ingrese un mail valido" placeholder="Ingrese su email" name="email" pattern={emailPattern} required>

        <label class="label" for="password">Contraseña</label>
        <input bind:value={password} class="input" type="password" placeholder="Ingrese contraseña" name="password" required>

        <button class="btn rounded-lg variant-filled" type="submit">Login</button>
    </form>

</div>