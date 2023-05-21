export type Sexo = "Macho" | "Hembra"

export interface Perro {
    id: number //PERDÓN, LO NECESITO
    nombre: string,
    raza: string,
    sexo: Sexo,
    fechaNacimiento: string,
    observaciones: string;
    historiaClinica: null, //Turno[]
    libretaSanitaria: null, //LibretaSanitaria[]
    foto: null,
    owner: string;
    fallecido: boolean,
}

export interface Id {
    id: number;
}

export interface InfoPerroAdopcion {
    nombre: string,
    raza: string,
    sexo: string,
    fechaNacimiento: string,
}

export interface PerroTurno {
    nombre: string
    id: number
}
