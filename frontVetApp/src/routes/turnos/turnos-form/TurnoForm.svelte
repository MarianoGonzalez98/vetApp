<script lang="ts">
    import { goto } from "$app/navigation";
    import { user } from "$lib/stores/user";
    import { modalStore, type ModalSettings, Modal } from '@skeletonlabs/skeleton';
    import { DateInput } from 'date-picker-svelte'
    import { onMount } from "svelte";
 
    let motivo = '';
    let perroNombre = '';
    let perro = 1;

    let fecha = new Date();
    let fechaMin = new Date();
    let format = 'dd-MM-yyyy'
    let placeholder= 'Elija una fecha'

    let rangoHorario = '';
    let emailOwner = $user?.email;

  /*   onMount(async () => {
		fetch('http://localhost:3000/getPerros',{
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
            perroNombre=res.nombre;
            perroId=res.id;
        }).catch( (e)  => {
            console.log("ERROR:");
            console.log(e);
        })
	});
 */

    const SolicitudEnviada: ModalSettings = {
	type: 'alert',
	title: 'Solicitud de turno',
	body: 'Solicitud enviada',
    buttonTextCancel: "Ok",
    response: (r: boolean) => goto("/"),
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
        fetch("http://localhost:3000/turnos/turnos-form",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                motivo, 
                perro, 
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
            <DateInput bind:value={fecha} bind:format={format}  bind:min={fechaMin} bind:placeholder={placeholder}/> 

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