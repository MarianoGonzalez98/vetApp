export interface Auth {
    email:string,
    password:string
} 

export interface User extends Auth {
    id:number,
    rol:string
}

export interface UserData {
    email:string,
    rol:string,
    seCambioPassword:boolean,
}