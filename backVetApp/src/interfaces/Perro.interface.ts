export type Sexo = "Macho" | "Hembra"

export interface Perro {
    id: number
    nombre: string,
    raza: string,
    sexo: Sexo,
    fechaNacimiento: Date,
    observaciones: string;
    historiaClinica: null, //Turno[]
    libretaSanitaria: null, //LibretaSanitaria[]
    foto: null,
    owner: string;
    fallecido: boolean,
}

export interface VacunaAplicada {
    nombre: string,
    fechaDeAplicacion: Date
}

export interface AntiparasitarioAplicado {
    nombre: string,
    cantidadAplicada: number
}

export interface LibretaSanitaria {
    peso: number,
    vacunasAplicadas: VacunaAplicada[],
    antiparasitariosAplicados: AntiparasitarioAplicado[]
}