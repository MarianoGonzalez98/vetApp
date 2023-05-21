<script lang="ts">
    import { afterNavigate, beforeNavigate, goto } from "$app/navigation";
    import { dataRegistroCliente } from "$lib/stores/dataRegistroCliente";
    import { user } from "$lib/stores/user";
    import type { ModalSettings } from "@skeletonlabs/skeleton";
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
    let vacunasAplicadas: string[] = [];
    let foto: null;
    let owner = $user?.email;
    const fechaHoy = new Date(Date.now());
    const fechaHoyString = `${fechaHoy.getFullYear()}-${(
        fechaHoy.getMonth() + 1
    )
        .toString()
        .padStart(2, "0")}-${fechaHoy.getDate().toString().padStart(2, "0")}`;

    afterNavigate((nav: AfterNavigate) => {
        if (
            $user?.rol === "veterinario" &&
            nav.from?.route.id !== "/cargar-cliente"
        ) {
            goto("/");
        }
    });
    beforeNavigate((nav: BeforeNavigate) => {
        if (nav?.to?.route.id !== "/cargar-cliente") {
            $dataRegistroCliente = null;
        }
    });

    const handleCarga = async () => {
        if ($user?.rol === "veterinario") {
            owner = $dataRegistroCliente?.email;
        }
        let error = false;

        if ($user?.rol === "veterinario" && !error) {
            await fetch("http://localhost:3000/registrar-cliente", {
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
                        modalStore.clear();
                        modalStore.trigger(perroClienteCargado);
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
                    modalStore.clear();
                    modalStore.trigger(fallaDesconocida);
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
        await fetch("http://localhost:3000/cargar-perro", {
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
                vacunasAplicadas,
                owner,
                foto: null,
            }),
        })
            .then((res) => {
                if (res.status < 299) {
                    modalStore.clear();
                    modalStore.trigger(perroCargado);
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
    class="container mt-2 mb-10 h-full mx-auto flex justify-center items-center"
>
    <form on:submit|preventDefault={handleCarga} class="space-y-2">
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
            placeholder="Ej: 20"
            name="direccion"
            required
        />

        <label class="label" for="vacunasAplicadas">Vacunas aplicadas:</label>
        {#each ["Vacuna A", "Vacuna B"] as vacuna}
            <input
                bind:group={vacunasAplicadas}
                type="checkbox"
                value={vacuna}
            />
            {vacuna}
        {/each}

        <button class="btn rounded-lg variant-filled-primary" type="submit"
            >Cargar perro</button
        >
    </form>
</div>
