<script lang="ts">
    import { goto } from "$app/navigation";
    import { user } from "$lib/stores/user";
    import { popup, type ModalSettings, type PopupSettings } from "@skeletonlabs/skeleton";
    import { Modal,modalStore } from '@skeletonlabs/skeleton';

    let submittedClass='';
    const emailPattern:string = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[\.][a-zA-Z]{2,}$";
    const letrasEspaciosPattern:string = "^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ]+$"
    
    const numbersPattern:string = "^[0-9]*$"
    let emailErrorMsj='';
    
    const clienteCargado: ModalSettings = {
	type: 'alert',
	title: 'Cliente cargado',
	body: 'Cliente registrado correctamente',
    buttonTextCancel:'Ok',
    response: (r: boolean) => goto('/'),
    };

    const fallaDesconocida: ModalSettings = {
	type: 'alert',
	title: 'Error desconocido',
	body: 'No se pudo registrar el nuevo cliente',
    buttonTextCancel:'Ok',
    };

    const fallaServidor: ModalSettings = {
	type: 'alert',
	title: 'Fallo de la carga del cliente',
	body: 'Falla del servidor',
    buttonTextCancel:'Ok',
    };

    const popupFocusBlur: PopupSettings = {
	event: 'focus',
	target: 'popupFocusBlur',
	placement: 'top'
    };

    let nombre= '';
    let apellido = '';
    let email = '';
    let dni = '';
    let direccion = '';
    let telefono = '';
    let fechaNacimiento: string //
    let fechaMax:string = new Date().toJSON().slice(0,10);

    const handleCarga = () => {
        fetch('http://localhost:3000/registrar-cliente',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({nombre,apellido,email,dni,direccion,telefono,fechaNacimiento,foto:null})
        }).then( (res) => {
            if (res.status<299){
                modalStore.clear();
                modalStore.trigger(clienteCargado);
                return res;
            }
            if (res.status === 400){ //error por modificacion del token jwt.
                $user=null;
                goto('/auth/login');
                return;
            }
            if (res.status === 409){
                emailErrorMsj = "El email ya se encuentra registrado";
                return res;
            }
            if (res.status === 500){
                modalStore.clear();
                modalStore.trigger(fallaServidor);
                return res;
            }
        }).catch((error) => {
            modalStore.clear();
            modalStore.trigger(fallaDesconocida);
            console.log("Error en carga del cliente desconocido: ",error);
        });
    }

</script>

<Modal></Modal>

<div class="container mt-2 mb-10 h-full mx-auto flex justify-center items-center ">
    <form on:submit|preventDefault={handleCarga} class="space-y-2 {submittedClass}">
        <label class="label" for="nombre">Nombre:</label>
        <input bind:value={nombre} class="input focus:invalid:border-red-500" type="text" placeholder="Ingrese nombre del cliente" name="nombre" pattern={letrasEspaciosPattern} required>

        <label class="label" for="apellido">Apellido:</label>
        <input bind:value={apellido} class="input focus:invalid:border-red-500" type="text" placeholder="Ingrese apellido del cliente" name="apellido" pattern={letrasEspaciosPattern} required>

        <label class="label" for="email">Email:</label>
        <input pattern={emailPattern} title="Ingrese un mail valido" bind:value={email} class="input focus:invalid:border-red-500" type="text" placeholder="email del cliente. Ej: unCliente@gmail.com" name="email" required>
        <p class="text-red-500">{emailErrorMsj}</p>

        
        <label class="label" for="dni">Teléfono:</label>
        <input bind:value={telefono} class="input focus:invalid:border-red-500" type="text" placeholder="Ingrese teléfono del cliente" use:popup={popupFocusBlur} name="telefono" pattern={numbersPattern} required>

        <div class="card p-4 variant-filled" data-popup="popupFocusBlur">
            <p>Sólo números</p>
            <div class="arrow variant-filled" />
        </div>

        <label class="label" for="dni">DNI:</label>
        <input bind:value={dni} class="input focus:invalid:border-red-500" type="text" max="9999999999" placeholder="Ingrese dni del cliente" name="dni"  autocomplete="off" pattern={numbersPattern} required>



        <label class="label" for="fechaNacimiento">Fecha de nacimiento:</label>
        <input bind:value={fechaNacimiento}  class="input" type="date" placeholder="Ingrese fecha de nacimiento del cliente" name="fechaNacimiento" max={fechaMax} required>

        <label class="label" for="direccion">Dirección:</label>
        <input bind:value={direccion} class="input focus:invalid:border-red-500" type="text" placeholder="Ingrese dirección del cliente" name="direccion" required>


        <button class="btn rounded-lg variant-filled-primary" type="submit">Registrar cliente</button>
    </form>
</div>

