export interface Auth {
    email:string,
    password:string
} 

export interface User extends Auth {
    id:number,
    rol:string,
    seCambioPassword:boolean,
}

export interface UserData {
    email:string,
    rol:string
    seCambioPassword:boolean,
}

export interface Rol{
    rol:string;
}

export interface Persona{
    nombre:string,
    apellido:string,
    email:string
    dni:string,
    fechaNacimiento:Date,
    direccion: string,
    telefono:string,
    foto: string | null
}

export interface Cliente extends Persona{
    perros: null, //Perro[]
}