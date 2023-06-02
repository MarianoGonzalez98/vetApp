<script lang="ts">
    import { goto } from "$app/navigation";
    import { user } from "$lib/stores/user";
    import type { Cliente } from "$lib/interfaces/Cliente.interface"
    import {  modalStore, type ModalSettings, Modal } from "@skeletonlabs/skeleton";
    import DateInput from "date-picker-svelte/DateInput.svelte";
    import { onMount } from "svelte";
    import type { Antiparasitario, Id, Perro, PerroTurno, Vacuna } from "$lib/interfaces/Perro.interface";


    let cliente:Cliente = {
        nombre: "",
        apellido: "",
        email: ""
    };
    let inputCliente:Cliente={
        nombre:"",
        apellido:"",
        email:""
    };
    let clientes: Cliente[] = [];


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
    let peso:number;

    let antiparasitarios: Antiparasitario[] = [];
    let antipAplicado: Antiparasitario = {
        nombre:"",
        fechaDeAplicacion:"",
        cantidadAplicada:0,
    };

    const actualizarFormPerro = () => {
        vacunasAplicadas = JSON.parse(perro.vacunas);
        antiparasitarios = (JSON.parse(perro.antiparasitarios));
        peso = perro.peso;
    }

    const actualizarForm = () => {
        inputCliente.nombre=cliente.nombre;
        inputCliente.apellido = cliente.apellido;
        inputCliente.email = cliente.email;
        console.log(cliente.nombre);
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
            let vacunaAplicada: Vacuna = {
                nombre: "Vacuna A",
                fechaDeAplicacion: fecha.toJSON().slice(0, 10),
            };
            vacunasAplicadas.push(vacunaAplicada);
        }
        if(!motivoVacA) {
            motivoVacAs = '' ;
            vacunasAplicadas = vacunasAplicadas.filter(vacuna => (vacuna.nombre !== 'Vacuna A')&&(vacuna.fechaDeAplicacion !== fecha.toJSON().slice(0, 10)));
        }
        if(motivoVacB) {
            motivoVacBs = "Vacunación b, " 
            let vacunaAplicada: Vacuna = {
                nombre: "Vacuna B",
                fechaDeAplicacion: fecha.toJSON().slice(0, 10),
            };
            vacunasAplicadas.push(vacunaAplicada);
        }
        if(!motivoVacB) {
            motivoVacBs = '' ;
            vacunasAplicadas = vacunasAplicadas.filter(vacuna => (vacuna.nombre !== 'Vacuna B')&&(vacuna.fechaDeAplicacion !== fecha.toJSON().slice(0, 10)));
        }
        if(motivoCas) {
            motivoCass = "Castración, " 
            castrado = true;
        }
        if(!motivoCas) {
            motivoCass = '' ;
            castrado = perro.castrado;
        }
        if(motivoAntiPar) {
            motivoAntiPars = "Anti-Parasitación, "
            antipAplicado = {
                nombre: antipAplicado.nombre,
                fechaDeAplicacion: fecha.toJSON().slice(0, 10),
                cantidadAplicada: antipAplicado.cantidadAplicada
            } 
            antiparasitarios.push(antipAplicado);
        }
        if(!motivoAntiPar) {
            motivoAntiPars = '' ;
            antiparasitarios = antiparasitarios.filter(antip => (antip.fechaDeAplicacion !== fecha.toJSON().slice(0, 10)));
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
                motivo: (motivoVacAs +""+ motivoVacBs +""+ motivoCass +""+ motivoAntiPars).slice(0, (motivoVacAs +""+ motivoVacBs +""+ motivoCass +""+ motivoAntiPars).length-2), 
                perroNombre: perro.nombre,
                perroId: perro.id, 
                fecha:fecha.toJSON().slice(0,10), 
                rangoHorario, 
                emailOwner:cliente.email, 
                descripcion,

                vacunas: JSON.stringify(vacunasAplicadas),
                antiparasitarios: JSON.stringify(antiparasitarios),
                castrado,
                peso
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


        <form on:submit|preventDefault={handleUrgencia}  class="space-y-2">
            <div>
                <label for="seleccionCliente">Seleccione el cliente</label>
                <select id="seleccionCliente" class="select" bind:value={cliente} on:change={actualizarForm} required>
                    {#each clientes as cliente}
                        <option value={cliente}>
                            <span>{cliente.nombre} {cliente.apellido} (email: {cliente.email})</span>
                        </option>
                    {/each}
                </select>
    
                <label for="seleccionPerro">Seleccione el perro</label>
                <select id="seleccionPerro" class="select" bind:value={perro} on:change={actualizarFormPerro} required>
                    {#each perros as perro}
                        <option value={perro}>
                            <span>{perro.nombre} </span>
                        </option>
                    {/each}
                </select>

                <label class="label" for="fecha">Fecha del turno</label>
                <DateInput bind:value={fecha} bind:format={format} bind:max={fechaMax} bind:placeholder={placeholder}/> 

                <label class="label" for="rangoHorario">Rango Horario</label>
                <select bind:value={rangoHorario} class="select"  name="rangoHorario" required>
                    <option value="Manana">Mañana</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noche">Noche</option>
                </select>
            </div>

            <label class="label" for="motivo">Motivo/s</label> 
            <div class="flex items-center space-x-2">
                <label class="flex items-center space-x-2">
                    <input type=checkbox bind:checked={motivoVacA}  on:change={actualizarFormMotivo}>
                    <p>Vacunación A</p>
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
            {#if motivoAntiPar===true}
                <label class="label">
                    <span>Ingrese nombre del anti-parasitario</span>
                    <input class="input" bind:value={antipAplicado.nombre} title="Input (text)" type="text" required/>
                </label>
            {/if}
            {#if motivoAntiPar===true}
                <label class="label">
                    <span>Ingrese dosis de anti-parasitario (cantidad de gotas/Kg de peso)</span>
                    <input class="input" bind:value={antipAplicado.cantidadAplicada}  title="Input (number)" type="number" min="1" required/>
                </label>
            {/if}

            <label class="label">
                <span>Ingrese el peso del perro</span>
                    <input class="input" bind:value={peso}  title="input [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" type="number" step="0.01" min="0" required/>
            </label>

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