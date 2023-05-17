import request from './request'
import { API } from 'apis'

/**
 * 示例接口及测试接口start
 */

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

/**
 * 示例接口及测试接口end
 */

/**
 * 发送列表start
 */

// 获取发送列表
export const getSendList = (data: API.GetSendListParams) => {
  return request.post<
    any,
    API.Response<API.SendListItem[]>,
    API.GetSendListParams
  >('customer/get_send_list', { ...data })
}
/**
 * 发送列表end
 */

/**
 * 客户信息start
 */

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

/**
 * 客户信息end
 */

/**
 * 通道组管理start
 */

/**
 * 通道组管理end
 */

/**
 * 通道管理start
 */

/**
 * 通道管理end
 */

/**
 * 通道管理start
 */

/**
 * 通道管理end
 */

/**
 * 国家信息配置start
 */

/**
 * 国家信息配置end
 */

/**
 * 网络信息配置start
 */

/**
 * 网络信息配置end
 */

/**
 * 号码通道路由start
 */

/**
 * 号码通道路由end
 */

/**
 * 报警设置start
 */

/**
 * 报警设置end
 */

/**
 * 号码归属查询start
 */

/**
 * 号码归属查询end
 */

/**
 * 敏感词管理start
 */

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
export const DeleteSensitiveWordList = (
  data: API.DeleteSensitiveWordListParams,
) => {
  return request.post<
    any,
    API.Response<any>,
    API.DeleteSensitiveWordListParams
  >('customer/delete_sensitive_keywords', { ...data })
}
// 敏感词批量启用/停用
export const SensitiveWordListStopUsing = (
  data: API.SensitiveWordListStopUsingParams,
) => {
  return request.post<
    any,
    API.Response<any>,
    API.SensitiveWordListStopUsingParams
  >('customer/update_sensitive_keywords_status', { ...data })
}

/**
 * 敏感词管理end
 */

/**
 * 关键词管理start
 */
// 获取关键词列表
export const GetkeyWord = (data: API.GetkeyWordParams) => {
  return request.post<any, API.Response<any>, API.GetkeyWordParams>(
    'customer/get_keywords_route',
    { ...data },
  )
}

// 新增关键词列表
export const AddkeyWord = (data: API.AddkeyWordParams) => {
  return request.post<any, API.Response<any>, API.AddkeyWordParams>(
    'customer/save_keywords_route',
    { ...data },
  )
}
// 删除关键词列表
export const DeletekeyWord = (data: API.DeletekeyWordParams) => {
  return request.post<any, API.Response<any>, API.DeletekeyWordParams>(
    'customer/delete_keywords_route',
    { ...data },
  )
}
// 关键词批量启用/停用
export const keyWordStopUsing = (data: API.keyWordStopUsingParams) => {
  return request.post<any, API.Response<any>, API.keyWordStopUsingParams>(
    'customer/update_keywords_route_status',
    { ...data },
  )
}
/**
 * 关键词管理end
 */

/**
 * 状态码对照表start
 */

/**
 * 状态码对照表end
 */

/**
 * 黑名单管理start
 */

/**
 * 黑名单管理end
 */

/**
 * 登陆start
 */

/**
 * 登陆end
 */
