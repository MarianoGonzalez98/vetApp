import type { UserData } from "$lib/interfaces/User.interface";
import { writable } from "svelte/store";

const user = writable<UserData| null>();
//const user = writable<UserData>({email:"",rol:""});

export {user}