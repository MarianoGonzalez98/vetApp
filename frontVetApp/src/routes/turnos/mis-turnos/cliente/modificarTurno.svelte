<script lang="ts">
    import type { PerroTurno } from "$lib/interfaces/Perro.interface";
    import type { Turno } from "$lib/interfaces/Turno.interface";
    import { Modal, modalStore, type ModalSettings } from "@skeletonlabs/skeleton";
    import DateInput from "date-picker-svelte/DateInput.svelte";
    import { onMount } from "svelte";
    import { user } from "$lib/stores/user";
    import { goto } from "$app/navigation";


    let format = 'dd-MM-yyyy'
    let fechaMin = new Date();
    let emailOwner = $user?.email;
    let turno:Turno;


    let perro: PerroTurno = {
        nombre: "",
        id: -1
    }
    let inputPerro: PerroTurno = {
        nombre: "",
        id: -1
    }
    let perros: PerroTurno[] = [];

    const actualizarFormPerro = () => {
        inputPerro.nombre=perro.nombre;
        inputPerro.id = perro.id;
    }

    onMount ( async () => {

        await  fetch(
            `http://localhost:3000/listar-perros?cliente=${emailOwner}`, 
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

     })

     const turnoModificado: ModalSettings = {
        type: "alert",
        title: "truno actualizado",
        body: "Turno actualizado correctamente",
        buttonTextCancel: "Ok",
        response: (r: boolean) => goto("/turnos"),
    };

     const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Error desconocido",
        body: "No se pudo actualizar el perfil",
        buttonTextCancel: "Ok",
    };

    const fallaServidor: ModalSettings = {
        type: "alert",
        title: "Fallo en actualizacion del perfil",
        body: "Falla del servidor",
        buttonTextCancel: "Ok",
    };

     const handleModificacion = () => {
        fetch("http://localhost:3000/turnos/modificar-turno", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                turno
            }),
        })
        .then((res) => {
                if (res.status < 299) {
                    modalStore.clear();
                    modalStore.trigger(turnoModificado);
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


     
</script>

<Modal />

<div class="container h-full mx-auto flex justify-center items-center">
    <div class="card p-4">
        <h2>Modificar turno</h2>
        <br>

        <form on:submit|preventDefault={handleModificacion} class="space-y-2">

            <div>
                <label for="seleccionPerro">Seleccione el perro</label>
                <select id="seleccionPerro" style="color: black;" bind:value={perro} on:change={actualizarFormPerro}>
                    {#each perros as perro}
                        <option value={perro}>
                            <span>{perro.nombre} </span>
                        </option>
                    {/each}
                </select>
            </div>    

            <label class="label" for="motivo">Motivo</label>
            <select bind:value={turno.motivo} class="select"  name="motivo" required>
                <option value="Vacunación a">Vacunación a</option>
                <option value="Vacunación b">Vacunación b</option>
                <option value="Castración">Castración</option>
                <option value="Anti-Parasitación">Anti-Parasitación</option>
                <option value="Consulta general">Consulta general</option>
            </select>
            
            <!-- El perro va a tener que elegirse de la lista de perros del cliente   -->

            <label class="label" for="fecha">Fecha del turno</label>
            <DateInput bind:value={turno.fecha} bind:format={format}  bind:min={fechaMin} /> 

            <label class="label" for="rangoHorario">Rango Horario</label>
            <select bind:value={turno.rangoHorario} class="select"  name="rangoHorario" required>
                <option value="Manana">Mañana</option>
                <option value="Tarde">Tarde</option>
                <option value="Noche">Noche</option>
            </select>

            <br>
            <br>
            <button class="btn rounded-lg variant-filled" type="submit">Aceptar</button>
        </form>

    </div>

</div>