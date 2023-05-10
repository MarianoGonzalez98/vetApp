import { get } from 'svelte/store';
import type { LayoutLoad } from './$types';
import { user } from '$lib/stores/user';
import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';
import { page } from '$app/stores';

export const load = (async () => {
    return {};
}) satisfies LayoutLoad;


//importante para que el build haga una página estática.
export const prerender = true;
export const trailingSlash = 'always';
