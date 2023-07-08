<script lang="ts">
    import type { PaseadorCuidador } from "$lib/interfaces/PaseadoresYCuidadores.interface";
    import { onMount } from "svelte";
    import { user } from "$lib/stores/user";
    import {
        Modal,
        modalStore,
        type ModalSettings,
        type ModalComponent,
    } from "@skeletonlabs/skeleton";
    import { goto, preloadCode } from "$app/navigation";
    import ModalExampleForm from "./ModalExampleForm.svelte";
    import { backendURL } from "$lib/utils/constantFactory";
    import type { Perro } from "$lib/interfaces/Perro.interface";
    import type {
        Cliente,
        ExtrasCliente,
    } from "$lib/interfaces/Cliente.interface";

    const owner: string =
        new URLSearchParams(window.location.search).get("owner") ??
        $user?.email ??
        "";

    const nombre: string =
        new URLSearchParams(window.location.search).get("nombre") ?? "";

    const raza: string =
        new URLSearchParams(window.location.search).get("raza") ?? "";

    const sexo: string =
        new URLSearchParams(window.location.search).get("sexo") ?? "";

    let perros: Perro[] = [];

    const fallaServidor: ModalSettings = {
        type: "alert",
        title: "Fallo de la carga del perro",
        body: "Falla del servidor",
        buttonTextCancel: "Ok",
    };

    const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Fallo de la carga del perro",
        body: "No se pudo cargar el nuevo perro",
        buttonTextCancel: "Ok",
    };

    onMount(async () => {
        const res = await fetch(
            `${backendURL}/listar-perros-para-cruza?owner=${owner}&sexo=${sexo}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        )
            .then((res) => res.json())
            .then((apiResponse) => (perros = apiResponse.data));
        perros = perros.sort((a, b) => {
            if (a.raza === raza && b.raza !== raza) {
                return -1; // a viene antes que b
            } else if (a.raza !== raza && b.raza === raza) {
                return 1; // b viene antes que a
            } else {
                return 0; // no se cambia el orden
            }
        });
        mostrar = perros;
    });

    let inputRaza: string;

    $: mostrar = perros.filter((perro) => {
        const razaMatch = inputRaza
            ? perro.raza.toLowerCase().match(`.*${inputRaza.toLowerCase()}.*`)
            : true;
        return razaMatch;
    });

    let perrosCliente: Perro[] = [];
    let cliente: Cliente & ExtrasCliente;

    const handleContactar = async (perro: Perro) => {
        const res = await fetch(
            `${backendURL}/listar-perros?cliente=${owner}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        )
            .then((res) => res.json())
            .then((apiResponse) => (perrosCliente = apiResponse.data));
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
                cliente = res;
            })
            .catch((e) => {
                console.log(e);
            });
        let modalComponent = {
            // Pass a reference to your custom component
            ref: ModalExampleForm,
            // Add the component properties as key/value pairs
            props: {
                miNombre: cliente.nombre,
                miApellido: cliente.apellido,
                miTelefono: cliente.telefono,
                miEmail: owner,
                misPerros: perrosCliente,
                nombrePerroOriginal: nombre,
                sexoPerroOriginal: sexo,
                emailDestinatario: perro.owner,
            },
            // Provide a template literal for the default component slot
            slot: "<p>Skeleton</p>",
        };
        const modalTest: ModalSettings = {
            type: "component",
            // Pass the component directly:
            component: modalComponent,
            response: (r: any) => console.log("response:", r),
        };

        modalStore.clear();
        modalStore.trigger(modalTest);
    };

    const espacio = " ";
</script>

<Modal />

<h1 class="h1 m-4 font-medium">Perros para cruzar con {nombre}</h1>
{#if perros.length > 0}
    <div class="flex">
        <div class="ml-2">
            <label for="filtroRaza" class="text-left whitespace-nowrap"
                >Filtrar por raza:
            </label>
            <input
                type="text"
                bind:value={inputRaza}
                class="input"
                name="filtroRaza"
                id=""
            />
        </div>
    </div>
    {#if mostrar.length > 0}
        <div class="ml-2 flex flex-wrap">
            {#each mostrar as perro}
                <div
                    class="m-2 grayscale hover:grayscale-0 duration-300 rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] variant-ghost-secondary max-w-sm md:flex-row min-h-0 h-auto"
                >
                    <header>
                        {#if perro.foto}
                            <img
                                class="object-cover h-full w-full rounded-t-lg"
                                src={perro.foto}
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
                    <div class="flex flex-col justify-start p-6">
                        <h5
                            class="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-50"
                        >
                            {perro.nombre}
                        </h5>
                        <div
                            class="mb-4 text-base text-neutral-600 dark:text-neutral-200"
                        >
                            <p>
                                <span class="font-medium">Raza: </span>
                                {perro.raza}
                            </p>
                            <p>
                                <span class="font-medium"
                                    >Fecha de nacimiento:
                                </span>
                                {new Date(
                                    perro.fechaNacimiento
                                ).toLocaleDateString("es-AR")}
                            </p>
                            <p>
                                <span class="font-medium">Observaciones: </span>
                                {perro.observaciones}
                            </p>
                            <p>
                                <span class="font-medium"
                                    >Peso: {perro.peso} Kg</span
                                >
                            </p>
                            <p>
                                <span class="font-medium"
                                    >Vacunas aplicadas:
                                </span>
                                <br />
                                {#if perro.vacunas !== "[]"}
                                    {#each JSON.parse(perro.vacunas) as vacuna}
                                        {espacio}{vacuna.nombre}.
                                    {/each}
                                {:else}
                                    No se le aplicaron vacunas.
                                {/if}
                            </p>
                            <p>
                                <span class="font-medium"
                                    >Antiparasitarios aplicados:
                                </span> <br />
                                {#if perro.antiparasitarios !== "[]"}
                                    {#each JSON.parse(perro.antiparasitarios) as antiparasitario}
                                        -{espacio}{antiparasitario.nombre},
                                        aplicado el {new Date(
                                            antiparasitario.fechaDeAplicacion
                                        ).toLocaleDateString("es-AR")}, cantidad
                                        aplicada: {antiparasitario.cantidadAplicada}
                                        mg/kg.
                                        <br />
                                    {/each}
                                {:else}
                                    No se le aplicaron antiparasitarios.
                                {/if}
                            </p>
                            <p class="font-medium">
                                {#if !perro.castrado}
                                    No está
                                {:else}
                                    Está
                                {/if}castrad{#if perro.sexo === "Macho"}
                                    o.
                                {:else}
                                    a.
                                {/if}
                            </p>
                        </div>
                        <footer class="flex flex-wrap">
                            <button
                                on:click={(event) => handleContactar(perro)}
                                class="btn btn-sm variant-ghost-surface mr-2"
                                >Contactar
                            </button>
                        </footer>
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <div class="flex justify-center items-center h-full">
            <h1 class="text-4xl font-bold">
                No hay resultados que coincidan con los filtros aplicados.
            </h1>
        </div>
    {/if}
{:else}
    <div class="flex justify-center items-center h-screen">
        <h1 class="text-4xl font-bold">
            Ups! Parece que no hay perros disponibles para cruza.
        </h1>
    </div>
{/if}
