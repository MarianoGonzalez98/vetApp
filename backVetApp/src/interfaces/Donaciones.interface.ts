export interface Donacion{
    fechaHora:string,
    monto:number,
    emailDonante:string,
    nombreCampaign:string,
}

export interface PaymentID {
    paymentId:number,
}

export interface Campaign {
    nombre: string;
    montoARecaudar: number;
    montoRecaudado: number;
    fechaLimite: string;
    descripcion: string;
    finalizada: boolean;
}