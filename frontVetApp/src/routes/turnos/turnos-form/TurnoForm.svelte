<script lang="ts">
    import { goto } from "$app/navigation";
    import type { Cliente } from "$lib/interfaces/Cliente.interface";
    import type { PerroTurno } from "$lib/interfaces/Perro.interface";
    import { user } from "$lib/stores/user";
    import { backendURL } from "$lib/utils/constantFactory";
    import { modalStore, type ModalSettings, Modal } from '@skeletonlabs/skeleton';
    import { DateInput } from 'date-picker-svelte'
    import { onMount } from "svelte";
 
    let motivo = '';

    let fecha = new Date();
    let fechaMin = new Date();
    let format = 'dd/MM/yyyy'
    let placeholder= 'Elija una fecha'

    let rangoHorario = '';
    let emailOwner = $user?.email;

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
            `${backendURL}/listar-perros?cliente=${emailOwner}`, 
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



    const SolicitudEnviada: ModalSettings = {
	type: 'alert',
	title: 'Solicitud de turno',
	body: 'Solicitud enviada',
    buttonTextCancel: "Ok",
    response: (r: boolean) => goto("/turnos/"),
    };

    const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Fallo en la solicitud del turno",
        body: "No se pudo solicitar el nuevo turno",
        buttonTextCancel: "Ok",
    };

    const fallaRangoCompleto: ModalSettings = {
        type: "alert",
        title: "Fallo en la solicitud del turno por cupo completo",
        body: "No se pudo solicitar el nuevo turno. Seleccione otro rango horario u otra fecha",
        buttonTextCancel: "Ok",
    };

    const fallaServidor: ModalSettings = {
        type: "alert",
        title: "Fallo en la solicitud del turno",
        body: "Falla del servidor",
        buttonTextCancel: "Ok",
    };

    const handleSolicitud = async () =>{ 
        fetch(`${backendURL}/turnos/turnos-form`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                motivo, 
                perroNombre:perro.nombre,
                perroId:perro.id, 
                fecha:fecha.toJSON().slice(0,10),
                rangoHorario, 
                emailOwner
            })
        })
        .then((res) => {
                if (res.status < 299) {
                    modalStore.clear();
                    modalStore.trigger(SolicitudEnviada);
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
                    modalStore.trigger(fallaRangoCompleto);
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
                console.log("Error en la solicitud del turno desconocido: ", error);
            });
    }

</script>

<Modal />

<div class="container h-full mx-auto flex justify-center items-center">
    <div class="card p-4">
        <h2>Solicitar turno</h2>
        <br>

        <div>
            <label for="seleccionPerro">Seleccione el perro</label>
            <select id="seleccionPerro" style="color: black;" bind:value={perro} on:change={actualizarFormPerro} required>
                {#each perros as perro}
                    <option value={perro}>
                        <span>{perro.nombre} </span>
                    </option>
                {/each}
            </select>
        </div>

        <form on:submit|preventDefault={handleSolicitud} class="space-y-2">

            <label class="label" for="motivo">Motivo</label>
            <select bind:value={motivo} class="select"  name="motivo" required>
                <option value="Vacunación a">Vacunación a</option>
                <option value="Vacunación b">Vacunación b</option>
                <option value="Castración">Castración</option>
                <option value="Anti-Parasitación">Anti-Parasitación</option>
                <option value="Consulta general">Consulta general</option>
            </select>
            
            <!-- El perro va a tener que elegirse de la lista de perros del cliente   -->

            <label class="label" for="fecha">Fecha del turno</label>
            <DateInput class="DateInput" bind:value={fecha} bind:format={format}  bind:min={fechaMin} /> 

            <label class="label" for="rangoHorario">Rango Horario</label>
            <select bind:value={rangoHorario} class="select"  name="rangoHorario" required>
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