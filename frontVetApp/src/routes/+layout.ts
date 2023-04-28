import type { LayoutLoad } from './$types';

export const load = (async () => {
    return {};
}) satisfies LayoutLoad;


//importante para que el build haga una página estática.
export const prerender = true;