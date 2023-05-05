import { browser } from "$app/environment";
import type { UserData } from "$lib/interfaces/User.interface";
import { writable } from "svelte/store";

//https://stackoverflow.com/questions/71213109/error-when-evaluating-ssr-module-src-stores-js-referenceerror-localstorage-is
//https://dev.to/delanyobott/comment/1egh0
let storedUser: UserData| null=null;
if (browser){
    storedUser= JSON.parse(localStorage.getItem('user') || 'null');
}

const user = writable<UserData| null>(storedUser); //inicializa el user con el usuario en localstorage

user.subscribe((value) => { //actualiza el localstorage si cambia el valor del store del user
    if (browser){
        localStorage.user = JSON.stringify(value);
    }
})
export {user}