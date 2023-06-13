<script lang="ts">
    import type { Donacion, PaymentID } from "$lib/interfaces/Donaciones.interface";
    import { backendURL } from "$lib/utils/constantFactory";
    import { onMount } from "svelte";
    import { base } from '$app/paths'
    import { afterNavigate } from "$app/navigation";

    let donaciones: (Donacion&PaymentID)[] = [];
    let previousPage : string = '/donaciones' ;

    afterNavigate(({from}) => {
        previousPage = from?.url?.pathname || '/donaciones'
    }) 

    onMount( async () => {
        await fetch(
            `${backendURL}/donaciones/ver-mis-donaciones`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        )
        .then((res) => res.json())
        .then((apiResponse) => (donaciones = apiResponse.misDonaciones));

        console.log(donaciones);
    })

    const descargarComprobante = async (donacion:Donacion&PaymentID) => {
        await fetch(
            `${backendURL}/donaciones/descargar-comprobante`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body:JSON.stringify({paymentId:donacion.paymentId})
            }
        ).then(resp => resp.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            // the filename you want
            a.download = `comprobanteDonacion${donacion.paymentId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        });
    }
</script>
<div class="flex flex-wrap mb-4">
    <a class="btn variant-filled m-4 mb-0" rel="noreferrer" href="{previousPage}">Atras</a>
</div>
<h1 class="h1 font-medium ml-3 mb-3">Mis donaciones realizadas</h1>

<div class="ml-2 flex flex-wrap">
    {#each donaciones as donacion}
        <div class="card variant-ghost-secondary p-1 max-w-xs m-2">
            <section class="p-4">
                <p>
                    <span class="font-medium"
                        >Campaña:
                    </span>{donacion.nombreCampaign}
                </p>
                <p>
                    <span class="font-medium"
                        >Fecha y hora:
                    </span>{new Date(donacion.fechaHora).toLocaleDateString("es-AR")} 
                    {new Date(donacion.fechaHora).toLocaleTimeString("es-AR",{timeStyle: 'short'})}
                </p>
                <p>
                    <span class="font-medium"
                        >Monto neto donado:
                    </span>${donacion.monto}
                </p>
                <p>
                    <button on:click={(event) => descargarComprobante(donacion)} 
                        class="btn rounded-lg variant-filled-primary mt-3">Descargar comprobante
                    </button>
                </p>
            </section>
        </div>
    {/each}
</div>
