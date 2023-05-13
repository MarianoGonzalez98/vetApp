<script lang="ts">
    import { user } from "$lib/stores/user";
    import { onMount } from "svelte";
    import type { AutocompleteOption, ModalSettings } from '@skeletonlabs/skeleton';   
    import type { Id, InfoPerroAdopcion, Perro } from "$lib/interfaces/Perro.interface";
    import type { AdopcionInput } from "$lib/interfaces/Adopciones.interface";
    import { goto } from "$app/navigation";
    import { Modal, modalStore } from "@skeletonlabs/skeleton";

    let perrosCliente:(Perro&Id)[] = [];

    let fechaMax: string = new Date().toJSON().slice(0, 10);

    let emailCliente=$user?.email

    let selectedPerro:Perro;
    let inputPerro:InfoPerroAdopcion={
        nombre:"",
        raza:"",
        fechaNacimiento:"",
        sexo:"",
    }

    let nombreContacto=""
    let apellidoContacto=""
    let telefonoContacto=""
    let emailContacto=$user?.email

    const actualizarForm = () => {
        inputPerro.nombre=selectedPerro.nombre;
        inputPerro.raza = selectedPerro.raza;
        inputPerro.sexo = selectedPerro.sexo;
        inputPerro.fechaNacimiento = selectedPerro.fechaNacimiento.slice(0,10);
        console.log(inputPerro.fechaNacimiento);
    }

    onMount(async () => {
        //si soy cliente obtengo los datos de mis perros
        if ($user?.rol==='cliente'){
            await fetch(
            `http://localhost:3000/listar-perros?cliente=${emailCliente}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            })
            .then((res) => res.json())
            .then((apiResponse) => {
                perrosCliente = apiResponse.data
            });
        }
        //obtengo mis datos
        fetch('http://localhost:3000/getPerfil',{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
        },
        credentials: 'include',
            }).then( (res) => {
                if (res.status < 299) {  //si entra acá no hubo error
                    return res.json()
                }
                return Promise.reject(res);
            }).then( (res) => {
                nombreContacto=res.nombre;
                apellidoContacto=res.apellido;
                telefonoContacto=res.telefono;
            }).catch( (e)  => {
                console.log("ERROR:");
                console.log(e);
            })
    });

    const publicacionAdopcionCargada: ModalSettings = {
        type: "alert",
        title: "Publicación cargada",
        body: "Publicacion de adopción cargada correctamente",
        buttonTextCancel: "Ok",
        response: (r: boolean) => goto("/adopciones"),
    };

    const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Error desconocido",
        body: "No se pudo actualizar el perfil",
        buttonTextCancel: "Ok",
    };

    const fallaServidor: ModalSettings = {
        type: "alert",
        title: "Fallo en actualizacion del perfil",
        body: "Falla del servidor",
        buttonTextCancel: "Ok",
    };

    const handleCarga = () => {
        fetch("http://localhost:3000/adopciones/crear-publicacion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                nombreContacto,
                apellidoContacto,
                telefonoContacto,
                emailContacto,
                nombrePerro:inputPerro.nombre,
                razaPerro:inputPerro.raza,
                fechaNacPerro:inputPerro.fechaNacimiento
            }),
        })
            .then((res) => {
                if (res.status < 299) {
                    modalStore.clear();
                    modalStore.trigger(publicacionAdopcionCargada);
                    return res;
                }
                if (res.status === 400) {
                    //error por modificacion del token jwt.
                    $user = null;
                    goto('/auth/login');
                    return;
                }
                if (res.status === 404) {
                    console.log("El usuario no existe...");
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
                console.log("Error desconocido: ", error);
            });
    }
</script>

<Modal />

<div class="container mt-2 mb-10 h-full mx-auto flex justify-center items-center">
    <div class="w-6/12">
        {#if $user?.rol==='cliente'}
            <!-- si es cliente -->
                    <!--  seleccionar de: -->
            <div>
                <label for="seleccionPerro">Si desea publicar un perro suyo, seleccionelo:</label>
                <select id="seleccionPerro" style="color: black;" bind:value={selectedPerro} on:change={actualizarForm}>
                    {#each perrosCliente as perro}
                        <option value={perro}>
                            <span>{perro.nombre} (raza: {perro.raza})</span>
                        </option>
                    {/each}
                </select>
            </div>
        <!-- fin si es cliente -->
        {/if}
        <!-- formulario: datos del perro -->
        <h3 class="h3 mt-3">Datos del perro:</h3>
        <form class="space-y-2 mt-5 mb-5 max-w-md" on:submit|preventDefault={handleCarga} action="">
            <label class="label" for="nombre">Nombre del perro:</label>
            <input bind:value={inputPerro.nombre} class="input focus:invalid:border-red-500"type="text" placeholder="Nombre del perro" name="nombre" required/>

            <label class="label" for="raza">Raza:</label>
            <input bind:value={inputPerro.raza} class="input focus:invalid:border-red-500" type="text" placeholder="Raza del perro" name="raza" required />

            <label class="label" for="sexo">Sexo:</label>
            <select bind:value={inputPerro.sexo} class="input" placeholder="Sexo" name="sexo" required>
                <option value="" disabled selected>Seleccione uno</option>
                {#each ["Macho", "Hembra"] as value}
                    <option {value}>{value}</option>
                {/each}
            </select>

            <label class="label" for="fechaNacimiento">Fecha de nacimiento:</label>
            <input bind:value={inputPerro.fechaNacimiento} class="input" type="date" placeholder="Ingrese fecha de nacimiento del cliente" name="fechaNacimiento" max={fechaMax} required/>

    <!-- si es veterinario -->

        <!-- formulario:datos de contacto pre-cargados con sus datos  -->
            {#if $user?.rol==='veterinario'}
            <hr class="!border-t-2" />
            <h3 class="h3 mt-3">Datos de contacto:</h3>

            <label class="label" for="nombreContacto">Nombre:</label>
            <input bind:value={nombreContacto} class="input focus:invalid:border-red-500"type="text" placeholder="Nombre del contacto" name="nombreContacto" required/>

            <label class="label" for="apellidoContacto">Apellido:</label>
            <input bind:value={apellidoContacto} class="input focus:invalid:border-red-500"type="text" placeholder="Apellido del contacto" name="apellidoContacto" required/>

            <label class="label" for="telefonoContacto">Telefono:</label>
            <input bind:value={telefonoContacto} class="input focus:invalid:border-red-500"type="text" placeholder="Telefono del contacto" name="telefonoContacto" required/>

            <label class="label" for="nombreContacto">Email:</label>
            <input bind:value={emailContacto} class="input focus:invalid:border-red-500"type="text" placeholder="Email del contacto" name="nombreContacto" required/>
        
            {/if}
            <hr class="!border-t-2" />
            <div></div> <!-- para mas espacio con el último elemento(horrible, ya se) -->
            <button class="btn rounded-lg variant-filled-primary mt-5" type="submit">Crear publicación de adopción</button>
        </form>

    </div>







</div>