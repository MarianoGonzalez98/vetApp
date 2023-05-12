export interface Turno {
    motivo: Motivo
    perro: number // id del perro
    fecha: Date
    rangoHorario: 'Mañana' | 'Tarde' | 'Noche'
    emailOwner: string
    aceptado: boolean
    descripcion: string
}

export interface Motivo {
    motivo: 'Vacunacion' | 'Castracion' | 'Anti-Parasitacion' | 'Consulta general'
}