<script lang="ts">
    import { goto } from "$app/navigation";
    import { user } from "$lib/stores/user";
    import type { Cliente, ClienteConMonto } from "$lib/interfaces/Cliente.interface"
    import {  modalStore, type ModalSettings, Modal } from "@skeletonlabs/skeleton";
    import DateInput from "date-picker-svelte/DateInput.svelte";
    import { onMount } from "svelte";
    import type { Antiparasitario, Id, Perro, PerroTurno, Vacuna } from "$lib/interfaces/Perro.interface";
    import { backendURL } from "$lib/utils/constantFactory";


    let fecha = new Date();
    let fechaMax = new Date();
    let format = 'dd-MM-yyyy'
    let placeholder= 'Elija una fecha'

    let rangoHorario = '';

    let descripcion = '';


    let cliente:ClienteConMonto = {
        nombre: "",
        apellido: "",
        email: "",
        montoAcumuladoDescuento:0
    };
    let inputCliente:ClienteConMonto={
        nombre:"",
        apellido:"",
        email:"",
        montoAcumuladoDescuento:0
    };
    let clientes: ClienteConMonto[] = [];


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

    let precioIngresado:number = 0;
    let hayPrecio:boolean = false;

    let vacunacion:boolean = false;
    let vacunasA: Vacuna[];
    let ultimaVacA:Vacuna;

    let vacunacionB:boolean = false;
    let vacunasB: Vacuna[];
    let ultimaVacB:Vacuna;
    
    let vacunasAux:Vacuna[];

    //Me quedo con el año anterior al actual para comparar que haya pasado por lo menos un año desde la última vacuna
    let fechaMin: Date = new Date();
    fechaMin.setFullYear(fechaMin.getFullYear()-1);
    let fechaMinStrng: String = fechaMin.toJSON().slice(0,4);
    let fechaMinNum: Number = Number (fechaMinStrng);
    


    let descuento50: number;


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

        antiparasitarios = (JSON.parse(perro.antiparasitarios));
        peso = perro.peso;
        castrado = perro.castrado
    }

    const actualizarForm = () => {
        inputCliente.nombre=cliente.nombre;
        inputCliente.apellido = cliente.apellido;
        inputCliente.email = cliente.email;
        inputCliente.montoAcumuladoDescuento = cliente.montoAcumuladoDescuento;

        fetch(
            `${backendURL}/listar-perros?cliente=${cliente.email}`, 
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

        await fetch(`${backendURL}/listar-clientes`,{
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

    const actualizar50Desc = () => {
        descuento50 = 50 * precioIngresado / 100;
        hayPrecio = true;
    }
    
    let motivoVacA = false ;
    let motivoVacB = false ;
    let motivoAntiPar = false ;
    let motivoCas = false ;

    let motivoVacAs = '' ;
    let motivoVacBs = '' ;
    let motivoAntiPars = '' ;
    let motivoCass = '' ;

    


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
        if(motivoVacA) {
            motivoVacAs = "Vacunación a, "
            let vacunaAplicada: Vacuna = {
                nombre: "Vacuna A",
                fechaDeAplicacion: fecha.toJSON().slice(0, 10),
            };
            vacunasAplicadas.push(vacunaAplicada);

            console.log(vacunasAplicadas)
        }
        if(motivoVacB) {
            motivoVacBs = "Vacunación b, " 
            let vacunaAplicada: Vacuna = {
                nombre: "Vacuna B",
                fechaDeAplicacion: fecha.toJSON().slice(0, 10),
            };
            vacunasAplicadas.push(vacunaAplicada);
        }
        if(motivoCas) {
            motivoCass = "Castración, " 
            castrado = true;
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

        fetch(`${backendURL}/turnos/urgencia-form`,{
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
                peso,

                precioIngresado,
                descuentoCliente: cliente.montoAcumuladoDescuento
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

            <label class="label" for="motivo">Atenciones extra</label> 
            <div class="flex items-center space-x-2">
                {#if vacunacion === true}
                <label class="flex items-center space-x-2">
                    <input type=checkbox bind:checked={motivoVacA} >
                    <p>Vacunación A</p>
                </label>
                {/if}
                {#if vacunacionB === true}
                <label class="flex items-center space-x-2">
                    <input type=checkbox bind:checked={motivoVacB}>
                    <p>Vacunación B</p>
                </label>
                {/if}
                {#if perro.castrado === false}
                <label class="flex items-center space-x-2">
                    <input type=checkbox bind:checked={motivoCas} >
                    <p>Castración</p>
                </label>
                {/if}
                <label class="flex items-center space-x-2">
                    <input type=checkbox bind:checked={motivoAntiPar}>
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
                    <span>Ingrese dosis de anti-parasitario (mg/kg)</span>
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

            <label class="label">
                <span>Ingrese el precio del turno</span>
                    <input class="input" bind:value={precioIngresado} title="input [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" type="number" step="0.01" min="0" on:change={actualizar50Desc} required/>
            </label>
            <div class="card p-4">
                {#if hayPrecio}
                    {#if cliente.montoAcumuladoDescuento <= descuento50}
                        <span>Descuento acumulado del cliente por donaciones: {cliente.montoAcumuladoDescuento}</span> <br>
                        <span>Descuento máximo (50% del precio): {descuento50}</span><br>
                        <header>Precio final del turno: {precioIngresado - cliente.montoAcumuladoDescuento}</header>
                    {/if}
                    {#if cliente.montoAcumuladoDescuento > descuento50}
                        <span>Descuento acumulado del cliente por donaciones: {cliente.montoAcumuladoDescuento}</span> <br>
                        <span>Descuento máximo (50% del precio): {descuento50}</span><br>
                        <header>Precio final: {precioIngresado - descuento50}</header>
                    {/if}   
                {/if}
            </div>


            <br>
            <br>
            <button class="btn rounded-lg variant-filled" type="submit">Aceptar</button>
        </form>

    </div>

</div>