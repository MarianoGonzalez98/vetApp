export interface Perdida{ // y Búsqueda
    id:number,

    emailContacto:string,
    nombreContacto:string,
    apellidoContacto:string,
    telefonoContacto:string,

    autorEmail:string,
    fechaPublicacion: string,

    nombrePerro:string,
    razaPerro:string,
    fechaNacPerro:string, // en búsqueda no se usa
    sexoPerro:string,
    foto:string | null,
    descripcionPerro: string;

    encontrado:boolean, // en búsqueda dueño encontrado
    fechaPerdido: string;
    plazaPerdido: string;
}

