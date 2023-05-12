<script lang="ts">
    import { goto } from "$app/navigation";
    import { user } from "$lib/stores/user";
    import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
    import { DateInput } from 'date-picker-svelte'
 
    let motivo = '';
    let perro = 1;

    let fecha = new Date();
    let fechaMin = new Date();
    let format = 'dd-MM-yyyy'
    let placeholder= 'Elija una fecha'

    let rangoHorario = '';
    let emailOwner = $user?.email;
    let aceptado = false;


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

    const fallaServidor: ModalSettings = {
        type: "alert",
        title: "Fallo en la solicitud del turno",
        body: "Falla del servidor",
        buttonTextCancel: "Ok",
    };

    const handleSolicitud = async () =>{ 
        fetch('http://localhost:3000/api/turnos',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({motivo:motivo, perro:perro, fecha:fecha.toJSON().slice(0,10), rangoHorario:rangoHorario, emailOwner:emailOwner, aceptado:aceptado})
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



<div class="container h-full mx-auto flex justify-center items-center">
    <div class="card p-4">
        <h2>Solicitar turno</h2>
        <br>
        <form on:submit|preventDefault={handleSolicitud} class="space-y-2">

            <label class="label" for="motivo">Motivo</label>
            <select bind:value={motivo} class="select"  name="motivo" required>
                <option value="1">Vacunación</option>
                <option value="2">Castración</option>
                <option value="3">Anti-Parasitación</option>
                <option value="4">Consulta general</option>
            </select>
            
            <!-- El perro va a tener que elegirse de la lista de perros del cliente   -->

            <label class="label" for="fecha">Fecha del turno</label>
            <DateInput bind:value={fecha} bind:format={format}  bind:min={fechaMin} bind:placeholder={placeholder}/> 

            <label class="label" for="rangoHorario">Rango Horario</label>
            <select bind:value={rangoHorario} class="select"  name="rangoHorario" required>
                <option value="1">Mañana</option>
                <option value="2">Tarde</option>
                <option value="3">Noche</option>
            </select>

            <br>
            <br>
            <button class="btn rounded-lg variant-filled" type="submit">Aceptar</button>
        </form>

    </div>

</div>