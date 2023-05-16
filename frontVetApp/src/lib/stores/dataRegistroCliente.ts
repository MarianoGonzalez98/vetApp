import type { DatosRegistroCliente } from "$lib/interfaces/User.interface";
import { writable } from "svelte/store";

export const dataRegistroCliente = writable<DatosRegistroCliente|null>(null);