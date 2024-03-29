export type Sexo = "Macho" | "Hembra"

export interface Vacuna {
    nombre: string;
    fechaDeAplicacion: string;
}

export interface Antiparasitario {
    nombre: string;
    fechaDeAplicacion: string;
    cantidadAplicada: number;
}

export interface Perro {
    id: number
    nombre: string,
    raza: string,
    sexo: Sexo,
    fechaNacimiento: string,
    observaciones: string;
    vacunas: string;
    antiparasitarios: string;
    peso: number;
    foto: null,
    owner: string;
    fallecido: boolean,
    castrado: boolean,
    paraCruza: boolean,
    fechaDeCelo: string,
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


export interface InfoPerroPerdido {
    nombre: string,
    raza: string,
    sexo: string,
    fechaNacimiento: string,
    descripcion: string,
    foto: string | null,
    fechaPerdido: string,
    plazaPerdido: string,
}


export interface PerroTurno {
    nombre: string
    id: number
}
