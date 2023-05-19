export interface AdopcionInput{
    emailContacto:string,
    nombreContacto:string,
    apellidoContacto:string,
    telefonoContacto:string,
    autorEmail:string,
    nombrePerro:string,
    razaPerro:string,
    fechaNacPerro:string,
}

export interface Adopcion extends AdopcionInput{
    adoptado:boolean
}

export interface PublicacionAdopcion{
    nombre:string,
    raza:string,
    fechaNacimiento:string,
    email:string,
    adoptado:boolean,
    fechaPublicacion:string,
    autorEmail:string,
}
