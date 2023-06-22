import { get } from 'svelte/store';
import type { LayoutLoad } from './$types';
import { user } from '$lib/stores/user';
import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';
import { page } from '$app/stores';

export const load = (async () => {
    return {};
}) satisfies LayoutLoad;

if ((browser) && localStorage.getItem('carrito') === null){ //si no existe el carrito, lo inicializo vacío
    localStorage.setItem('carrito',JSON.stringify([]));
}

//importante para que el build haga una página estática.
export const prerender = false;
export const trailingSlash = 'always';
export const ssr = false