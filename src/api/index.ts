import request from './request'
import { API } from 'apis'

// 示例接口-get
export const getPetInfo = (params: API.PetInfoParams) => {
  return request.get<any, API.Response<API.PetInfoRes>, API.PetInfoParams>(
    '/pet/',
    {
      params,
    },
  )
}

// 示例接口-post
export const createPet = (data: API.CreatePetParams) => {
  return request.post<any, API.Response<API.PetInfoRes>, API.CreatePetParams>(
    '/pet',
    { ...data },
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
  )
}

// 示例接口-get
export const getNumberList = () => {
  return request.get<any, API.Response<number[]>, API.PetInfoParams>(
    'customer/zjhtest_get/',
  )
}

// 获取发送列表
export const getSendList = (data: API.GetSendListParams) => {
  return request.post<
    any,
    API.Response<API.SendListItem[]>,
    API.GetSendListParams
  >('customer/get_send_list', { ...data })
}
