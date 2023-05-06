export interface Turno {
    motivo: Motivo
    perro: string
    fecha: Date
    rangoHorario: 'Mañana' | 'Tarde' | 'Noche'
}

export interface Motivo {
    motivo: 'Vacunacion' | 'Castracion' | 'Anti-Parasitacion' | 'Consulta general'
}