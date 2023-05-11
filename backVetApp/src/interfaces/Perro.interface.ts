export type Sexo = "Macho" | "Hembra"

export interface Perro {
    nombre: string,
    raza: string,
    sexo: Sexo,
    fechaNacimiento: Date,
    observaciones: string;
    historiaClinica: null,//Turno[]
    libretaSanitaria: LibretaSanitaria
    foto: null,
    dueño: string;
}

export interface vacunaAplicada {
    nombre: string,
    fechaDeAplicacion: Date
}

export interface antiparasitarioAplicado {
    nombre: string,
    cantidadAplicada: number
}

export interface LibretaSanitaria {
    peso: number,
    vacunasAplicadas: vacunaAplicada[],
    antiparasitariosAplicados: antiparasitarioAplicado[]
}