<script lang="ts">
    import { beforeNavigate } from "$app/navigation";
    import { user } from "$lib/stores/user";
    import type { BeforeNavigate } from "@sveltejs/kit";
    import { onMount } from "svelte";

    let nombre = "";
    let apellido = "";
    let dni = "";
    let direccion = "";
    let telefono = "";
    let fechaNacimiento ="" //
    let foto= "";
    let fechaMax: string 


    onMount( () => {
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
            console.log(res);
            nombre=res.nombre;
            apellido=res.apellido;
            dni=res.dni;
            direccion=res.direccion;
            telefono=res.telefono;
            fechaNacimiento=res.fechaNacimiento.slice(0, 10); //despues capaz tenga que cambiar el formato??
            foto=res.foto;
        }).catch( (e)  => {
            console.log(e);
        })
    })
</script>

<div class="container h-full mx-auto flex justify-center items-center">
    <div>
        <div>
            <p class="text-lg">Email: {$user?.email} </p>
            <p class="text-lg">Nombre: {nombre} </p>
            <p class="text-lg">Apellido: {apellido}</p>
            <p class="text-lg">Telefono: {telefono}</p>
            <p class="text-lg">DNI: {dni}</p>
            <p class="text-lg">Fecha de nacimiento: {fechaNacimiento}</p>
            <p class="text-lg">Direccion: {direccion} </p>
            <p class="text-lg">Foto de perfil: </p> <img src="" alt="">
            <div>
                {#if foto}
                    <img class="object-contain h-32 w-32" src="{foto}" alt="foto de perfil" />
                {:else}
                    <img class="object-contain h-32 w-32" src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png" alt="" />  <!-- guardar en static!! -->
                {/if}
            </div>
        </div>

        <a
        class="btn variant-ghost-surface mt-10"
        rel="noreferrer"
        href="/auth/mi-perfil/editar-perfil">Editar mi perfil</a
        >
        <a
        class="btn variant-ghost-surface mt-10"
        rel="noreferrer"
        href="/auth/cambiar-password">Cambiar mi contraseña</a
        >
    </div>
</div>
