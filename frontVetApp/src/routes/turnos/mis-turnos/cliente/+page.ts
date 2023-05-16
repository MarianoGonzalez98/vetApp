import { user } from '$lib/stores/user';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { browser } from '$app/environment';

export const load = (async () => {
    if ((browser)&& (get(user)?.rol !== 'cliente')){
        throw error(401,'Acceso no permitido');
    }

    return {};
}) satisfies PageLoad;