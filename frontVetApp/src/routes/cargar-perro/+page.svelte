<script lang="ts">
    import { afterNavigate, beforeNavigate, goto } from "$app/navigation";
    import type { Vacuna } from "$lib/interfaces/Perro.interface";
    import { dataRegistroCliente } from "$lib/stores/dataRegistroCliente";
    import { user } from "$lib/stores/user";
    import { backendURL, emailPatternFactory } from "$lib/utils/constantFactory";
    import {
        CodeBlock,
        ListBox,
        ListBoxItem,
        type ModalSettings,
    } from "@skeletonlabs/skeleton";
    import { Modal, modalStore } from "@skeletonlabs/skeleton";
    import type { AfterNavigate, BeforeNavigate } from "@sveltejs/kit";

    const perroCargado: ModalSettings = {
        type: "alert",
        title: "Perro cargado",
        body: "Perro cargado correctamente",
        buttonTextCancel: "Ok",
        response: (r: boolean) => goto("/"),
    };

    const perroClienteCargado: ModalSettings = {
        type: "alert",
        title: "Cliente y su perro cargado",
        body: "Perro cargado junto con su cliente correctamente",
        buttonTextCancel: "Ok",
        response: (r: boolean) => goto("/"),
    };

    const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Fallo de la carga del perro",
        body: "No se pudo cargar el nuevo perro",
        buttonTextCancel: "Ok",
    };

    const fallaDesconocidaCliente: ModalSettings = {
        type: "alert",
        title: "Fallo de la carga del cliente",
        body: "No se pudo cargar el nuevo cliente ni su perro",
        buttonTextCancel: "Ok",
    };

    const fallaServidor: ModalSettings = {
        type: "alert",
        title: "Fallo de la carga del perro",
        body: "Falla del servidor",
        buttonTextCancel: "Ok",
    };

    const fallaYaCargado: ModalSettings = {
        type: "alert",
        title: "Fallo de la carga del perro",
        body: "El perro ya se encuentra cargado",
        buttonTextCancel: "Ok",
    };

    let nombre = "";
    let raza = "";
    let sexo = "";
    let fechaNacimiento: string = new Date().toJSON().slice(0, 10);
    let observaciones = "";
    let peso: number;
    let vacunasAplicadas: Vacuna[] = [];
    let vacunas: string[] = [];
    let foto: null;
    let owner = $user?.email;
    let castrado: string[] = [];

    let esVeterinarioSinCargarCliente = false;
    let errorNoExisteClienteMSG = '';

    const fechaHoy = new Date(Date.now());
    const fechaHoyString = `${fechaHoy.getFullYear()}-${(
        fechaHoy.getMonth() + 1
    )
        .toString()
        .padStart(2, "0")}-${fechaHoy.getDate().toString().padStart(2, "0")}`;

    afterNavigate((nav: AfterNavigate) => {
        console.log(nav.from?.route.id)
        if (
            $user?.rol === "veterinario" &&
            nav.from?.route.id !== "/cargar-cliente" &&
            nav.from?.route.id !== "/" &&
            nav.from?.route.id
        ) {
            goto("/");
        }
        if ($user?.rol === "veterinario" && (nav.from?.route.id==="/" || nav.from?.route.id==="/cargar-perro" || (!nav.from?.route.id)) || !$dataRegistroCliente?.email){
            esVeterinarioSinCargarCliente = true;
            owner='';
        }
    });
    beforeNavigate((nav: BeforeNavigate) => {
        if (nav?.to?.route.id !== "/cargar-cliente" ) {
            $dataRegistroCliente = null;
        }
    });

    const handleCarga = async () => {
        if ($user?.rol === "veterinario" && !esVeterinarioSinCargarCliente) {
            owner = $dataRegistroCliente?.email;
        }
        let error = false;

        for (const vacuna of vacunas) {
            let vacunaAplicada: Vacuna = {
                nombre: vacuna,
                fechaDeAplicacion: new Date().toJSON().slice(0, 10),
            };
            vacunasAplicadas.push(vacunaAplicada);
        }

        if ($user?.rol === "veterinario" && !error && !esVeterinarioSinCargarCliente) {
            await fetch(`${backendURL}/registrar-cliente`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    ...$dataRegistroCliente,
                    foto: null,
                }),
            })
                .then((res) => {
                    if (res.status < 299) {
                        //modalStore.clear();
                        //modalStore.trigger(perroClienteCargado);
                        return res;
                    }
                    if (res.status === 400) {
                        //error por modificacion del token jwt.
                        $user = null;
                        error = true;
                        goto("/auth/login");
                        return;
                    }
                    if (res.status === 409) {
                        error = true;
                        return res;
                    }
                    if (res.status === 500) {
                        error = true;
                        modalStore.clear();
                        modalStore.trigger(fallaServidor);
                        return res;
                    }
                })
                .catch((error) => {
                    error = true;
                    console.log(
                        "Error en carga del cliente desconocido: ",
                        error
                    );
                });
        }

        if (error) {
            modalStore.clear();
            modalStore.trigger(fallaDesconocidaCliente);
            return;
        }
        if ($user?.rol === "veterinario" && esVeterinarioSinCargarCliente){
            //valida que el cliente exista
            await fetch(`http://localhost:3000/clienteJuli?email=${owner}`,  //Traerme al cliente para saber el descuento acumulado
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
            )
                .then((res) => res.json())
                .then((apiResponse) => {
                    let cliente = apiResponse.data;
                    if (!cliente){
                        console.log("No existe el cliente");
                        error=true;
                        return;
                    }
                });
    
            if (error){
                errorNoExisteClienteMSG = 'No existe un cliente con el email ingresado'
                return;
            }
        }


        await fetch(`${backendURL}/cargar-perro`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                nombre,
                raza,
                sexo,
                fechaNacimiento,
                observaciones,
                peso,
                vacunas: JSON.stringify(vacunasAplicadas),
                antiparasitarios: "[]",
                owner,
                castrado: castrado.length === 1,
            }),
        })
            .then((res) => {
                if (res.status < 299) {
                    if ($user?.rol === "veterinario" && !esVeterinarioSinCargarCliente){
                        modalStore.clear();
                        modalStore.trigger(perroClienteCargado);
                    }else{
                        modalStore.clear();
                        modalStore.trigger(perroCargado);
                    }

                    return res;
                }
                if (res.status === 400) {
                    //error por modificacion del token jwt.
                    $user = null;
                    goto("/auth/login");
                    return;
                }
                if (res.status === 409) {
                    modalStore.clear();
                    modalStore.trigger(fallaYaCargado);
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
                console.log("Error desconocido en carga del perro : ", error);
            });
    };
</script>

<Modal />

<div
    class="container mt-2 mb-10 h-full mx-auto flex justify-center items-center w-full"
>
    <form
        on:submit|preventDefault={handleCarga}
        class="space-y-2 w-full h-full max-w-md"
    >
        <label class="label" for="nombre">Nombre:</label>
        <input
            bind:value={nombre}
            class="input"
            type="text"
            placeholder="Ej: Chicho"
            name="nombre"
            required
        />

        <label class="label" for="raza">Raza:</label>
        <input
            bind:value={raza}
            class="input"
            type="text"
            placeholder="Ej: Dálmata"
            name="raza"
            required
        />

        <label class="label" for="sexo">Sexo:</label>
        <select
            bind:value={sexo}
            class="input"
            placeholder="Sexo"
            name="sexo"
            required
        >
            <option value="" disabled selected>Seleccione uno</option>
            {#each ["Macho", "Hembra"] as value}
                <option {value}>{value}</option>
            {/each}
        </select>

        {#if esVeterinarioSinCargarCliente}
        <label class="label" for="emailCliente">Email del cliente dueño:</label>
        <input
            bind:value={owner}
            class="input"
            type="text"
            placeholder="Ej: email@gmail.com"
            name="emailCliente"
            pattern="{emailPatternFactory}"
            required
        />
        {/if}
        <label class="label" for="fechaNacimiento">Fecha de nacimiento:</label>
        <input
            bind:value={fechaNacimiento}
            class="input"
            type="date"
            max={fechaHoyString}
            name="fechaNacimiento"
            required
        />

        <label class="label" for="observaciones">Observaciones:</label>
        <textarea
            bind:value={observaciones}
            class="input rounded-3xl"
            placeholder="Ej: Es blanco, tiene la cola cortada, etc..."
            name="observaciones"
        />

        <label class="label" for="direccion">Peso en kilos:</label>
        <input
            bind:value={peso}
            class="input [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            type="number"
            step="0.01"
            placeholder="Ej: 20"
            name="direccion"
            required
        />

        <label class="label" for="castrado">Castración:</label>
        <ListBox
            active="variant-filled-primary"
            hover="hover:variant-soft-primary"
            multiple
            class="w-full max-w-[480px]"
        >
            <ListBoxItem
                bind:group={castrado}
                name="medium"
                value="Castrado"
                class="border"
            >
                Está castrado
            </ListBoxItem>
        </ListBox>

        <label class="label" for="vacunasAplicadas">Vacunas aplicadas:</label>
        <ListBox
            active="variant-filled-primary"
            hover="hover:variant-soft-primary"
            multiple
            class="w-full max-w-[480px]"
        >
            {#each ["Vacuna A", "Vacuna B"] as vacuna}
                <ListBoxItem
                    bind:group={vacunas}
                    name="medium"
                    value={vacuna}
                    class="border"
                >
                    {vacuna}
                </ListBoxItem>
            {/each}
        </ListBox>
        <p class="text-red-500">{errorNoExisteClienteMSG}</p>
        <button class="btn rounded-lg variant-filled-primary" type="submit"
            >Cargar perro</button
        >
    </form>
</div>
