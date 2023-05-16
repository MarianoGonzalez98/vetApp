export type Oficio = "Paseador" | "Cuidador" | "Ambos"

export interface PaseadorCuidador {
    nombre: string,
    apellido: string,
    zona: string,
    disponibilidadDeFechasDesde: string,
    disponibilidadDeFechasHasta: string,
    disponibilidadHorariaDesde: string,
    disponibilidadHorariaHasta: string,
    telefono: string,
    email: string,
    oficio: Oficio,
    disponible: boolean;
}