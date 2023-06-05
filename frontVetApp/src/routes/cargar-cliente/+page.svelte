<script lang="ts">
    import { afterNavigate, beforeNavigate, goto } from "$app/navigation";
    import { navigating } from "$app/stores";
    import { dataRegistroCliente } from "$lib/stores/dataRegistroCliente";
    import { user } from "$lib/stores/user";
    import { backendURL, emailPatternFactory, letrasEspaciosPatternFactory, numbersPatternFactory } from "$lib/utils/constantFactory";
    import {
        popup,
        type ModalSettings,
        type PopupSettings,
    } from "@skeletonlabs/skeleton";
    import { Modal, modalStore } from "@skeletonlabs/skeleton";
    import type { AfterNavigate, BeforeNavigate } from "@sveltejs/kit";

    let validNavigation=false;

	beforeNavigate((nav:BeforeNavigate) => {
        if (nav?.to?.route){
            if (nav.to.route.id ==='/cargar-perro'){
                $dataRegistroCliente={
                    nombre:nombre,
                    apellido:apellido,
                    email:email,
                    dni : dni,
                    direccion: direccion,
                    telefono: telefono,
                    fechaNacimiento:fechaNacimiento,
                }
            }
        }
    });


    afterNavigate((nav:AfterNavigate) => {
        if (($user?.rol==='veterinario') /* &&(nav.from?.route.id ==='/cargar-perro') */){
            console.log($dataRegistroCliente);
            if ($dataRegistroCliente){
                nombre=$dataRegistroCliente.nombre;
                apellido=$dataRegistroCliente.apellido;
                email=$dataRegistroCliente.email;
                dni=$dataRegistroCliente.dni;
                direccion=$dataRegistroCliente.direccion;
                telefono=$dataRegistroCliente.telefono;
                fechaNacimiento=$dataRegistroCliente.fechaNacimiento;
            }
        }
    });
    let submittedClass = "";
    let emailErrorMsj = "";
    let dniErrorMsj = "";

    const clienteCargado: ModalSettings = {
        type: "alert",
        title: "Cliente cargado",
        body: "Cliente registrado correctamente",
        buttonTextCancel: "Ok",
        response: (r: boolean) => goto("/"),
    };

    const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Error desconocido",
        body: "No se pudo registrar el nuevo cliente",
        buttonTextCancel: "Ok",
    };

    const fallaServidor: ModalSettings = {
        type: "alert",
        title: "Fallo de la carga del cliente",
        body: "Falla del servidor",
        buttonTextCancel: "Ok",
    };

    const popupFocusBlur: PopupSettings = {
        event: "focus-blur",
        target: "popupFocusBlur",
        placement: "top",
    };

    let nombre = "";
    let apellido = "";
    let email = "";
    let dni = "";
    let direccion = "";
    let telefono = "";
    let fechaNacimiento: string; //
    let fechaMax: string = new Date().toJSON().slice(0, 10);

    const handleRegistro =async () => {
        let error:boolean=false;
        dniErrorMsj = '';
        emailErrorMsj = '';
        await fetch(`${backendURL}/existeUsuarioConEmail`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                email:email,
            }),
        })
            .then((res) => {
                if (res.status < 299) {
                    emailErrorMsj='';
                    dniErrorMsj = '';
                }
                if (res.status === 400) {
                    //error por modificacion del token jwt.
                    $user = null;
                    goto("/auth/login");
                    error=true;
                    return;
                }
                if (res.status === 409) {
                    emailErrorMsj = "El email ya se encuentra registrado";
                    error=true;
                    return res;
                }
                if (res.status === 500) {
                    error=true;
                    modalStore.clear();
                    modalStore.trigger(fallaServidor);
                    return res;
                }
            })
            .catch((err) => {
                modalStore.clear();
                modalStore.trigger(fallaDesconocida);
                console.log("Error en carga del cliente desconocido: ", err);
            });


            await fetch(`${backendURL}/existeUsuarioConDni`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                dni:dni,
            }),
        })
            .then((res) => {
                if (res.status < 299) {
                    dniErrorMsj='';
                }
                if (res.status === 400) {
                    //error por modificacion del token jwt.
                    $user = null;
                    goto("/auth/login");
                    error=true;
                    return;
                }
                if (res.status === 409) {
                    dniErrorMsj = "El dni ya se encuentra registrado";
                    error=true;
                    return res;
                }
                if (res.status === 500) {
                    error=true;
                    modalStore.clear();
                    modalStore.trigger(fallaServidor);
                    return res;
                }
            })
            .catch((err) => {
                modalStore.clear();
                modalStore.trigger(fallaDesconocida);
                console.log("Error en carga del cliente desconocido: ", err);
            });

            if (error){
                return
            }

            goto('/cargar-perro');
    };
</script>

<Modal />
<div class="flex justify-center">
    <h1 class="h1 mt-5 font-medium">Cargar nuevo cliente</h1>
</div>

<div
    class="container mt-5 mb-1 h-full mx-auto flex justify-center items-center"
>
    <form
        on:submit|preventDefault={handleRegistro}
        class="space-y-2 mb-2 {submittedClass}"
    >
        <label class="label" for="nombre">Nombre:</label>
        <input
            bind:value={nombre}
            class="input focus:invalid:border-red-500"
            type="text"
            placeholder="Ingrese nombre del cliente"
            name="nombre"
            pattern={letrasEspaciosPatternFactory}
            required
        />

        <label class="label" for="apellido">Apellido:</label>
        <input
            bind:value={apellido}
            class="input focus:invalid:border-red-500"
            type="text"
            placeholder="Ingrese apellido del cliente"
            name="apellido"
            pattern={letrasEspaciosPatternFactory}
            required
        />

        <label class="label" for="email">Email:</label>
        <input
            pattern={emailPatternFactory}
            title="Ingrese un mail valido"
            bind:value={email}
            class="input focus:invalid:border-red-500"
            type="text"
            placeholder="email del cliente. Ej: unCliente@gmail.com"
            name="email"
            required
        />
        <p class="text-red-500">{emailErrorMsj}</p>

        <label class="label" for="telefono">Teléfono:</label>
        <input
            bind:value={telefono}
            class="input focus:invalid:border-red-500"
            type="text"
            placeholder="Ingrese teléfono del cliente. Ej: 2214687634"
            use:popup={popupFocusBlur}
            name="telefono"
            pattern={numbersPatternFactory}
            required
        />

        <div class="card p-4 variant-filled" data-popup="popupFocusBlur">
            <p>Sólo números</p>
            <div class="arrow variant-filled" />
        </div>

        <label class="label" for="dni">DNI:</label>
        <input
            bind:value={dni}
            class="input focus:invalid:border-red-500"
            type="text"
            max="9999999999"
            placeholder="Ingrese dni del cliente"
            name="dni"
            autocomplete="off"
            pattern={numbersPatternFactory}
            required
        />
        <p class="text-red-500">{dniErrorMsj}</p>
        <label class="label" for="fechaNacimiento">Fecha de nacimiento:</label>
        <input
            bind:value={fechaNacimiento}
            class="input"
            type="date"
            placeholder="Ingrese fecha de nacimiento del cliente"
            name="fechaNacimiento"
            max={fechaMax}
            required
        />

        <label class="label" for="direccion">Dirección:</label>
        <input
            bind:value={direccion}
            class="input focus:invalid:border-red-500"
            type="text"
            placeholder="Ingrese dirección del cliente"
            name="direccion"
            required
        />

        <button class="btn rounded-lg variant-filled-primary" type="submit"
            >Registrar cliente</button
        >
        <!-- Al apretar registrar cliente,si no está registrado el dni ni el emial, debo almacenar los datos ingresados en un store y me debe redirigir a cargar perro. Una vez que aprete "cargar perro", si vengo de /cargar-cliente, enviaré los datos del cliente y perro al backend, si falla la persistencia del cliente no intentará la del perro.
        
        Si soy veterinario y entro a /cargar-perro viniendo desde una ruta diferente a /cargar-cliente, lanzo error.
        Si soy veterinario y me voy de /cargar-perro a una ruta diferente a /cargar-cliente, limpio el store correspondiente.
        

	beforeNavigate((nav:BeforeNavigate) => {
        if (nav?.to?.route){
            console.log(nav.to?.route);
        }
    });


        afterNavigate(()=> {
    		console.log("root +layout afterNavigate():");
		    if($navigating?.from?.route) console.log($navigating?.from?.route);
        -->
    </form>
</div>
