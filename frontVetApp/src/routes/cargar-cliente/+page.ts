import { user } from '$lib/stores/user';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async () => {
    if (get(user)?.rol !== 'veterinario'){
        throw error(401,'Acceso no permitido');
    }

    return {};
}) satisfies PageLoad;