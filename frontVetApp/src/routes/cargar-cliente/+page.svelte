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
    let apellido = "";
    let email = "";
    let dni = "";
    let direccion = "";
    let telefono = "";
    let fechaNacimiento: string = new Date().toJSON().slice(0, 10);

    const handleCarga = () => {
        fetch("http://localhost:3000/registrar-cliente", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                nombre,
                apellido,
                email,
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
            placeholder="Ingrese nombre del cliente"
            name="nombre"
            required
        />

        <label class="label" for="apellido">Apellido:</label>
        <input
            bind:value={apellido}
            class="input"
            type="text"
            placeholder="Ingrese apellido del cliente"
            name="apellido"
            required
        />

        <label class="label" for="email">Email:</label>
        <input
            bind:value={email}
            class="input"
            type="text"
            placeholder="Ingrese email del cliente"
            name="email"
            required
        />

        <label class="label" for="dni">DNI:</label>
        <input
            bind:value={dni}
            class="input"
            type="text"
            placeholder="Ingrese dni del cliente"
            name="dni"
            required
        />

        <label class="label" for="fechaNacimiento">Fecha de nacimiento:</label>
        <input
            bind:value={fechaNacimiento}
            class="input"
            type="date"
            placeholder="Ingrese fecha de nacimiento del cliente"
            name="fechaNacimiento"
            required
        />

        <label class="label" for="direccion">Dirección:</label>
        <input
            bind:value={direccion}
            class="input"
            type="text"
            placeholder="Ingrese dirección del cliente"
            name="direccion"
            required
        />

        <label class="label" for="dni">Teléfono:</label>
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
