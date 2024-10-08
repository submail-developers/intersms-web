import request from './request'
import { API } from 'apis'

/**
 * 示例接口及测试接口start
 */

// 示例接口-get
export const getPetInfo = (params: API.PetInfoParams) => {
  return request.get<any, API.Response<API.PetInfoRes>, API.PetInfoParams>(
    'mytest/console/api/pet/',
    {
      params,
    },
  )
}

// 示例接口-post
export const createPet = (data: API.CreatePetParams) => {
  return request.post<any, API.Response<API.PetInfoRes>, API.CreatePetParams>(
    'mytest/console/api/pet',
    { ...data },
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
  )
}

// 示例接口-get
export const getNumberList = () => {
  return request.get<any, API.Response<number[]>, API.PetInfoParams>(
    'console/api/customer/zjhtest_get/',
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
  >('console/api/customer/get_all_country_network_list', { ...data })
}
// 获取全部已配置网络的国家
export const getAllNetCountry = () => {
  return request.post<any, API.Response<API.LetterCountryItem[]>, null>(
    'console/api/customer/get_all_country_network_list',
  )
}
// 获取该用户账户下的国际短信appid, 参数 sender  用户account字段， 32位随机码id
export const getAppid = (data: API.GetAppidParams) => {
  return request.post<
    any,
    API.Response<API.GetAppidItem[]>,
    API.GetAppidParams
  >('console/api/customer/get_account_all_intersms_app', { ...data })
}
/**
 * 常用-国家中文名称+地区代码start
 */

export const GetRegioncodeByCountry = (
  data: API.GetRegioncodeByCountryParams = { country_cn: '', keyword: '' },
) => {
  return request.post<
    any,
    API.Response<API.LetterCountryItem[]>,
    API.GetRegioncodeByCountryParams
  >('console/api/customer/get_regioncode_by_country', { ...data })
}

/**
 * 常用-国家中文名称+地区代码end
 */
/**
 * 全局公共接口end
 */

/**
 * 发送列表start
 */

// 获取发送列表
export const getSendList = (data: API.GetSendListParams) => {
  return request.post<any, API.SendListRes, API.GetSendListParams>(
    'console/api/customer/get_send_list',
    { ...data },
  )
}
/**
 * 发送列表end
 */

/**
 * 客户信息start
 */

// 获取客户列表
export const getAccountList = (data: API.AccountListParams) => {
  return request.post<any, API.AccountListRes, API.AccountListParams>(
    'console/api/customer/get_sender_list',
    { ...data },
  )
}

// 删除客户
export const deleteAccount = (data: API.DeleteAccountParams) => {
  return request.post<any, API.Response<any>, API.DeleteAccountParams>(
    'console/api/customer/delete_sender_info',
    { ...data },
  )
}

// 新增客户
export const addAccount = (data: API.AddAccountParams) => {
  return request.post<any, API.Response<API.ChannelItem>, API.AddAccountParams>(
    'console/api/customer/add_sender_info',
    { ...data },
  )
}
// 客户信息-获取国家价格配置列表
export const getAccountPriceList = (data: API.GetAccountConfigListParams) => {
  return request.post<
    any,
    API.Response<API.AccountPriceItem[]>,
    API.GetAccountConfigListParams
  >('console/api/customer/get_sender_country', { ...data })
}
// 客户信息-获取国家通道配置列表
export const getAccountChannelList = (data: API.GetAccountConfigListParams) => {
  return request.post<
    any,
    API.Response<API.AccountChannelItem[]>,
    API.GetAccountConfigListParams
  >('console/api/customer/get_sender_country_channel', { ...data })
}
// 客户信息-获取失败处理配置列表
export const getAccountErrorList = (data: API.GetAccountConfigListParams) => {
  return request.post<
    any,
    API.Response<API.AccountErrorItem[]>,
    API.GetAccountConfigListParams
  >('console/api/customer/get_sender_error_handle', { ...data })
}
// 客户信息-新增/修改国家价格配置
export const updateAccountPrice = (data: API.UpdateAccountPriceParams) => {
  return request.post<any, API.Response<any>, API.UpdateAccountPriceParams>(
    'console/api/customer/save_sender_country',
    { ...data },
  )
}
// 客户信息-新增/修改国家通道配置
export const updateAccountChannel = (data: API.UpdateAccountChannelParams) => {
  return request.post<any, API.Response<any>, API.UpdateAccountChannelParams>(
    'console/api/customer/save_sender_country_channel',
    { ...data },
  )
}
// 客户信息-新增/修改失败处理配置
export const updateAccountError = (data: API.UpdateAccountErrorParams) => {
  return request.post<any, API.Response<any>, API.UpdateAccountErrorParams>(
    'console/api/customer/save_sender_error_handle',
    { ...data },
  )
}
// 客户信息-删除-国家价格配置
export const deleteAccountPrice = (data: API.DeleteAccountPriceParams) => {
  return request.post<any, API.Response<any>, API.DeleteAccountPriceParams>(
    'console/api/customer/delete_sender_country',
    { ...data },
  )
}
// export const deleteAccountPrice = (data: API.Ids) => {
//   return request.post<any, API.Response<any>, API.Ids>(
//     'console/api/customer/delete_sender_country',
//     { ...data },
//   )
// }
// 客户信息-删除-国家通道配置
export const deleteAccountChannel = (data: API.Ids) => {
  return request.post<any, API.Response<any>, API.Ids>(
    'console/api/customer/delete_sender_country_channel',
    { ...data },
  )
}
// 客户信息-删除-失败处理配置
export const deleteAccountError = (data: API.Ids) => {
  return request.post<any, API.Response<any>, API.Ids>(
    'console/api/customer/delete_sender_error_handle',
    { ...data },
  )
}
// 客户信息-价格配置-开启/关闭全部营销
export const changeMkState = (data: API.ChangeMkStateParams) => {
  return request.post<any, API.Response<any>, API.ChangeMkStateParams>(
    'console/api/customer/switch_sender_market_status',
    { ...data },
  )
}
// 客户信息-测试账户标记
export const changeTestState = (data: API.ChangeTestStateParams) => {
  return request.post<any, API.Response<any>, API.ChangeTestStateParams>(
    'console/api/customer/switch_sender_test_status',
    { ...data },
  )
}

/**
 * 客户信息end
 */

/**
 * 失败任务处理列表start
 */

//获取失败任务处理列表
export const getHandlerList = (data: API.GetHandlerListParams) => {
  return request.post<
    any,
    API.Response<API.GetHandlerResList>,
    API.GetHandlerListParams
  >('console/api/handler/get_handler_list', { ...data })
}
// 获取失败任务详情处理列表
export const getHandlerDetailList = (data: API.GetHandlerDetailListParams) => {
  return request.post<
    any,
    API.Response<API.GetHandlerDetailResList>,
    API.GetHandlerDetailListParams
  >('console/api/handler/get_handler_detail_list', { ...data })
}

// 状态推送
export const statePushHandler = (data: API.StatePushHandlerParams) => {
  return request.post<any, API.Response<any>, API.StatePushHandlerParams>(
    'console/api/handler/state_push_handler',
    { ...data },
  )
}
// 二次发送
export const sendAgainHandler = (data: API.SendAgainHandlerParams) => {
  return request.post<any, API.Response<any>, API.SendAgainHandlerParams>(
    'console/api/handler/send_again_handler',
    { ...data },
  )
}
// 删除单个号码
export const deleteHandlerItem = (data: API.DeleteHandlerItemParams) => {
  return request.post<any, API.Response<any>, API.DeleteHandlerItemParams>(
    'console/api/handler/delete_handler_item',
    { ...data },
  )
}
// 删除全部号码
export const deleteAllHandlerItem = (data: API.DeleteAllHandlerItemParams) => {
  return request.post<any, API.Response<any>, API.DeleteAllHandlerItemParams>(
    'console/api/handler/delete_handler_task',
    { ...data },
  )
}

/**
 * 失败任务处理列表end
 */

/**
 * 未返回任务列表start
 */
//获取未返回任务列表
export const getNoStateLogList = (data: API.GetNoStateLogListParams) => {
  return request.post<
    any,
    API.GetNoStateLogListRes,
    API.GetNoStateLogListParams
  >('console/api/handler/get_no_state_log', { ...data })
}
// 全部推送成功
export const updateNoStateQueueStatus = (
  data: API.updateNoStateQueueStatusParams,
) => {
  return request.post<
    any,
    API.Response<any>,
    API.updateNoStateQueueStatusParams
  >('console/api/handler/update_no_state_queue_status', { ...data })
}
/**
 * 未返回任务列表end
 */

/**
 * 通道组管理start
 */
// 获取通道组id
export const getAllGroupId = (data: API.GetAllGroupIdParams) => {
  return request.post<
    any,
    API.Response<API.GetAllGroupIdItems[]>,
    API.GetAllGroupIdParams
  >('console/api/customer/get_all_group_ids', { ...data })
}

// 获取通道组列表(包含敏感词信息)
export const getChannelGroupList = (data: API.GetChannelGroupListParams) => {
  return request.post<
    any,
    API.GetChannelGroupListRes,
    API.GetChannelGroupListParams
  >('console/api/customer/get_group', { ...data })
}
// 新增/修改通道组
export const updateChannelGroup = (data: API.UpdateChannelGroupParams) => {
  return request.post<any, API.Response<any>, API.UpdateChannelGroupParams>(
    'console/api/customer/save_group',
    { ...data },
  )
}
// 保存通道组
export const deleteChannelGroup = (data: API.Ids) => {
  return request.post<any, API.Response<any>, API.Ids>(
    'console/api/customer/delete_group',
    { ...data },
  )
}
// 通道组绑定/取消绑定敏感词
export const channelGroupBindSensitiveWord = (
  data: API.updateChannelsBindSensitiveWordParams,
  bind: '0' | '1', // 1绑定0取消绑定
) => {
  const url =
    bind == '1'
      ? 'console/api/customer/save_group_related_sensitive_keywords'
      : 'console/api/customer/delete_group_related_sensitive_keywords'
  return request.post<
    any,
    API.Response<any>,
    API.updateChannelsBindSensitiveWordParams
  >(url, { ...data })
}
// 通道组绑定/取消绑定黑名单
export const channelGroupBindBlack = (
  data: API.updateChannelsBindBlackParams,
  bind: '0' | '1', // 1绑定0取消绑定
) => {
  const url =
    bind == '1'
      ? 'console/api/customer/save_group_related_mobile_block'
      : 'console/api/customer/delete_group_related_mobile_block'
  return request.post<
    any,
    API.Response<any>,
    API.updateChannelsBindBlackParams
  >(url, { ...data })
}

// 获取通道组管理配置列表
export const getGroupChannelList = (data: API.GetGroupChannelListParams) => {
  return request.post<
    any,
    API.Response<API.GroupChannelItem[]>,
    API.GetGroupChannelListParams
  >('console/api/customer/get_group_related_data', { ...data })
}
// 通道组添加通道
export const channelGroupAddChannel = (
  data: API.ChannelGroupAddChannelParams,
) => {
  return request.post<any, API.Response<any>, API.ChannelGroupAddChannelParams>(
    'console/api/customer/save_group_related_channel',
    { ...data },
  )
}
// 设置通道组是否补发
export const saveGrouRelatedChannelResend = (
  data: API.saveGrouRelatedChannelResendParams,
) => {
  return request.post<
    any,
    API.Response<any>,
    API.saveGrouRelatedChannelResendParams
  >('console/api/customer/save_group_related_channel_resend', { ...data })
}
// 通道组删除通道
export const channelGroupDeleteChannel = (
  data: API.ChannelGroupDeleteChannelParams,
) => {
  return request.post<
    any,
    API.Response<any>,
    API.ChannelGroupDeleteChannelParams
  >('console/api/customer/delete_group_related_channel', { ...data })
}
// 通道组-通道修改关键字
export const channelGroupUpdateKeyword = (
  data: API.ChannelGroupUpdateKeywordParams,
  bind: '0' | '1', // 1绑定0取消绑定
) => {
  const url =
    bind == '1'
      ? 'console/api/customer/save_group_related_keywords_route'
      : 'console/api/customer/delete_group_related_keywords_route'
  return request.post<
    any,
    API.Response<any>,
    API.ChannelGroupUpdateKeywordParams
  >(url, { ...data })
}
// 获取通道组-通道关联数据
export const getGroupRelatedData = (data: API.GetGroupRelatedDataParams) => {
  return request.post<any, API.GroupRelatedData, API.GetGroupRelatedDataParams>(
    'console/api/customer/get_group_related_channel_country_data',
    { ...data },
  )
}
// 修改通道组关联通道-运营商权重
export const updateChannelsNetworkWeight = (
  data: API.UpdateChannelsCountryNetworkParams,
) => {
  return request.post<
    any,
    API.Response<any>,
    API.UpdateChannelsCountryNetworkParams
  >('console/api/customer/update_countrynetwork_weight', { ...data })
}
// 禁用启用通道组关联通道-国家/运营商
export const updateGroupCountryNetworkStatus = (
  data: API.UpdateGroupCountryNetworkStatusParams,
) => {
  return request.post<
    any,
    API.Response<any>,
    API.UpdateGroupCountryNetworkStatusParams
  >('console/api/customer/update_countrynetwork_weight_status', { ...data })
}
// 修改通道组关联通道-国家/运营商权重
export const allUpdateChannelsNetworkWeight = (
  data: API.allUpdateChannelsNetworkParams,
) => {
  return request.post<
    any,
    API.Response<any>,
    API.allUpdateChannelsNetworkParams
  >('console/api/customer/batch_update_countrynetwork_weight', { ...data })
}

// 一键启用/禁用所有关联国家和运营商
export const oneTouchGroupCountryNetworkStatus = (
  data: API.OneTouchGroupCountryNetworkStatusParams,
) => {
  return request.post<
    any,
    API.Response<any>,
    API.OneTouchGroupCountryNetworkStatusParams
  >('console/api/customer/update_all_countrynetwork_weight_status', {
    ...data,
  })
}
/**
 * 通道组管理end
 */

/**
 * 通道管理start
 */
// 获取通道id
export const getAllChannelId = (data: API.GetAllChannelIdParams) => {
  return request.post<
    any,
    API.Response<API.GetAllChannelIdParamsItems[]>,
    API.GetAllChannelIdParams
  >('console/api/customer/get_all_channel_ids', { ...data })
}

// 获取通道列表
export const getChannelList = (data: API.Ids = { id: '' }) => {
  return request.post<any, API.Response<API.ChannelItem[]>, API.Ids>(
    'console/api/customer/get_channel',
    { ...data },
  )
}
// 新增/修改通道
export const saveChannel = (data: API.AddChannelParams) => {
  return request.post<any, API.Response<any>, API.AddChannelParams>(
    'console/api/customer/save_channel',
    { ...data },
  )
}
// 新增/修改通道
export const deleteChannel = (data: API.Ids) => {
  return request.post<any, API.Response<any>, API.Ids>(
    'console/api/customer/delete_channel',
    { ...data },
  )
}
// 获取通道关联的国家
export const getChannelCountryList = (data: API.getChannelCountryParams) => {
  return request.post<
    any,
    API.ChannelRelatedDataRes,
    API.getChannelCountryParams
  >('console/api/customer/get_channel_related_country_network', { ...data })
}
// 修改通道关联国家及网络，已存在的关联国家直接跳过
export const updateChannelCountryNetwork = (
  data: API.UpdateChannelCountryNetworkParams,
) => {
  return request.post<
    any,
    API.Response<any>,
    API.UpdateChannelCountryNetworkParams
  >('console/api/customer/update_channel_related_country_network', { ...data })
}
// 修改通道关联国家及网络，已存在的关联国家直接跳过
export const updateChannelCountryNetworkPrice = (
  data: API.UpdateChannelCountryNetworkPriceParams,
) => {
  return request.post<
    any,
    API.Response<any>,
    API.UpdateChannelCountryNetworkPriceParams
  >('console/api/customer/update_channel_related_country_network_prices', {
    ...data,
  })
}
// 批量启用禁用通道关联国家及网络
export const updateChannelCountryNetworkStatus = (
  data: API.UpdateChannelCountryNetworkStatusParams,
) => {
  return request.post<
    any,
    API.Response<any>,
    API.UpdateChannelCountryNetworkStatusParams
  >('console/api/customer/update_channel_related_country_network_status', {
    ...data,
  })
}
// 一键启用/禁用所有关联国家和运营商
export const oneTouchChannelCountryNetworkStatus = (
  data: API.OneTouchChannelCountryNetworkStatusParams,
) => {
  return request.post<
    any,
    API.Response<any>,
    API.OneTouchChannelCountryNetworkStatusParams
  >('console/api/customer/update_channel_all_related_country_network_status', {
    ...data,
  })
}

// 通道绑定/取消绑定敏感词
export const channelBindSensitiveWord = (
  data: API.UpdateChannelBindSensitiveWordParams,
  bind: '0' | '1', // 1绑定0取消绑定
) => {
  const url =
    bind == '1'
      ? 'console/api/customer/save_channel_related_sensitive_keywords'
      : 'console/api/customer/delete_channel_related_sensitive_keywords'
  return request.post<
    any,
    API.Response<any>,
    API.UpdateChannelBindSensitiveWordParams
  >(url, { ...data })
}
// 通道绑定/取消绑定黑名单
export const channelBindBlack = (
  data: API.UpdateChannelBindBlackParams,
  bind: '0' | '1', // 1绑定0取消绑定
) => {
  const url =
    bind == '1'
      ? 'console/api/customer/save_channel_related_mobile_block'
      : 'console/api/customer/delete_channel_related_mobile_block'
  return request.post<any, API.Response<any>, API.UpdateChannelBindBlackParams>(
    url,
    { ...data },
  )
}
// 更新通道配置
enum Listener_url {
  'console/api/customer/create_listener', // 添加配置
  'console/api/customer/open_listener', // 建立连接
  'console/api/customer/close_listener', // 断开连接
  'console/api/customer/delete_listener', // 还原配置
}
// 4合1接口， 更新通道配置
export const channelUpdateListener = (
  data: API.UpdateChannelListener,
  type: '0' | '1' | '2' | '3', // 0添加配置，1建立连接，2断开连接，3还原配置
) => {
  let url = Listener_url[type]
  return request.post<any, API.Response<any>, API.UpdateChannelListener>(url, {
    ...data,
  })
}
/**
 * 通道管理end
 */

/**
 * 国家信息配置start
 */
// 获取国家信息列表
export const getCountryList = (data: API.GetCountryListParams) => {
  return request.post<
    any,
    API.Response<API.GetCountryListItems[]>,
    API.GetCountryListParams
  >('console/api/customer/get_country', { ...data })
}
// 保存国家信息
export const saveCountry = (data: API.SaveCountryParams) => {
  return request.post<any, API.Response<any>, API.SaveCountryParams>(
    'console/api/customer/save_country',
    { ...data },
  )
}

/**
 * 国家信息配置end
 */

/**
 * 获取单个国家信息详情start
 */
// 获取单个信息
export const getSingleCountryInfo = (data: API.GetSingleCountryInfoParams) => {
  return request.post<
    any,
    API.Response<API.GetSingleCountryInfoItems[]>,
    API.GetSingleCountryInfoParams
  >('console/api/customer/get_country_channel_network_price_detail', {
    ...data,
  })
}
// 新增网络
export const addNetwork = (data: API.addNetworkParams) => {
  return request.post<any, API.Response<any>, API.addNetworkParams>(
    'console/api/customer/add_country_channel_network_price_detail',
    { ...data },
  )
}
// 编辑通道/网络
export const saveChaneNetwork = (data: API.SaveChaneNetworkParams) => {
  return request.post<any, API.Response<any>, API.SaveChaneNetworkParams>(
    'console/api/customer/save_country_channel_network_price_detail',
    { ...data },
  )
}
// 删除单个网络
export const deleteSingleNetWork = (data: API.DeleteSingleNetWorkParams) => {
  return request.post<any, API.Response<any>, API.DeleteSingleNetWorkParams>(
    'console/api/customer/delete_country_channel_network_price_detail',
    { ...data },
  )
}

/**
 * 获取单个国家信息详情end
 */

/**
 * 网络信息配置start
 */
// 获取网络信息列表
export const getNetWorkList = (data: API.GetNetWorkParams) => {
  return request.post<
    any,
    API.Response<API.GetNetWorkListItems[]>,
    API.GetNetWorkParams
  >('console/api/customer/get_network', { ...data })
}
// 保存网络信息
export const saveNetWorkList = (data: API.SaveNetWorkParams) => {
  return request.post<any, API.Response<any>, API.SaveNetWorkParams>(
    'console/api/customer/save_network',
    { ...data },
  )
}
// 删除网络信息
export const deleteNetWorkList = (data: API.DeleteNetWorkParams) => {
  return request.post<any, API.Response<any>, API.DeleteNetWorkParams>(
    'console/api/customer/delete_network',
    { ...data },
  )
}

/**
 * 网络信息配置end
 */

/**
 * 号码通道路由start
 */
// 获取号码通道路由
export const getMobileRouteList = (data: API.GetMobileRouteListParams) => {
  return request.post<
    any,
    API.Response<API.GetMobileRouteListItems[]>,
    API.GetMobileRouteListParams
  >('console/api/customer/get_mobile_route', { ...data })
}
// 保存号码通道路由
export const saveMobileRouteList = (data: API.SaveMobileRouteParams) => {
  return request.post<any, API.Response<any>, API.SaveMobileRouteParams>(
    'console/api/customer/save_mobile_route',
    { ...data },
  )
}
// 删除号码通道路由配置
export const deleteMobileRouteList = (
  data: API.DeleteMobileRouteListParams,
) => {
  return request.post<any, API.Response<any>, API.DeleteMobileRouteListParams>(
    'console/api/customer/delete_mobile_route',
    { ...data },
  )
}
/**
 * 号码通道路由end
 */

/**
 * 报警设置start
 */
// 获取报警设置
export const getalArmConfigList = (data: API.GetalArmConfigListParams) => {
  return request.post<
    any,
    API.Response<API.GetalArmConfigListItems[]>,
    API.GetalArmConfigListParams
  >('console/api/customer/get_alarm_config', { ...data })
}
// 保存报警人员设置
export const saveAlarmConfigList = (data: API.SaveAlarmConfigListParams) => {
  return request.post<any, API.Response<any>, API.SaveAlarmConfigListParams>(
    'console/api/customer/save_alarm_config',
    { ...data },
  )
}
// 报警设置批量启用/停用
export const updateAlarmConfigStatus = (
  data: API.UpdateAlarmConfigStatusParams,
) => {
  return request.post<
    any,
    API.Response<any>,
    API.UpdateAlarmConfigStatusParams
  >('console/api/customer/update_alarm_config_status', { ...data })
}
// 删除报警设置
export const deleteAlarmConfigList = (
  data: API.DeleteAlarmConfigListParams,
) => {
  return request.post<any, API.Response<any>, API.DeleteAlarmConfigListParams>(
    'console/api/customer/delete_alarm_config',
    { ...data },
  )
}

// 获取报警人员设置
export const getAlarmNotifier = (data: API.GetAlarmNotifierParams) => {
  return request.post<
    any,
    API.Response<API.GetAlarmNotifierItems[]>,
    API.GetAlarmNotifierParams
  >('console/api/customer/get_alarm_notifier', { ...data })
}

// 保存报警人员设置
export const saveAlarmNotifierList = (
  data: API.SaveAlarmNotifierListParams,
) => {
  return request.post<any, API.Response<any>, API.SaveAlarmNotifierListParams>(
    'console/api/customer/save_alarm_notifier',
    { ...data },
  )
}

// 删除报警人员设置
export const deleteAlarmNotifierList = (
  data: API.DeleteAlarmNotifierListParams,
) => {
  return request.post<
    any,
    API.Response<any>,
    API.DeleteAlarmNotifierListParams
  >('console/api/customer/delete_alarm_notifier', { ...data })
}

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
export const getSensitiveWordList = (data: API.GetSensitiveWordListParams) => {
  return request.post<
    any,
    API.Response<API.GetSensitiveWordListItems[]>,
    API.GetSensitiveWordListParams
  >('console/api/customer/get_sensitive_keywords', { ...data })
}

// 获取开启状态的敏感词列表
export const getOpenSensitiveWordList = (
  data: API.GetSensitiveWordListParams,
) => {
  return request.post<any, API.Response<any>, API.GetSensitiveWordListParams>(
    'console/api/customer/get_all_sensitive_keywords_list',
    { ...data },
  )
}

// 新增敏感词列表
export const addSensitiveWordList = (data: API.AddSensitiveWordListParams) => {
  return request.post<any, API.Response<any>, API.AddSensitiveWordListParams>(
    'console/api/customer/save_sensitive_keywords',
    { ...data },
  )
}

// 删除敏感词列表
export const deleteSensitiveWordList = (
  data: API.DeleteSensitiveWordListParams,
) => {
  return request.post<
    any,
    API.Response<any>,
    API.DeleteSensitiveWordListParams
  >('console/api/customer/delete_sensitive_keywords', { ...data })
}
// 敏感词批量启用/停用
export const sensitiveWordListStopUsing = (
  data: API.SensitiveWordListStopUsingParams,
) => {
  return request.post<
    any,
    API.Response<any>,
    API.SensitiveWordListStopUsingParams
  >('console/api/customer/update_sensitive_keywords_status', { ...data })
}

/**
 * 敏感词管理end
 */

/**
 * 关键词管理start
 */
// 获取关键词列表
export const getkeyWord = (data: API.GetkeyWordParams) => {
  return request.post<
    any,
    API.Response<API.GetkeyWordItems[]>,
    API.GetkeyWordParams
  >('console/api/customer/get_keywords_route', { ...data })
}
// 获取可用关键词列表
export const getKeywordEnabledList = () => {
  return request.post<any, API.Response<API.GetKeywordEnabledItems[]>>(
    'console/api/customer/get_all_keywords_route_list',
  )
}

// 新增关键词列表
export const addkeyWord = (data: API.AddkeyWordParams) => {
  return request.post<any, API.Response<any>, API.AddkeyWordParams>(
    'console/api/customer/save_keywords_route',
    { ...data },
  )
}
// 删除关键词列表
export const deletekeyWord = (data: API.DeletekeyWordParams) => {
  return request.post<any, API.Response<any>, API.DeletekeyWordParams>(
    'console/api/customer/delete_keywords_route',
    { ...data },
  )
}
// 关键词批量启用/停用
export const keyWordStopUsing = (data: API.keyWordStopUsingParams) => {
  return request.post<any, API.Response<any>, API.keyWordStopUsingParams>(
    'console/api/customer/update_keywords_route_status',
    { ...data },
  )
}
/**
 * 关键词管理end
 */

/**
 * 获取客户注册文件记录start
 */

// 获取客户注册文件记录
export const getSenderEvidence = (data: API.GetSenderEvidenceParams) => {
  return request.post<
    any,
    API.Response<API.GetSenderEvidenceItems[]>,
    API.GetSenderEvidenceParams
  >('console/api/user/get_sender_evidence', { ...data })
}
// 新增客户注册文件记录
export const addSenderEvidence = (data: API.AddSenderEvidenceParams) => {
  return request.post<any, API.Response<any>, API.AddSenderEvidenceParams>(
    'console/api/user/add_sender_evidence',
    { ...data },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
}
// 更新客户注册文件记录
export const updateSenderEvidence = (data: API.UpdateSenderEvidenceParams) => {
  return request.post<any, API.Response<any>, API.UpdateSenderEvidenceParams>(
    'console/api/user/update_sender_evidence',
    { ...data },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
}
// 删除客户注册文件记录
export const deleteSenderEvidence = (data: API.DeleteSenderEvidenceParams) => {
  return request.post<any, API.Response<any>, API.DeleteSenderEvidenceParams>(
    'console/api/user/delete_sender_evidence',
    { ...data },
  )
}
/**
 * 获取客户注册文件记录end
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
// 获取黑名单列表
export const getBlackList = (data: API.GetBlackListParams) => {
  return request.post<
    any,
    API.Response<API.GetBlackListItems[]>,
    API.GetBlackListParams
  >('console/api/customer/get_mobile_block_list', { ...data })
}
// 新增黑名单
export const addBlackList = (data: API.AddBlackListParams) => {
  return request.post<any, API.Response<any>, API.AddBlackListParams>(
    'console/api/customer/save_mobile_block_list',
    { ...data },
  )
}
// 黑名单启用/停用
export const BlackListStopUsing = (data: API.blackListStopUsingParams) => {
  return request.post<any, API.Response<any>, API.blackListStopUsingParams>(
    'console/api/customer/update_mobile_block_list_status',
    { ...data },
  )
}
// 删除黑名单
export const deleteBlackList = (data: API.DeleteBlackListParams) => {
  return request.post<any, API.Response<any>, API.DeleteBlackListParams>(
    'console/api/customer/delete_mobile_block_list',
    { ...data },
  )
}
// 根据黑名单组，获取黑名单电话明细
interface BlackListResponse
  extends API.Response<API.GetBlackDetailListItems[]> {
  total: number
}
export const getBlackItemsList = (data: API.GetBlackDetailListParams) => {
  return request.post<any, BlackListResponse, API.GetBlackDetailListParams>(
    'console/api/customer/get_mobile_block_items_bylist',
    { ...data },
  )
}
// 新增黑名单手机号码
export const addBlackMobileList = (data: API.AddBlackMobileListParams) => {
  return request.post<any, API.Response<any>, API.AddBlackMobileListParams>(
    'console/api/customer/save_mobile_block_items',
    { ...data },
  )
}
// 删除黑名单手机号码
export const deleteBlackMobileList = (
  data: API.DeleteBlackMobileListParams,
) => {
  return request.post<any, API.Response<any>, API.DeleteBlackMobileListParams>(
    'console/api/customer/delete_mobile_block_items',
    { ...data },
  )
}
// 黑名单上传文件
export const uploadBlackMobileList = (
  data: API.UploadBlackMobileListParams,
) => {
  return request.post<any, API.Response<any>, API.UploadBlackMobileListParams>(
    'console/api/customer/save_mobile_block_items',
    { ...data },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
}
/**
 * 黑名单管理end
 */
/**
 * 统计管理start
 */
export const getStatistics = (data: API.GetStatisticsParams) => {
  return request.post<
    any,
    API.Response<API.GetStatisticsResList>,
    API.GetStatisticsParams
  >('console/api/customer/get_analysis_report', { ...data })
}

/**
 * 统计管理end
 */

/**
 * 登陆start
 */

// 用户登录，用户名密码相关信息验证-获取验证码
export const getLoginCode = (data: API.GetLoginCodeParams) => {
  return request.post<any, API.Response<API.userInfo>, API.GetLoginCodeParams>(
    'console/api/account/login',
    { ...data },
  )
}

// 验证码验证
export const login = (data: API.LoginParams) => {
  return request.post<any, API.Response<any>, API.LoginParams>(
    'console/api/account/do_login',
    { ...data },
  )
}
// 同步配置
export const updateConfig = () => {
  return request.get<any, API.Response<any>, any>(
    'console/api/customer/update_config',
    {},
  )
}

// 退出登录
export const logout = () => {
  return request.post<any, API.Response<any>, any>(
    'console/api/account/logout',
    {},
  )
}

// 获取登陆信息
export const getUserInfo = () => {
  return request.post<any, API.Response<API.UserInfo>, any>(
    'console/api/account/get_account_info',
    {},
  )
}

// 获取登陆日志
export const getLoginLog = (data: API.GetLogParams) => {
  return request.post<any, API.LogRes, API.GetLogParams>(
    'console/api/account/get_sign_log',
    { ...data },
  )
}

/**
 * 登陆end
 */
