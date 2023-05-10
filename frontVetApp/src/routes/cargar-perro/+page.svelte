<script lang="ts">
    import { goto } from "$app/navigation";
    import { user } from "$lib/stores/user";
    import type { ModalSettings } from "@skeletonlabs/skeleton";
    import { Modal, modalStore } from "@skeletonlabs/skeleton";

    const clienteCargado: ModalSettings = {
        type: "alert",
        title: "Cliente cargado",
        body: "Cliente registrado correctamente",
        buttonTextCancel: "Ok",
        response: (r: boolean) => goto("/"),
    };

    const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Fallo de la carga del cliente",
        body: "No se pudo registrar el nuevo cliente",
        buttonTextCancel: "Ok",
    };

    const fallaServidor: ModalSettings = {
        type: "alert",
        title: "Fallo de la carga del cliente",
        body: "Falla del servidor",
        buttonTextCancel: "Ok",
    };

    const fallaYaRegistrado: ModalSettings = {
        type: "alert",
        title: "Fallo de la carga del cliente",
        body: "El email del cliente ya se encuentra registrado",
        buttonTextCancel: "Ok",
    };

    let nombre = "";
    let raza = "";
    let sexo = "";
    let peso = "";
    let telefono = "";
    let observaciones = "";
    let fechaNacimiento: string = new Date().toJSON().slice(0, 10);
    const fechaHoy = new Date(Date.now());
    const fechaHoyString = `${fechaHoy.getFullYear()}-${(
        fechaHoy.getMonth() + 1
    )
        .toString()
        .padStart(2, "0")}-${fechaHoy.getDate().toString().padStart(2, "0")}`;

    const handleCarga = () => {
        fetch("http://localhost:3000/registrar-cliente", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                nombre,
                raza,
                sexo,
                dni,
                direccion,
                telefono,
                fechaNacimiento,
                foto: null,
            }),
        })
            .then((res) => {
                if (res.status < 299) {
                    modalStore.clear();
                    modalStore.trigger(clienteCargado);
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
                    modalStore.trigger(fallaYaRegistrado);
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
                console.log("Error en carga del cliente desconocido: ", error);
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

        <label class="label" for="direccion">Peso:</label>
        <div class="peso-wrapper" style="position: relative;">
            <input
                bind:value={peso}
                class="input"
                type="text"
                placeholder="Ej: 20"
                name="direccion"
                required
            />
            <span
                class="texto-adorno opacity-30"
                style="position: absolute; top: 50%; transform: translateY(-50%); pointer-events: none;"
                >Kg</span
            >
            //LO DEJÉ TRATANDO DE QUE APAREZCA KG DESPUÉS DEL PESO
        </div>

        <label class="label" for="dni">Vacunas aplicadas:</label>
        <input
            bind:value={telefono}
            class="input"
            type="text"
            placeholder="Ingrese teléfono del cliente"
            name="telefono"
            required
        />

        <button class="btn rounded-lg variant-filled-primary" type="submit"
            >Registrar cliente</button
        >
    </form>
</div>
