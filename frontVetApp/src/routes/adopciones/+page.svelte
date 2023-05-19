<script lang="ts">
    import type { PublicacionAdopcion } from "$lib/interfaces/Adopciones.interface";
    import { user } from "$lib/stores/user";
    import type { ModalComponent, ModalSettings} from "@skeletonlabs/skeleton";
    import { Modal, modalStore } from "@skeletonlabs/skeleton";
    import { onMount } from "svelte";
    import ModalExampleForm from "./ModalExampleForm.svelte";

	let misDatos = {
		nombreApellido: '',
		telefono: '',
		email: ''
	};

    let emailSeleccionado:string="";
    let publicaciones:PublicacionAdopcion[] = [];
    let inputRaza:string;

    let publicacionSeleccionada:PublicacionAdopcion;
    $: publicacionesVisibles = inputRaza ?
		publicaciones.filter(pub => {
			return pub.raza.toLowerCase().match(`${inputRaza.toLowerCase()}.*`)
		}) : publicaciones;

    onMount( async ()  => {
        let dia = new Date("1999-01-23").toLocaleDateString('es-AR');
        //fetch de lista de adopciones publicados
        await fetch(
            `http://localhost:3000/adopciones/get-lista-adopciones`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
            )
            .then((res) => res.json())
            .then((apiResponse) => (publicaciones = apiResponse.publicaciones));
        
        publicaciones = publicaciones.sort( (a,b) => { //ordeno publicacion por fecha de forma descendente
            return a.fechaNacimiento > b.fechaNacimiento ? -1 : 1;
        })

        if ($user){
            await fetch('http://localhost:3000/getPerfil',{
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
                console.log(res);
                misDatos.nombreApellido=res.apellido+", "+res.nombre;
                misDatos.telefono=res.telefono;
                misDatos.email=$user?.email || '';
            }).catch( (e)  => {
                console.log(e);
            })
        }
    });


    const handleContactar = (publicacion:PublicacionAdopcion) => {
        publicacionSeleccionada= publicacion;
        emailSeleccionado = publicacion.email;
        let modalComponent = {
            ref: ModalExampleForm,
            props: { datosParaContacto:misDatos, publicacion:publicacionSeleccionada},
        };

        let modalTest: ModalSettings = { //esto sí lo uso
            type: 'component',
            // Pass the component directly:
            component: modalComponent,
            response: (r: any) => console.log('response:', r),
        };

        modalStore.clear();
        modalStore.trigger(modalTest);
    }
    

</script>

<Modal />

{#if ($user)}
<div class="w-full ">
    <a href="/adopciones/crear-publicacion"><button class="btn rounded-lg variant-filled-secondary mt-5 ml-8">Publicar perro</button></a>

    <div class="float-right mr-5 mt-5 ">
        <div class="flex items-center">
            <label for="filtroRaza" class="text-left whitespace-nowrap">Filtrar por raza:</label>
            <input type="text" bind:value={inputRaza} class="input" name="filtroRaza" id="">
        </div>
    </div>
    
</div>
{/if}
<div class="container my-8 mx-auto ">
    <div class="flex flex-wrap place-content-center ">
        {#each publicacionesVisibles as publicacion}
            {#if (!publicacion.adoptado)}
                <div class="card variant-ghost-secondary p-1 max-w-xs m-2 ">
                    <header class="card-header">Raza: {publicacion.raza}</header>
                    <section class="p-2">
                        <p>Nombre: {publicacion.nombre}</p>
                        <p>Fecha nacimiento: {new Date(publicacion.fechaNacimiento).toLocaleDateString('es-AR')}</p>
                    </section>
                    <footer class="card-footer">
                        <div>
                            <button on:click={(event) => handleContactar(publicacion)} class="btn rounded-sm variant-filled-primary block">Contactar</button>
                            {#if (publicacion.email === $user?.email)}
                            <button class="btn rounded-sm variant-filled-secondary block mt-2">Marcar adoptado</button>
                            {/if}
                        </div>
                    </footer>
                </div>
            {/if}

        {/each}


    </div>

</div>