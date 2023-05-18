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
 * 全局公共接口start
 */
// 获取全部国家
export const getAllCountry = (
  data: API.GetCountryParams = { country_cn: '' },
) => {
  return request.post<
    any,
    API.Response<API.GetCountryItem[]>,
    API.GetCountryParams
  >('customer/get_all_country_network_list', { ...data })
}
// 获取全部已配置网络的国家
export const getAllNetCountry = () => {
  return request.post<any, API.Response<any>, null>(
    'customer/get_all_country_network_list',
  )
}
/**
 * 全局公共接口end
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
  return request.post<any, API.Response<API.ChannelItem>, API.AddAccountParams>(
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

// 获取通道列表
export const getChannelList = (data: API.Ids) => {
  return request.post<any, API.Response<API.ChannelItem[]>, API.Ids>(
    'customer/get_channel',
    { ...data },
  )
}
// 新增/修改通道
export const saveChannel = (data: API.AddChannelParams) => {
  return request.post<any, API.Response<any>, API.AddChannelParams>(
    'customer/save_channel',
    { ...data },
  )
}
// 新增/修改通道
export const deleteChannel = (data: API.Ids) => {
  return request.post<any, API.Response<any>, API.Ids>(
    'customer/delete_channel',
    { ...data },
  )
}
// 获取通道关联的国家
export const getChannelCountryList = (data: API.getChannelCountryParams) => {
  return request.post<any, API.Response<any>, API.getChannelCountryParams>(
    'customer/get_channel_related_country_network',
    { ...data },
  )
}
// 修改通道关联国家及网络，已存在的关联国家直接跳过
export const updateChannelCountryNetwork = (
  data: API.UpdateChannelCountryNetworkParams,
) => {
  return request.post<
    any,
    API.Response<any>,
    API.UpdateChannelCountryNetworkParams
  >('customer/update_channel_related_country_network', { ...data })
}
// 修改通道关联国家及网络，已存在的关联国家直接跳过
export const updateChannelCountryNetworkPrice = (
  data: API.UpdateChannelCountryNetworkPriceParams,
) => {
  return request.post<
    any,
    API.Response<any>,
    API.UpdateChannelCountryNetworkPriceParams
  >('customer/update_channel_related_country_network_prices', { ...data })
}
// 批量启用禁用通道关联国家及网络
export const updateChannelCountryNetworkStatus = (
  data: API.UpdateChannelCountryNetworkStatusParams,
) => {
  return request.post<
    any,
    API.Response<any>,
    API.UpdateChannelCountryNetworkStatusParams
  >('customer/update_channel_related_country_network_status', { ...data })
}
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

// 获取开启状态的敏感词列表
export const GetOpenSensitiveWordList = (
  data: API.GetSensitiveWordListParams,
) => {
  return request.post<any, API.Response<any>, API.GetSensitiveWordListParams>(
    'customer/get_all_sensitive_keywords_list',
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
