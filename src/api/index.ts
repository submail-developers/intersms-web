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

// 获取客户列表
export const getAccountList = (data: API.AccountListParams) => {
  return request.post<
    any,
    API.Response<API.AccountListItem[]>,
    API.AccountListParams
  >('customer/get_sender_list', { ...data })
}

// 删除客户
export const deleteAccount = (data: API.DeleteAccountParams) => {
  return request.post<any, API.Response<any>, API.DeleteAccountParams>(
    'customer/delete_sender_info',
    { ...data },
  )
}

// 新增客户
export const addAccount = (data: API.AddAccountParams) => {
  return request.post<any, API.Response<any>, API.AddAccountParams>(
    'customer/add_sender_info',
    { ...data },
  )
}

// 获取敏感词列表
export const GetSensitiveWordList = (data: API.GetSensitiveWordListParams) => {
  return request.post<any, API.Response<any>, API.GetSensitiveWordListParams>(
    'customer/get_sensitive_keywords',
    { ...data },
  )
}


// 新增敏感词列表
export const AddSensitiveWordList = (data: API.AddSensitiveWordListParams) => {
  return request.post<any, API.Response<any>, API.AddSensitiveWordListParams>(
    'customer/save_sensitive_keywords',
    { ...data },
  )
}

// 删除敏感词列表
export const DeleteSensitiveWordList = (data: API.DeleteSensitiveWordListParams) => {
  return request.post<any, API.Response<any>, API.DeleteSensitiveWordListParams>(
    'customer/delete_sensitive_keywords',
    { ...data },
  )
}
// 敏感词批量启用/停用
export const SensitiveWordListStopUsing = (data: API.SensitiveWordListStopUsingParams) => {
  return request.post<any, API.Response<any>, API.SensitiveWordListStopUsingParams>(
    'customer/update_sensitive_keywords_status',
    { ...data },
  )
}