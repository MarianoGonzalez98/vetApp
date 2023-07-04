import type { ModalSettings } from "@skeletonlabs/skeleton";

export const productoCargado: ModalSettings = {
    type: "alert",
    title: "Producto cargado",
    body: "Producto cargado correctamente",
    buttonTextCancel: "Ok",
    response: (r: boolean) => location.reload(),
};

export const fallaDesconocida: ModalSettings = {
    type: "alert",
    title: "Error desconocido",
    body: "No se pudo actualizar el perfil",
    buttonTextCancel: "Ok",
};

export const fallaServidor: ModalSettings = {
    type: "alert",
    title: "Fallo en la carga del producto",
    body: "Falla del servidor",
    buttonTextCancel: "Ok",
};