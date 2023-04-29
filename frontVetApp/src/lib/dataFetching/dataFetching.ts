import type { ApiResponse } from "$lib/interfaces/ApiResponse.interface";

export const getTestData = async (url: string): Promise<ApiResponse> => {
	const response = await fetch(url);
	const apiResponse: ApiResponse = await response.json();
	return apiResponse;
}