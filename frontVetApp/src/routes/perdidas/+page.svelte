<script lang="ts">
    import { user } from "$lib/stores/user";
    import type { ModalComponent, ModalSettings } from "@skeletonlabs/skeleton";
    import { Modal, modalStore } from "@skeletonlabs/skeleton";
    import { onMount } from "svelte";
    import ModalExampleForm from "./ModalExampleForm.svelte";
    import ModalConfirmarMarcarEncontrado from "./ModalConfirmarMarcarEncontrado.svelte";
    import { backendURL } from "$lib/utils/constantFactory";
    import type { Perdida } from "$lib/interfaces/Perdidas.interface";

    let misDatos = {
        emailContacto:"",
        nombreContacto:"",
        apellidoContacto:"",
        telefonoContacto:""
    };

    let emailSeleccionado: string = "";
    let publicaciones: (Perdida)[] = [];
    let inputRaza: string;

    let publicacionSeleccionada: Perdida;
    $: publicaciones = publicaciones.sort((a, b) => {
        //ordeno publicacion primero por los no adoptados, en caso de empate, por los de fecha superior
        if (!a.encontrado && b.encontrado) return -1;
        if (a.encontrado && !b.encontrado) return 1;
        if (a.fechaPublicacion > b.fechaPublicacion) return -1;
        if (a.fechaPublicacion <= b.fechaPublicacion) return 1;
        return 1;
    });

    $: publicacionesVisibles = inputRaza
        ? publicaciones.filter((pub) => {
              return pub.razaPerro
                  .toLowerCase()
                  .match(`${inputRaza.toLowerCase()}.*`);
          })
        : publicaciones;

    onMount(async () => {
        //fetch de lista de perros perdidos publicados
        await fetch(`${backendURL}/perdidas/get-lista-perdidos`, { 
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
            .then((res) => res.json())
            .then((apiResponse) => (publicaciones = apiResponse.publicaciones));

        if ($user) {
            await fetch(`${backendURL}/getPerfil`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            })
                .then((res) => {
                    if (res.status < 299) {
                        //si entra acá no hubo error
                        return res.json();
                    }
                    return Promise.reject(res);
                })
                .then((res) => {
                    misDatos.nombreContacto = res.nombre;
                    misDatos.apellidoContacto = res.apellido;
                    misDatos.telefonoContacto = res.telefono;
                    misDatos.emailContacto = $user?.email || "";
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    });

    const handleMarcarEncontrado = async (
        publicacion: Perdida
    ) => {
        let modalComponent = {
            ref: ModalConfirmarMarcarEncontrado,
            props: {
                publicacion: publicacion,
                publicacionesVisibles: publicacionesVisibles,
            },
        };

        let modalConfirm: ModalSettings = {
            //esto sí lo uso
            type: "component",
            // Pass the component directly:
            component: modalComponent,
            response: (confirmo: any) => {
                if (confirmo) {
                    publicacion.encontrado = true; //marco como encontrado a la publicacion en el front tmb
                    publicacionesVisibles = publicacionesVisibles; //esta asignación es por la reactividad
                }
            },
        };
        modalStore.clear();
        modalStore.trigger(modalConfirm);
    };

    const handleContactar = (publicacion: Perdida) => {
        publicacionSeleccionada = publicacion;
        emailSeleccionado = publicacion.emailContacto;
        let modalComponent = {
            ref: ModalExampleForm,
            props: {
                datosParaContacto: misDatos,
                publicacion: publicacionSeleccionada,
            },
        };

        let modalForm: ModalSettings = {
            //esto sí lo uso
            type: "component",
            // Pass the component directly:
            component: modalComponent,
            response: (r: any) => console.log("response:", r),
        };

        modalStore.clear();
        modalStore.trigger(modalForm);
    };

    const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Error desconocido",
        body: "No se pudo marcar como adoptado",
        buttonTextCancel: "Ok",
    };

    const perroMarcadoAdoptadoModal: ModalSettings = {
        type: "alert",
        title: "Perro marcado adoptado",
        body: "Se ha marcado correctamente adoptado al perro seleccionado",
        buttonTextCancel: "Ok",
    };
</script>

<Modal />

<div class="w-full">
    {#if $user}
        <a href="/perdidas/crear-publicacion" 
        ><button class="btn rounded-lg variant-filled-secondary mt-5 ml-8"
        >Publicar perro perdido</button
        ></a
        >
    {/if}
        <div class="float-right mr-5 mt-5">
            <div class="flex items-center">
                <label for="filtroRaza" class="text-left whitespace-nowrap"
                    >Filtrar por raza:</label
                >
                <input
                    type="text"
                    bind:value={inputRaza}
                    class="input"
                    name="filtroRaza"
                    id=""
                />
            </div>
        </div>
    </div>
<div class="container my-8 mx-auto">
    <h1 class="h1 ml-15">Perros perdidos</h1>
    <div class="flex flex-wrap">
        {#each publicacionesVisibles.filter((pub) => {
            return !pub.encontrado;
        }) as publicacion}
            <div class="card variant-ghost-secondary p-1 max-w-xs m-2">
                <section class="p-4">
                    <header>
                        {#if publicacion.foto}
                            <img
                                class="object-cover h-full w-full rounded-t-lg"
                                src={publicacion.foto}
                                alt="foto de perfil"
                            />
                        {:else}
                            <img
                                class="object-cover h-full w-full rounded-t-lg p-5"
                                src="/no_foto_perro.png"
                                alt=""
                            />
                        {/if}
                    </header>
                    <p>
                        <span class="font-medium"
                            >Nombre:
                        </span>{publicacion.nombrePerro}
                    </p>
                    <p>
                        <span class="font-medium"
                            >Raza:
                        </span>{publicacion.razaPerro}
                    </p>
                    <p>
                        <span class="font-medium"
                            >Fecha nacimiento:
                        </span>{new Date(
                            publicacion.fechaNacPerro
                        ).toLocaleDateString("es-AR")}
                    </p>
                    <p>
                        <span class="font-medium"
                            >Descripción:
                        </span>{publicacion.descripcionPerro}
                    </p>
                    <br><br>
        
                    <p>
                        <span class="font-medium"
                            >Fecha cuando se perdió:
                        </span>{new Date(
                            publicacion.fechaPerdido
                        ).toLocaleDateString("es-AR")}
                    </p>
                    <p>
                        <span class="font-medium"
                            >Plaza por donde se perdió:
                        </span>{publicacion.plazaPerdido}
                    </p>
                </section>
                <footer class="card-footer">
                    <div>
                        {#if !publicacion.encontrado}
                            <!-- si no fue encontrado muestro los botones -->
                            {#if publicacion.emailContacto !== $user?.email}
                                <button
                                    on:click={(event) =>
                                        handleContactar(publicacion)}
                                    class="btn variant-filled-primary"
                                    >Contactar</button
                                >
                            {/if}
                            {#if publicacion.autorEmail === $user?.email}
                                <button
                                    on:click={(event) =>
                                        handleMarcarEncontrado(publicacion)}
                                    class="btn variant-filled-secondary mt-2"
                                    >Marcar encontrado</button
                                >
                            {/if}
                        {/if}
                    </div>
                    <p class="mt-4 font-medium">
                        Fecha de publicación: {new Date(
                            publicacion.fechaPublicacion
                        ).toLocaleDateString("es-AR")}
                    </p>
                </footer>
            </div>
        {/each}
    </div>

    <hr class="h-px my-8 bg-gray-200 border-2 dark:bg-gray-700" />
    <h1 class="h1 ml-15">Perros encontrados</h1>

    <div class="flex flex-wrap">
        {#each publicaciones.filter((pub) => {
            return pub.encontrado;
        }) as publicacion}
            <div class="card variant-ghost-secondary p-1 max-w-xs m-2">
                <section class="p-4">
                    <header>
                        {#if publicacion.foto}
                            <img
                                class="object-cover h-full w-full rounded-t-lg"
                                src={publicacion.foto}
                                alt="foto de perfil"
                            />
                        {:else}
                            <img
                                class="object-cover h-full w-full rounded-t-lg p-5"
                                src="/no_foto_perro.png"
                                alt=""
                            />
                        {/if}
                    </header>
                    <p>
                        <span class="font-medium"
                            >Nombre:
                        </span>{publicacion.nombrePerro}
                    </p>
                    <p>
                        <span class="font-medium"
                            >Raza:
                        </span>{publicacion.razaPerro}
                    </p>
                    <p>
                        <span class="font-medium"
                            >Fecha nacimiento:
                        </span>{new Date(
                            publicacion.fechaNacPerro
                        ).toLocaleDateString("es-AR")}
                    </p>
                    <p>
                        <span class="font-medium"
                            >Descripción:
                        </span>{publicacion.descripcionPerro}
                    </p>
                </section>
                <footer class="card-footer">
                    <p class="font-medium">
                        Fecha de publicación: {new Date(
                            publicacion.fechaPublicacion
                        ).toLocaleDateString("es-AR")}
                    </p>
                </footer>
            </div>
        {/each}
    </div>
</div>
