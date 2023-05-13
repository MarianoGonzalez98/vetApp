export type Sexo = "Macho" | "Hembra"

export interface Perro {
    nombre: string,
    raza: string,
    sexo: Sexo,
    fechaNacimiento: string,
    observaciones: string;
    historiaClinica: null, //Turno[]
    libretaSanitaria: null, //LibretaSanitaria[]
    foto: null,
    owner: string;
}

export interface Id {
    id:number;
}

export interface InfoPerroAdopcion {
    nombre: string,
    raza: string,
    sexo: string,
    fechaNacimiento: string,
}
