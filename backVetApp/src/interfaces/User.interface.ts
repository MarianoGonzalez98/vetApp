export interface Auth {
    email:string,
    password:string
} 

export interface User extends Auth {
    id:number,
    rol:string,
    primerLoginHecho:boolean,
}

export interface UserData {
    email:string,
    rol:string
    primerLoginHecho:boolean,
}