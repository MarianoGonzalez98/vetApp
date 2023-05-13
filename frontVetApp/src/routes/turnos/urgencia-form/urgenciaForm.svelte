<script lang="ts">
    import { goto } from "$app/navigation";
    import { user } from "$lib/stores/user";
    import { type AutocompleteOption,Autocomplete, modalStore, type ModalSettings, Modal } from "@skeletonlabs/skeleton";
    import DateInput from "date-picker-svelte/DateInput.svelte";

    let cliente = '';
    const clientsOptions: AutocompleteOption[] = [ 
        {label: "Carlos", value: "carlos"},
        {label: "Luis", value: "luis"},
        {label: "Fabiana", value: "fabiana"},
        {label: "Hilda", value: "hilda"},
        {label: "Rodolfo", value: "rodolfo"},
        {label: "Pedro", value: "pedro"}
    ]

    function onClientSelection(event: any): void {
        cliente = event.detail.label;
    }

    let motivo = '' ;
    let perro = 1;
    let fecha = new Date();
    let fechaMax = new Date();
    let format = 'dd-MM-yyyy'
    let placeholder= 'Elija una fecha'
    let rangoHorario = '';
    let emailOwner = $user?.email;
    let descripcion = '';


    const UrgenciaRegistrada: ModalSettings = {
	type: 'alert',
	title: 'Registro de urgencia',
	body: 'Registro realizado',
    buttonTextCancel: "Ok",
    response: (r: boolean) => goto("/"),
    };

    const fallaDesconocida: ModalSettings = {
        type: "alert",
        title: "Fallo en el registro de la urgencia",
        body: "No se pudo registrar la urgencia",
        buttonTextCancel: "Ok",
    };

    const fallaServidor: ModalSettings = {
        type: "alert",
        title: "Fallo en la solicitud del turno",
        body: "Falla del servidor",
        buttonTextCancel: "Ok",
    };


const handleUrgencia = async () =>{ 
        fetch("http://localhost:3000/turnos/urgencia-form",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            credentials: "include",
            body: JSON.stringify({motivo, perro, fecha:fecha.toJSON().slice(0,10), rangoHorario, emailOwner, descripcion})
        })
        .then((res) => {
                if (res.status < 299) {
                    modalStore.clear();
                    modalStore.trigger(UrgenciaRegistrada);
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
                console.log("Error en el registro de la urgencia desconocido: ", error);
            });
    }

</script>

<Modal />

<div class="container h-full mx-auto flex justify-center items-center">
    <div class="card p-4">
        <h2>Registar urgencia</h2>
        <br>
        <form on:submit|preventDefault={handleUrgencia}  class="space-y-2">

            <input class="input" type="search" name="cliente" bind:value={cliente} placeholder="Search..." />
            <div class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto">
                <Autocomplete bind:input={cliente} options={clientsOptions} on:selection={onClientSelection} />
            </div>
            

            <label class="label" for="motivo">Motivo/s</label> <!-- concatenar los motivos separados por ","-->
            <div class="space-y-2">
                <label class="flex items-center space-x-2">
                    <input class="checkbox" type="checkbox" bind:value={motivo[0]} checked />
                    <p>Vacunación a</p>
                </label>
                <label class="flex items-center space-x-2">
                    <input class="checkbox" type="checkbox" bind:value={motivo[1]} />
                    <p>Vacunación b</p>
                </label>
                <label class="flex items-center space-x-2">
                    <input class="checkbox" type="checkbox" bind:value={motivo[2]}/>
                    <p>Castración</p>
                </label>
                <label class="flex items-center space-x-2">
                    <input class="checkbox" type="checkbox" bind:value={motivo[3]} />
                    <p>Anti-parasitación</p>
                </label>
            </div>
            
            <!-- El perro va a tener que elegirse de la lista de perros del cliente seleccionado  -->

            <label class="label" for="fecha">Fecha del turno</label>
            <DateInput bind:value={fecha} bind:format={format} bind:max={fechaMax} bind:placeholder={placeholder}/> 

            <label class="label" for="rangoHorario">Rango Horario</label>
            <select bind:value={rangoHorario} class="select"  name="rangoHorario" required>
                <option value="1">Mañana</option>
                <option value="2">Tarde</option>
                <option value="3">Noche</option>
            </select>

            <label class="label"> <!-- Descripcion -->
                <span>Descripción</span>
                <textarea class="textarea" rows="2" placeholder="Ingrese una descripción" />
            </label>

            <br>
            <br>
            <button class="btn rounded-lg variant-filled" type="submit">Aceptar</button>
        </form>

    </div>

</div>