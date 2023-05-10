import { user } from '$lib/stores/user';
import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import { browser } from '$app/environment';

export const load = (async () => {
    if (browser){
        if (!get(user)){
            throw error(401,'Acceso no permitido');
        }
    }
    return {};
}) satisfies PageLoad;