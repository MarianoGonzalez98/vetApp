export interface Auth {
    email:string,
    password:string
} 

export interface User extends Auth {
    id:number,
    role:string
}