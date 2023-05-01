import type { UserData } from "./User.interface";

export interface ApiResponse<T> {
  data: T,
  statusCode: number,
}

export interface LoginData<T>{
  userData:UserData,
  token:string,
}