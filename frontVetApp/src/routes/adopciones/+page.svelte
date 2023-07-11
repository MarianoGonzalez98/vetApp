<script lang="ts">
    import type { PublicacionAdopcion } from "$lib/interfaces/Adopciones.interface";
    import { user } from "$lib/stores/user";
    import type { ModalComponent, ModalSettings } from "@skeletonlabs/skeleton";
    import { Modal, modalStore } from "@skeletonlabs/skeleton";
    import { onMount } from "svelte";
    import ModalExampleForm from "./ModalExampleForm.svelte";
    import type { Id } from "$lib/interfaces/Id.interface";
    import ModalConfirmarMarcarAdoptado from "./ModalConfirmarMarcarAdoptado.svelte";
    import { backendURL } from "$lib/utils/constantFactory";

    let misDatos = {
        nombreApellido: "",
        telefono: "",
        email: "",
    };

    let emailSeleccionado: string = "";
    let publicaciones: (PublicacionAdopcion & Id)[] = [];
    let inputRaza: string;

    let publicacionSeleccionada: PublicacionAdopcion & Id;
    $: publicaciones = publicaciones.sort((a, b) => {
        //ordeno publicacion primero por los no adoptados, en caso de empate, por los de fecha superior
        if (!a.adoptado && b.adoptado) return -1;
        if (a.adoptado && !b.adoptado) return 1;
        if (a.fechaPublicacion > b.fechaPublicacion) return -1;
        if (a.fechaPublicacion <= b.fechaPublicacion) return 1;
        return 1;
    });

    $: publicacionesVisibles = inputRaza
        ? publicaciones.filter((pub) => {
              return pub.raza
                  .toLowerCase()
                  .match(`${inputRaza.toLowerCase()}.*`);
          })
        : publicaciones;

    onMount(async () => {
        let dia = new Date("1999-01-23").toLocaleDateString("es-AR");
        //fetch de lista de adopciones publicados
        await fetch(`${backendURL}/adopciones/get-lista-adopciones`, {
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
                    misDatos.nombreApellido = res.apellido + ", " + res.nombre;
                    misDatos.telefono = res.telefono;
                    misDatos.email = $user?.email || "";
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    });

    const handleMarcarAdoptado = async (
        publicacion: PublicacionAdopcion & Id
    ) => {
        let modalComponent = {
            ref: ModalConfirmarMarcarAdoptado,
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
                    publicacion.adoptado = true; //marco como adoptada a la publicacion en el front tmb
                    publicacionesVisibles = publicacionesVisibles; //esta asignación es por la reactividad
                }
            },
        };
        modalStore.clear();
        modalStore.trigger(modalConfirm);
    };

    const handleContactar = (publicacion: PublicacionAdopcion & Id) => {
        publicacionSeleccionada = publicacion;
        emailSeleccionado = publicacion.email;
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
    <a href="/adopciones/crear-publicacion"
            ><button class="btn rounded-lg variant-filled-secondary mt-5 ml-8"
                >Publicar perro</button
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
    <h1 class="h1 ml-15">Perros para adoptar</h1>
    <div class="flex flex-wrap">
                {#if publicacionesVisibles.filter((pub) => {
            return !pub.adoptado;
        }).length > 0}
        {#each publicacionesVisibles.filter((pub) => {
            return !pub.adoptado;
        }) as publicacion}
            <div class="card variant-ghost-secondary p-1 max-w-xs m-2">
                {#if publicacion.adoptado}
                    <h1 class="h1 text-amber-800">ADOPTADO</h1>
                {/if}
                <section class="p-4">
                    <p>
                        <span class="font-medium"
                            >Raza:
                        </span>{publicacion.raza}
                    </p>
                    <p>
                        <span class="font-medium"
                            >Nombre:
                        </span>{publicacion.nombre}
                    </p>
                    <p>
                        <span class="font-medium"
                            >Fecha nacimiento:
                        </span>{new Date(
                            publicacion.fechaNacimiento
                        ).toLocaleDateString("es-AR")}
                    </p>
                </section>
                <footer class="card-footer">
                    <div>
                        {#if !publicacion.adoptado}
                            <!-- si no fue adoptado muestro los botones -->
                            {#if publicacion.email !== $user?.email}
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
                                        handleMarcarAdoptado(publicacion)}
                                    class="btn variant-filled-secondary mt-2"
                                    >Marcar adoptado</button
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
        {:else if inputRaza}
            <h1>No hay ningún resultado que coincida con el filtro aplicado.</h1>
        {/if}
    </div>

    <hr class="h-px my-8 bg-gray-200 border-2 dark:bg-gray-700" />
    <h1 class="h1 ml-15">Perros adoptados</h1>

    <div class="flex flex-wrap">
        {#each publicaciones.filter((pub) => {
            return pub.adoptado;
        }) as publicacion}
            <div class="card variant-ghost-secondary p-1 max-w-xs m-2">
                <section class="p-4">
                    <p>
                        <span class="font-medium"
                            >Raza:
                        </span>{publicacion.raza}
                    </p>
                    <p>
                        <span class="font-medium"
                            >Nombre:
                        </span>{publicacion.nombre}
                    </p>
                    <p>
                        <span class="font-medium"
                            >Fecha nacimiento:
                        </span>{new Date(
                            publicacion.fechaNacimiento
                        ).toLocaleDateString("es-AR")}
                    </p>
                </section>
                <footer class="card-footer">
                    <div>
                        {#if !publicacion.adoptado}
                            <!-- si no fue adoptado muestro los botones -->
                            <button
                                on:click={(event) =>
                                    handleContactar(publicacion)}
                                class="btn rounded-sm variant-filled-primary block"
                                >Contactar</button
                            >
                            {#if publicacion.autorEmail === $user?.email}
                                <button
                                    on:click={(event) =>
                                        handleMarcarAdoptado(publicacion)}
                                    class="btn rounded-sm variant-filled-secondary block mt-2"
                                    >Marcar adoptado</button
                                >
                            {/if}
                        {/if}
                    </div>
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
