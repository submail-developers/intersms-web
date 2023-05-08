import request from './request'
import { Response, CreatePet, GetPetInfo, PetInfoRes } from './interface'

// 示例接口-get
export const getPetInfo = (params: GetPetInfo.PetInfoParams) => {
  return request.get<any, Response<PetInfoRes>, GetPetInfo.PetInfoParams>(
    '/pet/',
    {
      params,
    },
  )
}

// 示例接口-post
export const createPet = (data: CreatePet.CreatePetParams) => {
  return request.post<any, Response<PetInfoRes>, CreatePet.CreatePetParams>(
    '/pet',
    { ...data },
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
  )
}

// 示例接口-get
export const getNumberList = () => {
  return request.get<any, Response<number[]>, GetPetInfo.PetInfoParams>(
    'customer/zjhtest_get/',
  )
}
