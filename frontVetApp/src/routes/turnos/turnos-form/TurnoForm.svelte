<script lang="ts">
    import { goto } from "$app/navigation";
    import type { Cliente } from "$lib/interfaces/Cliente.interface";
    import type { Antiparasitario, Perro, PerroTurno, Vacuna } from "$lib/interfaces/Perro.interface";
    import { user } from "$lib/stores/user";
    import { backendURL } from "$lib/utils/constantFactory";
    import { modalStore, type ModalSettings, Modal } from '@skeletonlabs/skeleton';
    import { DateInput } from 'date-picker-svelte'
    import { onMount } from "svelte";
 
    let motivo = "Consulta general";

    let fecha = new Date();
    let fechaMin = new Date();
    let format = 'dd/MM/yyyy'
    let placeholder= 'Elija una fecha'

    let rangoHorario = '';
    let emailOwner = $user?.email;

    
    let inputPerro: PerroTurno = {
        nombre: "",
        id: -1
    }
    let perro: Perro ={
        id: 0,
        nombre: "",
        raza: "",
        sexo: "Hembra",
        fechaNacimiento: "",
        observaciones: "",
        vacunas: "",
        antiparasitarios: "",
        peso: 0,
        foto: null,
        owner: "",
        fallecido: false,
        castrado: false
    };

    let perros: Perro[] = [];

    let vacunasAplicadas: Vacuna[] = [];
    let castrado:Boolean;

    let vacunacion:boolean = false;
    let vacunasA: Vacuna[];
    let ultimaVacA:Vacuna;

    let vacunacionB:boolean = false;
    let vacunasB: Vacuna[];
    let ultimaVacB:Vacuna;
    
    let vacunasAux:Vacuna[];

    //Me quedo con el año anterior al actual para comparar que haya pasado por lo menos un año desde la última vacuna
    let fechaMinVac: Date = new Date();
    fechaMinVac.setFullYear(fechaMinVac.getFullYear()-1);
    let fechaMinStrng: String = fechaMinVac.toJSON().slice(0,4);
    let fechaMinNum: Number = Number (fechaMinStrng);
    

    const actualizarFormPerro = () => {
        vacunasAplicadas = JSON.parse(perro.vacunas);
        vacunasAux = vacunasAplicadas;

        console.log(vacunasAux)

        vacunasA =  vacunasAux.filter(v => v.nombre === "Vacuna A"); // me quedo con las vacunas tipo A
        ultimaVacA = vacunasA[vacunasA.length - 1]; // me quedo con la última aplicada
        if (ultimaVacA !== undefined) {
            let fechaVac:Number = Number (ultimaVacA.fechaDeAplicacion.slice(0,4)); // me quedo con el año
            if (fechaVac <= fechaMinNum) {
                vacunacion = true;
            }
            else {vacunacion = false}
        }
        else {vacunacion = true}

        vacunasB =  vacunasAux.filter(v => v.nombre === "Vacuna B"); // me quedo con las vacunas tipo A
        ultimaVacB = vacunasB[vacunasB.length - 1]; // me quedo con la última aplicada
        if (ultimaVacB !== undefined) {
            let fechaVacB:Number = Number (ultimaVacB.fechaDeAplicacion.slice(0,4)); // me quedo con el año
            if (fechaVacB <= fechaMinNum) {
                vacunacionB = true;
            }
            else {vacunacionB = false}
        }
        else {vacunacionB = true}

        inputPerro.nombre=perro.nombre;
        inputPerro.id = perro.id;
        castrado = perro.castrado
        motivo = "Consulta general";
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
            <div class="space-y-2" >
                {#if vacunacion === true}
                <label class="flex items-center space-x-2">
                    <input class="radio" bind:group={motivo}  type="radio" name="radio-direct" value="Vacunación a" />
                    <p>Vacunación a</p>
                </label>
                {/if}
                {#if vacunacionB === true}
                <label class="flex items-center space-x-2">
                    <input class="radio" bind:group={motivo} type="radio" name="radio-direct" value="Vacunación b" />
                    <p>Vacunación b</p>
                </label>
                {/if}
                {#if castrado === false}
                <label class="flex items-center space-x-2">
                    <input class="radio" bind:group={motivo} type="radio" name="radio-direct" value="Castración" />
                    <p>Castración</p>
                </label>
                {/if}
                <label class="flex items-center space-x-2">
                    <input class="radio" bind:group={motivo} type="radio" name="radio-direct" value="Anti-Parasitación" />
                    <p>Anti-Parasitación</p>
                </label>
                <label class="flex items-center space-x-2">
                    <input class="radio" bind:group={motivo} type="radio" name="radio-direct" value="Consulta general" checked />
                    <p>Consulta general</p>
                </label>
            </div>

            <!-- <label class="label" for="motivo">Motivo</label>
            <select bind:value={motivo} class="select"  placeholder="motivo" name="motivo" required>
                <option value=""></option>
                {#if vacunacion === true}
                <option value="Vacunación a">Vacunación a</option>
                {/if}
                {#if vacunacionB === true}
                <option value="Vacunación b">Vacunación b</option>
                {/if}
                {#if castrado === false}
                <option value="Castración">Castración</option>
                {/if}
                <option value="Anti-Parasitación">Anti-Parasitación</option>
                <option value="Consulta general">Consulta general</option>
            </select> -->
            
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