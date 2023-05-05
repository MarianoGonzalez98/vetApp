import { writable } from "svelte/store";

const jwtToken = writable<string| null>();