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
    fechaNacimiento: Date,
    observaciones: string;
    vacunas: string;
    antiparasitarios: string;
    peso: number;
    foto: null,
    owner: string;
    fallecido: boolean,
    castrado: boolean,
    paraCruza: boolean,
}