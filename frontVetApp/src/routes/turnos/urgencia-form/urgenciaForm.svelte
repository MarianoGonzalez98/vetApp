<script lang="ts">
    import { goto } from "$app/navigation";
    import { user } from "$lib/stores/user";
    import type { Cliente } from "$lib/interfaces/Cliente.interface"
    import {  modalStore, type ModalSettings, Modal } from "@skeletonlabs/skeleton";
    import DateInput from "date-picker-svelte/DateInput.svelte";
    import { onMount } from "svelte";
    import type { Id, Perro, PerroTurno } from "$lib/interfaces/Perro.interface";


    let cliente:Cliente = {
        nombre: "",
        apellido: "",
        email: ""
    };
    let inputCliente:Cliente={
        nombre:"",
        apellido:"",
        email:""
    }
    let clientes: Cliente[] = [];


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

    const actualizarForm = () => {
        inputCliente.nombre=cliente.nombre;
        inputCliente.apellido = cliente.apellido;
        inputCliente.email = cliente.email;
        fetch(
            `http://localhost:3000/listar-perros?cliente=${cliente.email}`, 
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
        
    }

    
    onMount ( async () => {

        await fetch('http://localhost:3000/clientes',{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
            },
            credentials: 'include',
        }).then( (res) => {
                return res.json()
        }).then( (res) => {
            clientes = res.clientes;

        }).catch( (e)  => {
            console.log("ERROR:");
            console.log(e);
        })

    })

    
    let motivoVacA = false ;
    let motivoVacB = false ;
    let motivoAntiPar = false ;
    let motivoCas = false ;

    let motivoVacAs = '' ;
    let motivoVacBs = '' ;
    let motivoAntiPars = '' ;
    let motivoCass = '' ;

    const actualizarFormMotivo = () => { // Disculpen lo hardcodeado
        if(motivoVacA) {
            motivoVacAs = "Vacunación a, "
        }
        if(!motivoVacA) {
            motivoVacAs = '' ;
        }
        if(motivoVacB) {
            motivoVacBs = "Vacunación b, " 
        }
        if(!motivoVacB) {
            motivoVacBs = '' ;
        }
        if(motivoCas) {
            motivoAntiPars = "Castración, " 
        }
        if(!motivoCas) {
            motivoAntiPars = '' ;
        }
        if(motivoAntiPar) {
            motivoCass = "Anti-Parasitación, "
        }
        if(!motivoAntiPar) {
            motivoCass = '' ;
        }
    }



    let fecha = new Date();
    let fechaMax = new Date();
    let format = 'dd-MM-yyyy'
    let placeholder= 'Elija una fecha'

    let rangoHorario = '';

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
            body: JSON.stringify({
                motivo: motivoVacAs +""+ motivoVacBs +""+ motivoCass +""+ motivoAntiPars, 
                perro: perro.id, 
                fecha:fecha.toJSON().slice(0,10), 
                rangoHorario, 
                emailOwner:cliente.email, 
                descripcion
            })
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
        
        <div>
            <label for="seleccionCliente">Seleccione el cliente</label>
            <select id="seleccionCliente" style="color: black;" bind:value={cliente} on:change={actualizarForm}>
                {#each clientes as cliente}
                    <option value={cliente}>
                        <span>{cliente.nombre} {cliente.apellido} (email: {cliente.email})</span>
                    </option>
                {/each}
            </select>

            <label for="seleccionPerro">Seleccione el perro</label>
            <select id="seleccionPerro" style="color: black;" bind:value={perro} on:change={actualizarFormPerro}>
                {#each perros as perro}
                    <option value={perro}>
                        <span>{perro.nombre} </span>
                    </option>
                {/each}
            </select>
        </div>


        <form on:submit|preventDefault={handleUrgencia}  class="space-y-2">


            <label class="label" for="motivo">Motivo/s</label> 
            <div class="flex items-center space-x-2">
                <label class="flex items-center space-x-2">
                    <input type=checkbox bind:checked={motivoVacA}  on:change={actualizarFormMotivo}>
                    <p>Vacunación a</p>
                </label>
                <label class="flex items-center space-x-2">
                    <input type=checkbox bind:checked={motivoVacB} on:change={actualizarFormMotivo}>
                    <p>Vacunación B</p>
                </label>
                <label class="flex items-center space-x-2">
                    <input type=checkbox bind:checked={motivoCas} on:change={actualizarFormMotivo}>
                    <p>Castración</p>
                </label>
                <label class="flex items-center space-x-2">
                    <input type=checkbox bind:checked={motivoAntiPar} on:change={actualizarFormMotivo}>
                    <p>Anti-parasitación</p>
                </label>                
            </div>
            
            <label class="label" for="fecha">Fecha del turno</label>
            <DateInput bind:value={fecha} bind:format={format} bind:max={fechaMax} bind:placeholder={placeholder}/> 

            <label class="label" for="rangoHorario">Rango Horario</label>
            <select bind:value={rangoHorario} class="select"  name="rangoHorario" required>
                <option value="1">Mañana</option>
                <option value="2">Tarde</option>
                <option value="3">Noche</option>
            </select>

            <label class="label"> 
                <span>Descripción</span>
                <textarea class="textarea" rows="2" placeholder="Ingrese una descripción" bind:value={descripcion} />
            </label>

            <br>
            <br>
            <button class="btn rounded-lg variant-filled" type="submit">Aceptar</button>
        </form>

    </div>

</div>