<script lang="ts">
    import { user } from "$lib/stores/user";
    import { onMount } from "svelte";
    import type { AutocompleteOption, ModalSettings, PopupSettings } from '@skeletonlabs/skeleton';   
    import type { InfoPerroPerdido, Perro } from "$lib/interfaces/Perro.interface";
    import { goto } from "$app/navigation";
    import { popup, Autocomplete, Modal, modalStore } from "@skeletonlabs/skeleton";
    import { backendURL, emailPatternFactory, letrasEspaciosPatternFactory } from "$lib/utils/constantFactory";

    let perrosCliente:(Perro)[] = [];

    let fechaMax: string = new Date().toJSON().slice(0, 10);

    let emailCliente=$user?.email

    let selectedPerro:Perro;
    let inputPerro:InfoPerroPerdido={
        nombre:"",
        raza:"",
        fechaNacimiento:"",
        sexo:"",
        descripcion:"",
        foto:null,
        fechaPerdido:"",
        plazaPerdido:"",
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
        inputPerro.descripcion = selectedPerro.observaciones;
        inputPerro.foto = selectedPerro.foto;
        foto = selectedPerro.foto;
    }

    let popupSettings: PopupSettings = {
        event: "focus-click",
        target: "popupAutocomplete",
        placement: "bottom",
    };

    let zona = "";
    const zonas: AutocompleteOption[] = [
        {   label: "Plaza Alsina",value: "Plaza Alsina", keywords: "plaza", },
        {   label: "Plaza Olazábal", value: "Plaza Olazábal", keywords: "plaza", },
        {   label: "Plaza Belgrano", value: "Plaza Belgrano",keywords: "plaza", },
        {   label: "Plaza Güemes", value: "Plaza Güemes", keywords: "plaza", },
        {   label: "Parque Alberti",  value: "Parque Alberti",keywords: "parque", },
        {   label: "Plaza 19 De Noviembre",value: "Plaza 19 De Noviembre", keywords: "plaza", },
        {   label: "Plaza Azcuénaga",value: "Plaza Azcuénaga", keywords: "plaza", },
        {   label: "Plaza Paso", value: "Plaza Paso", keywords: "plaza", },
        {   label: "Plaza Italia", value: "Plaza Italia",  keywords: "plaza", },
        {   label: "Parque Vucetich (San Martín)",  value: "Parque Vucetich (San Martín)", keywords: "parque", },
        {   label: "Plaza Islas Malvinas", value: "Plaza Islas Malvinas",keywords: "plaza", },
        {   label: "Plaza Moreno", value: "Plaza Moreno", keywords: "plaza", },
        {   label: "Plaza San Martín", value: "Plaza San Martín", keywords: "plaza", },
        {   label: "Plaza Rivadavia", value: "Plaza Rivadavia", keywords: "plaza", },
        {   label: "Paseo Del Bosque", value: "Paseo Del Bosque", keywords: "paseo", },
        {   label: "Plaza Juan D. Perón",value: "Plaza Juan D. Perón", keywords: "plaza", },
        {   label: "Plaza Yrigoyen", value: "Plaza Yrigoyen", keywords: "plaza", },
        {   label: "Plaza Rocha", value: "Plaza Rocha",keywords: "plaza", },
        {   label: "Parque Castelli", value: "Parque Castelli",keywords: "parque", },
        {   label: "Plaza Sarmiento",  value: "Plaza Sarmiento", keywords: "plaza", },
        {   label: "Parque Saavedra", value: "Parque Saavedra",  keywords: "parque", },
        {   label: "Plaza España",  value: "Plaza España", keywords: "plaza", },
        {   label: "Plaza Matheu", value: "Plaza Matheu", keywords: "plaza", },
        {   label: "Parque Meridiano V", value: "Parque Meridiano V", keywords: "parque", },
        {   label: "Plaza Máximo Paz", value: "Plaza Máximo Paz", keywords: "plaza", },
    ];

    function onPopupDemoSelect(event: any): void {
        zona = event.detail.label;
    }

    let foto: any;
    let fileErrorMsj = "";
    let FotoFile: any; //por ahora no tiene utilidad

    const modalConfirmarEliminarFoto: ModalSettings = {
        type: "confirm",
        title: "Confirme su acción",
        body: "¿Está seguro de eliminar la foto?",
        buttonTextConfirm: "Si",
        buttonTextCancel: "No",
        response: (confirma: boolean) => {
            if (confirma) {
                foto = "";
                inputPerro.foto = "";
                FotoFile = "";
            }
        },
    };

    const eliminarFoto = () => {
        modalStore.clear();
        modalStore.trigger(modalConfirmarEliminarFoto);
    };


    const onChangeFile = async (event: Event) => {
        let target = event.target as HTMLInputElement;
        if (!target.files) {
            return;
        }
        let image = target.files[0];
        if (image.size > 5242880) {
            // 5 mb en bytes
            fileErrorMsj = "La imagen debe pesar menos de 5 MB";
            target.value = "";
            return;
        }
        if (image.type !== "image/jpeg" && image.type !== "image/png") {
            fileErrorMsj = "El archivo debe ser una imagen jpg, jpeg o png";
            target.value = "";
            return;
        }
        FotoFile = target.value;
        fileErrorMsj = "";
        let reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = (e) => {
            if (!e.target) {
                return;
            }
            foto = e.target.result;
            //console.log(foto);
        };
    };

    onMount(async () => {
        //si soy cliente obtengo los datos de mis perros
        if ($user?.rol==='cliente'){
            await fetch(
            `${backendURL}/listar-perros?cliente=${emailCliente}`,
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
        fetch(`${backendURL}/getPerfil`,{
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

    const publicacionPerdidaCargada: ModalSettings = {
        type: "alert",
        title: "Publicación cargada",
        body: "Publicacion de perro perdido cargada correctamente",
        buttonTextCancel: "Ok",
        response: (r: boolean) => goto("/perdidas"),
    };

    const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Error desconocido",
        body: "No se pudo crear la publicación",
        buttonTextCancel: "Ok",
    };

    const fallaServidor: ModalSettings = {
        type: "alert",
        title: "Fallo en la publicación",
        body: "Falla del servidor",
        buttonTextCancel: "Ok",
    };

    const handleCarga = () => {
        console.log (inputPerro)
        console.log($user?.email)
        fetch(`${backendURL}/perdidas/crear-publicacion`, {
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
                sexoPerro:inputPerro.sexo,
                foto:foto,
                fechaNacPerro:inputPerro.fechaNacimiento,
                descripcionPerro:inputPerro.descripcion,

                fechaPerdido : inputPerro.fechaPerdido,
                plazaPerdido: zona,
            }),
        })
            .then((res) => {
                if (res.status < 299) {
                    modalStore.clear();
                    modalStore.trigger(publicacionPerdidaCargada);
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

    const numbersPattern: string = "^[0-9]*$";
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
        <!-- formulario: datos del perro (FALTA FOTO)-->
        <h3 class="h3 mt-3">Datos del perro:</h3>
        <form class="space-y-2 mt-5 mb-5 max-w-md" on:submit|preventDefault={handleCarga} action="">
            <label class="label" for="nombre">Nombre del perro:</label>
            <input bind:value={inputPerro.nombre} class="input focus:invalid:border-red-500"type="text" placeholder="Nombre del perro" pattern={letrasEspaciosPatternFactory} name="nombre" required/>

            <label class="label" for="raza">Raza:</label>
            <input bind:value={inputPerro.raza} class="input focus:invalid:border-red-500" type="text" placeholder="Raza del perro" pattern={letrasEspaciosPatternFactory} name="raza" required />

            <label class="label" for="sexo">Sexo:</label>
            <select bind:value={inputPerro.sexo} class="input" placeholder="Sexo" name="sexo" required>
                <option value="" disabled selected>Seleccione uno</option>
                {#each ["Macho", "Hembra"] as value}
                    <option {value}>{value}</option>
                {/each}
            </select>

            <label class="label" for="fechaNacimiento">Fecha de nacimiento:</label>
            <input bind:value={inputPerro.fechaNacimiento} class="input" type="date" placeholder="Ingrese fecha de nacimiento del cliente" name="fechaNacimiento" max={fechaMax} required/>

            <label class="label" for="descripcion">Descripción:</label>
            <input bind:value={inputPerro.descripcion} class="input" type="text" placeholder="descripción del perro" name="descripcion" required />

        <!--formulario:datos de la pérdida del perro  -->
            <h3 class="h3 mt-3">Datos de la pérdida del perro:</h3>
            <label class="label" for="fechaPerdido">Fecha cuando se perdió:</label>
            <input bind:value={inputPerro.fechaPerdido} class="input" type="date"  name="fechaPerdido" max={fechaMax} required/>
            <label class="label" for="zona">Zona:</label>

        <div class="text-token w-full max-w-sm space-y-2">
            <input
                class="input autocomplete"
                type="search"
                name="autocomplete-search"
                bind:value={zona}
                placeholder="Ej: Plaza Moreno"
                use:popup={popupSettings}
            />
            <div
                data-popup="popupAutocomplete"
                class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto"
            >
                <Autocomplete
                    bind:input={zona}
                    options={zonas}
                    on:selection={onPopupDemoSelect}
                />
            </div>
        </div>

        <p>Foto del perro:</p>
            <div>
                {#if foto}
                    <img
                        class="object-contain h-32 w-32"
                        src={foto}
                        alt="foto de perfil"
                    />
                {:else}
                    <img
                        class="object-contain h-32 w-32"
                        src="/no_foto_perro.png"
                        alt=""
                    />
                {/if}
                <button
                    on:click={eliminarFoto}
                    class="btn rounded btn-sm variant-filled-warning"
                    type="button">Eliminar foto</button
                >
            </div>
            <p class="text-red-500">{fileErrorMsj}</p>

            <input
                bind:files={FotoFile}
                type="file"
                accept="image/png, image/jpeg"
                on:change={onChangeFile}
            >

    <!-- si es veterinario -->

        <!-- formulario:datos de contacto pre-cargados con sus datos  -->
            {#if $user?.rol==='veterinario'}
            <hr class="!border-t-2" />
            <h3 class="h3 mt-3">Datos de contacto:</h3>

            <label class="label" for="nombreContacto">Nombre:</label>
            <input bind:value={nombreContacto} class="input focus:invalid:border-red-500"type="text" placeholder="Nombre del contacto" pattern={letrasEspaciosPatternFactory} name="nombreContacto" required/>

            <label class="label" for="apellidoContacto">Apellido:</label>
            <input bind:value={apellidoContacto} class="input focus:invalid:border-red-500"type="text" placeholder="Apellido del contacto" pattern={letrasEspaciosPatternFactory} name="apellidoContacto" required/>

            <label class="label" for="telefonoContacto">Telefono:</label>
            <input bind:value={telefonoContacto} class="input focus:invalid:border-red-500"type="text" placeholder="Telefono del contacto" pattern={numbersPattern} name="telefonoContacto" required/>

            <label class="label" for="nombreContacto">Email:</label>
            <input bind:value={emailContacto} class="input focus:invalid:border-red-500"type="text" placeholder="Email del contacto" pattern={emailPatternFactory} name="nombreContacto" required/>
        
            {/if}
            <hr class="!border-t-2" />
            <div></div> <!-- para mas espacio con el último elemento(horrible, ya se) -->
            <button class="btn rounded-lg variant-filled-primary mt-5" type="submit">Crear publicación de adopción</button>
        </form>

    </div>







</div>