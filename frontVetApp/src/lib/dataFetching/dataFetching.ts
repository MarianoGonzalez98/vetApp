import type { ApiResponse } from "$lib/interfaces/ApiResponse.interface";
import type { PaseadorCuidador } from "$lib/interfaces/PaseadoresYCuidadores.interface";

export const getTestData = async (url: string): Promise<ApiResponse<string>> => {
	const response = await fetch(url);
	const apiResponse: ApiResponse<string> = await response.json();
	return apiResponse;
}

export const getPaseadoresData = async (url: string): Promise<ApiResponse<PaseadorCuidador[]>> => {
	const response = await fetch(url);
	const apiResponse: ApiResponse<PaseadorCuidador[]> = await response.json();
	return apiResponse;
}