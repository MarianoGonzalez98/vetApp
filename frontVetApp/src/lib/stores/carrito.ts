import { browser } from "$app/environment";
import type { ItemCarrito } from "$lib/interfaces/Carrito.interface";

import { writable } from "svelte/store";

//https://stackoverflow.com/questions/71213109/error-when-evaluating-ssr-module-src-stores-js-referenceerror-localstorage-is
//https://dev.to/delanyobott/comment/1egh0
let carrito: ItemCarrito[] = [];
if (browser) {
    carrito = JSON.parse(localStorage.carrito || '');
}

const productosCarrito = writable<ItemCarrito[]>(carrito); //inicializa el user con el usuario en localstorage

productosCarrito.subscribe((value) => {
    if (browser) {
        localStorage.carrito = JSON.stringify(value);
    }
})
export { productosCarrito }