export type Oficio = "Paseador" | "Cuidador" | "Ambos"

export interface PaseadorCuidador {
    nombre: string,
    apellido: string,
    zona: string,
    telefono: string,
    email: string,
    oficio: Oficio,
    disponible: boolean;
    horarios: string;
}