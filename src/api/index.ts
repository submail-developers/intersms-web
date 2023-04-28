import request from "./request"
import type RES from './response.d.ts';

// 示例接口-get
export const getPetInfo = (params: API.PetInfo) => {
  return request.get<any, API.Response<RES.PetInfoRes>, API.PetInfo>('/pet/', {params})
}
// 示例接口-post
export const createPet = (data: API.CreatePet) => {
  return request.post<any, API.Response<RES.PetInfoRes>, API.CreatePet>('/pet', {...data}, {headers: {"Content-Type": 'application/x-www-form-urlencoded'}})
}

// 示例接口-get
export const getNumberList = () => {
  return request.get<any, API.Response<number[]>, API.PetInfo>('customer/zjhtest_get/')
}