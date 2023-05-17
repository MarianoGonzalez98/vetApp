export type Oficio = "Paseador" | "Cuidador" | "Ambos"

export interface Horario {
    desde: string;
    hasta: string;
}

export interface Disponibilidad {
    [dia: string]: Horario;
}

export interface PaseadorCuidador {
    nombre: string,
    apellido: string,
    zona: string,
    disponibilidad: Disponibilidad,
    telefono: string,
    email: string,
    oficio: Oficio,
    disponible: boolean,
}