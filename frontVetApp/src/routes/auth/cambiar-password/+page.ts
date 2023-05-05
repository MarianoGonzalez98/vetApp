import { user } from '$lib/stores/user';
import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

export const load = (async () => {
    if (!get(user)){
        throw error(401,'Acceso no permitido');
    }
    return {};
}) satisfies PageLoad;