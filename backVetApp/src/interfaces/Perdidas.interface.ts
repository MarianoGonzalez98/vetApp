export interface Perdida{
    id:number,

    emailContacto:string,
    nombreContacto:string,
    apellidoContacto:string,
    telefonoContacto:string,

    autorEmail:string,
    fechaPublicacion: string,

    nombrePerro:string,
    razaPerro:string,
    fechaNacPerro:string,
    sexoPerro:string,
    foto:string | null,
    descripcionPerro: string;

    encontrado:boolean,
    duenoEncontrado:boolean,
    fechaPerdido: string;
    plazaPerdido: string;
}

