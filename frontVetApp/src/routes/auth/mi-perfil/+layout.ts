import { browser } from '$app/environment';
import { user } from '$lib/stores/user';
import { get } from 'svelte/store';
import type { LayoutLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async () => {
    if (browser){
        if (!get(user)){
            throw error(401,'Acceso no permitido');
        }
    }
}) satisfies LayoutLoad;