<script lang="ts">
    import { goto } from "$app/navigation";
    import { user } from "$lib/stores/user";
    import { backendURL } from "$lib/utils/constantFactory";
    import type { ModalSettings, PopupSettings } from "@skeletonlabs/skeleton";
    import { Modal,modalStore,popup} from '@skeletonlabs/skeleton';

    let errorMsj='';
    let errorMsj2='';
    let errorClass = '';
    const passRegex = "(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[~\?!'¡@\`\´#$\"¿%^&*_=+\\-]).{6,32}"

    let isVisible = false;
    $: type = isVisible ? "text" : "password";

    const toggleVisibility = () => {
        isVisible = !isVisible;
    };
    function handleInputPass1(e:any) {
        password = e.target.value;
    }
    function handleInputPass2(e:any) {
        password2 = e.target.value;
    }

    const popupFocusBlur: PopupSettings = {
	event: 'focus-blur',
	target: 'targetPopup',
	placement: 'top'
    };

    const cambioHecho: ModalSettings = {
	type: 'alert',
	title: 'Contraseña cambiada',
	body: 'Cambio de contraseña realizada.',
    buttonTextCancel:'Ok',
    response: (r: boolean) => goto('/'),
    };

    let password='';
    let password2='';
    
    const changePass = () => {
        errorMsj = '';
        errorMsj2 = '';
        if (!(password === password2)){
            errorMsj2 = "Revise que coincida la contraseña"
            return
        }
        fetch(`${backendURL}/changePass`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({password:password})
        })
        .then( (res) => {
            if (res.status<299){
                modalStore.clear();
                modalStore.trigger(cambioHecho);
                if($user!=null) { //para que ts no joda
                    $user.seCambioPassword=true;
                }
                errorMsj='';
                return res.text();
            }
            if (res.status === 409){
                modalStore.clear();
                errorMsj="La nueva contraseña debe ser diferente a la actual";
                //errorClass="invalid:border-red-500 valid:border-red-500"; lo saco porque si no queda rojo hasta que vuelva a hacer submit
                return res.text();
            }
            if (res.status === 400){ //error por modificacion del token jwt.
                $user=null;
                goto('/auth/login');
                return res.text();
            }
        })
        .then( (res) => {
            console.log(res)
        })
        .catch((e) => {
            modalStore.clear();
            errorMsj="Error desconocido";
            errorClass="";
            //modalStore.trigger(fallaDesconocida);
            console.log("Error de cambio de contraseña: ",e);
        })
    }
</script>

<!-- POPUP (no importa donde se encuentre este div creo)------------ -->
<div class="card p-4 variant-filled" data-popup="targetPopup">
    <span>Debe tener 6 carácteres, al menos un número y un carácter especial</span>
    <div class="arrow variant-filled" />
</div>
<!-- FIN POPUP------------ -->


<Modal />
<div class="container h-full mx-auto justify-center items-center">
    <form on:submit|preventDefault={changePass} class='space-y-2 mx-20 mt-10'>
        <label class="label" for="password">Nueva contraseña: </label>
        <div>
            <input on:input={handleInputPass1} class="input max-w-md focus:invalid:border-red-500 {errorClass}"  pattern={passRegex} use:popup={popupFocusBlur} {type} placeholder="Ingrese su nueva contraseña" name="password" required>
            <p class="text-red-500">{errorMsj}</p>
        </div>
        <label class="label" for="password2">Confirme su nueva contraseña: </label>
        <div>
            <input on:input={handleInputPass2} pattern={passRegex} class="input max-w-md focus:invalid:border-red-500" {type} placeholder="Repita la contraseña" name="password2" required>
            <p class="text-red-500">{errorMsj2}</p>
        </div>
        <div class="flex content-center">
            <input class="checkbox self-center mr-2" on:change={toggleVisibility} type=checkbox name="toggle" id="toggle">
            <label for="toggle" >Mostrar contraseña</label>
        </div>

        <button class="btn rounded-lg variant-filled" type="submit">Cambiar contraseña</button>
    </form>

</div>
