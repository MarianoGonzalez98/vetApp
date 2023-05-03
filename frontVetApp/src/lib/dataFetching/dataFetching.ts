import type { ApiResponse } from "$lib/interfaces/ApiResponse.interface";

export const getTestData = async (url: string): Promise<ApiResponse<string>> => {
	const response = await fetch(url);
	const apiResponse: ApiResponse<string> = await response.json();
	return apiResponse;
}