declare module 'apis' {
  namespace API {
    interface Response<T = any> {
      data: T
      message?: string
      status?: string
    }

    interface BaseParams {
      // loading?: boolean // 是否需要loading， 默认false
      // token?: boolean // 是否需要token， 默认为true
      contentType?: string // 默认application/json
    }

    /**
     * 示例接口及测试接口start
     */

    type Tag = {
      id: number
      name: string
    }

    interface PetInfoRes {
      id: number
      name: string
      photoUrls: string[]
      category: {
        id: number
        name: string
      }
      tags: Tag[]
    }

    // 示例接口-get
    interface PetInfoParams extends BaseParams {
      id: number
    }

    // 示例接口-post
    interface CreatePetParams extends BaseParams {
      name: string
      status: string
    }

    /**
     * 示例接口及测试接口end
     */

    /**
     * 通用start
     */

    interface Ids {
      id: string
    }

    /**
     * 通用end
     */

    /**
     * 全局公共接口start
     */
    // 获取全部国家
    interface GetCountryParams {
      country_cn: string // 为空时获取所有
    }
    interface GetCountryItem {
      country_cn: string
      country: string
      country_code: string
      country_area_code: string
    }

    interface CountryItem {
      area: string
      label: string
      value: string
    }
    interface LetterCountryItem {
      letter: string
      children: CountryItem[]
    }
    interface GetAppidParams {
      sender: string // 用户account字段， 32位随机码id
    }
    interface GetAppidItem {
      id: string
      app: string
    }

    /**
     * 全局公共接口end
     */

    /**
     * 发送列表start
     */
    // 获取国家中文名称
    interface GetRegioncodeByCountryParams {
      country_cn: string
      keyword: string
    }
    // 获取国家中文名称返回的数据
    interface GetRegioncodeByCountryItems {
      label: string
      value: string
    }

    /**
     * 发送列表start
     */

    // 发送列表参数
    interface GetSendListParams extends BaseParams {
      page: number // 第几页
      limit: number // 每页数量
      start: string // 开始时间
      end?: string // 结束时间
      channel?: string // 通道类型
      group?: string // 通道组类型
      type?: string // 短信类型
      keyword?: string // 搜索关键字
      order_flg?: string //排序
    }

    // 发送列表返回值
    interface SendListRes extends Response<SendListItem[]> {
      total: number
    }
    interface SendListItem {
      id: string
      mobile: string
      account: string // 账户ID
      account_mail: string // 账户邮箱
      account_path: string // 跳转链接
      title: string // 发送名称
      content: string
      type: '1' | '2' // 短信类型 1行业2营销
      net_type: '0' | '1' // 网络类型
      network: string // 运营商ID
      network_name: string // 运营商-网络类型
      send: string // 发送时间
      sent: string // 完成时间
      sender: string
      fee: string // 计费
      cost: string // 成本
      group_name: string //通道组
      channel_name: string // 通道
      country_cn: string //国家名称
      region_code: string
      report_state: '0' | '1' | '2' // 发送状态 0失败， 1成功，2发送中
      report_code: string // 状态码
      report_desc: string // 状态描述
      downlink_time: string // 下行耗时
    }

    /**
     * 发送列表end
     */

    /**
     * 客户信息start
     */

    // 获取客户列表参数
    interface AccountListParams {
      keyword?: string
      page?: number // 第几页
      limit?: number // 每页数量
    }
    // 客户列表返回值
    interface AccountListRes extends Response<AccountListItem[]> {
      total: number
    }
    interface AccountListItem {
      id: string
      account: string
      sender: string
      region_code: string
      channel_id: string
      network: string
      name: string
      info_path: string
      mke_flg: '0' | '1' // 是否开启全部营销 0关闭1开启
      test_flg: '0' | '1' // 是否是测试账户 0关闭1开启
    }
    // 删除客户参数
    interface DeleteAccountParams {
      account: string
    }
    // 新增客户参数/客户只能删除不能编辑
    interface AddAccountParams {
      mail: string
    }
    // 客户信息-国家价格配置/国家通道配置/失败处理配置列表
    interface GetAccountConfigListParams {
      sender: string // 客户account
    }
    // 客户信息-新增/修改国家价格配置
    interface UpdateAccountPriceParams {
      id: string // 客户ID
      sender: string // 客户account
      price: string // 价格
      country_cn: string | undefined // 国家中文名称
      type: '1' | '2' // 短信类型  1行业2营销
    }
    // 客户信息-新增/修改国家通道配置
    interface UpdateAccountChannelParams {
      id: string // 客户ID
      sender: string // 客户account
      appid: string // 0所有
      group_type: '1' | '2' // 通道类型   1行业通道  2营销通道
      signature: string // 签名 需带【】
      country_cn: string | undefined // 国家中文名称
      group_id: string | undefined // 通道组id
    }
    // 客户信息-新增/修改失败处理配置
    interface UpdateAccountErrorParams {
      id: string // 客户ID
      sender: string // 客户account
      appid: string // 0所有
      sms_type: '1' | '2' // 通道类型   1行业通道  2营销通道
      response_time: string
      delivrd: string
      undeliv: string
      expired: string
      accepted: string
      unknown: string
      rejected: string
      spname: string
      country_cn: string
      region_code: string | undefined
    }
    // 客户信息-价格配置item
    interface AccountPriceItem {
      id: string
      region_code: string
      country_cn: string
      type: '1' | '2' // 1营销2行业
      price: string // 价格
      date: string
    }
    // 客户信息-通道配置item
    interface AccountChannelItem {
      id: string
      sender: string
      country_cn: string
      region_code: string
      group_id: string
      group_name: string
      group_type: '1' | '2' // 通道类型   1行业通道  2营销通道
      appid: string // 0所有
      signature: string // 签名
    }
    // 客户信息-通道配置item
    interface AccountErrorItem {
      id: string // 客户ID
      appid: string // 0所有
      sms_type: '1' | '2' // 通道类型   1行业通道  2营销通道
      response_time: string
      delivrd: string
      undeliv: string
      expired: string
      accepted: string
      unknown: string
      rejected: string
      spname: string
      country_cn: string
      country_code: string
    }
    // 客户信息-价格配置-开启/关闭全部营销
    interface ChangeMkStateParams {
      account: string // 账户ID
      mke_flg: '0' | '1' // 0否1是
    }
    // 客户信息-测试账户标记
    interface ChangeTestStateParams {
      account: string // 账户ID
      test_flg: '0' | '1' // 0否1是
    }

    /**
     * 客户信息end
     */

    /**
     * 失败任务处理列表start
     */
    // 获取失败任务处理列表参数
    interface GetHandlerListParams {
      mail: string
      page: string
      limit: string
    }
    // 失败任务处理列表返回值
    interface GetHandlerListItem {
      id: string
      account: string
      appid: string
      region_code: string
      sms_type: string
      task_name: string
      begin_time: string
      end_time: string
      state: string
      handle_count: string
      count_success_push: string
      group_id: string
      group_name: string
      sms_tag: string
      account_mail: string
      account_name: string
      account_mob: string
      account_company: string
      flg: string
    }

    interface GetHandlerResList {
      data: GetHandlerListItem[]
    }
    // 失败任务详情参数
    interface GetHandlerDetailListParams {
      account: string
      page: string
      limit: string
    }
    // 失败任务详情返回值
    interface GetHandlerDetailListItem {
      send_id: string
      account: string
      appid: string
      country: string
      country_code: string
      region_code: string
      dst_addr: string
      encode: string
      project: string
      src_addr: string
      text: string
      sms_type: string
      sms_tag: string
    }
    interface GetHandlerDetailListItem2 {
      id: string
      account: string
      app: string
    }

    interface GetHandlerDetailResList {
      list: GetHandlerDetailListItem[]
      app: GetHandlerDetailListItem2[]
    }

    // 状态推送参数
    interface StatePushHandlerParams {
      account: string
      task_name: string
      appid: string
      sms_type: string
      region_code: string
    }
    // 二次发送参数
    interface SendAgainHandlerParams {
      account: string
      task_name: string
      appid: string
      sms_type: string
      region_code: string
      sms_tag: string
      group_id: string
    }
    // 删除单个号码
    interface DeleteHandlerItemParams {
      send_id: string
    }
    // 删除全部号码
    interface DeleteAllHandlerItemParams {
      account: string
    }
    /**
     * 失败任务处理列表end
     */

    /**
     * 未返回任务列表start
     */
    // 获取未返回任务列表参数
    interface GetNoStateLogListParams {
      page: number // 第几页
      limit: number // 每页数量
      begin_date: string // 开始时间
      end_date?: string // 结束时间
      country?: string // 国际
      mail?: string // 搜索关键字
      sms_type?: string //排序
    }

    // 发送列表返回值
    interface GetNoStateLogListRes extends Response<GetNoStateLogItem[]> {
      total: number
    }
    interface GetNoStateLogItem {
      id: string
      mail: string
      group_id: string
      address: string
      appid: string
      region_code: string
      project: string
      message: string
      country_cn: string
      country_area_code: string
    }
    // 全部推送成功
    interface updateNoStateQueueStatusParams {
      ids: Array
    }

    /**
     * 未返回任务列表end
     */

    /**
     * 通道组管理start
     */
    // 获取通道组
    interface GetAllGroupIdParams {}
    // 获取通道组返回的数据
    interface GetAllGroupIdItems {
      id: string
      name: string
    }
    // 保存通道组参数
    interface SaveCountryParams {
      id: string
      country: string
      country_area_code: string
      country_cn: string
      region_code: string
      tra_group: string
      tra_sender: string
      mke_group: string
      mke_sender: string
    }
    interface GetChannelGroupListParams {
      id?: string
      keyword?: string
      page?: number
      limit?: number
    }

    interface UpdateChannelGroupParams {
      id: string
      name: string // 通道组名称
      type: '1' | '0' // 通道行业属性  0行业 1营销
      enabled: '0' | '1' // 是否启用 0关闭  1启用
    }
    // 获取通道组列表
    interface GetChannelGroupListRes
      extends Response<GetChannelGroupListItem[]> {
      total: number
    }
    interface GetChannelGroupListItem extends UpdateChannelGroupParams {
      sens_word_list: ChannelsBindSensitiveItem[] // 敏感词
      mobile_block_list: GetBlackListItems[] // 黑名单
    }
    // 通道组下的通道关联国家的网络类型
    interface ChannelsChannelNetworkItem {
      country_cn: string
      network_id: string
      network_name: string
      network_weight: string // 权重
      region_code: string
      enabled: '0' | '1'
    }
    // 通道组下的通道关联的关键字
    interface ChannelsChannelKeywordItem {
      keyroute_comment: string
      keyroute_enabled: '0' | '1' // 0关闭1开启
      keyroute_id: string
      keyroute_keywords: string
      keyroute_name: string
      keyroute_priority: string
    }
    // 获取通道组关联数据（通道+权重+关键字路由+敏感词）
    interface GroupChannelItem {
      group_id: string
      channel_id: string
      channel_name: string
      channel_access_type: '0' | '1' // 接入类型 0smpp  1http
      channel_type: '1' | '2' // 通道类型  1行业  2营销
      channel_flow: string // 流速
      channel_udh: '1' // 是否使用udh模式，1是0否
      channel_mobile_type: '0' // 0:无前缀, 1:+前缀, 2:00前缀, 3:0前缀
      keyroute_list: ChannelsChannelKeywordItem[]
      network_list: ChannelsChannelNetworkItem[]
      connection_status: 0 | -1 | -2 | 99 | -100 // 0无连接，-1连接失败正在重试，-2绑定失败正在重试，99连接异常无响应，其他值连接正常-值为链路数量
    }
    // 绑定敏感词
    interface updateChannelsBindSensitiveWordParams {
      group_id: string
      sens_id: string // 敏感词ID
    }
    // 绑定黑名单
    interface updateChannelsBindBlackParams {
      group_id: string
      block_id?: string // 黑名单ID
    }
    interface GetGroupChannelListParams {
      group_id: string
      channel_id?: string
    }
    // 通道组-获取关联国家列表
    interface GetGroupRelatedDataParams {
      group_id: string
      channel_id?: string
      keyword?: string
    }
    interface GroupRelatedDataNetItem {
      id: string
      network_id: string
      network_name: string
      weight: string
      network_enabled: '1' | '0'
    }

    interface GroupRelatedDataItem {
      id: string
      channel_id: string
      channel_name: string
      country_cn: string
      region_code: string
      weight: string
      network_id: string
      country_enabled: '1' | '0'
      network_list: GroupRelatedDataNetItem[]
      bg_start: 0 | 1 // 手动添加的属性。运营商背景色 0-白色开始1灰色开始
    }

    interface GroupRelatedData extends Response<GroupRelatedDataItem[]> {
      list_status: '1' | '2' | '3' // 1全部开启状态   2部分开启状态   3全部关闭状态
    }

    // 修改通道组关联通道-国家网络权重

    interface UpdateChannelsCountryNetworkWeightParams {
      group_id: string
      channel_id: string
      region_code: string
      network_id: string
      weight: string
    }

    // 批量修改通道组关联通道-国家/运营商权重
    interface allUpdateChannelsNetworkParams {
      group_id: string
      channel_id: string
      region_code: string
      type: '1' | '2' // 1操作国家  2操作运营商网络
    }
    // 禁用启用通道组关联通道-国家/运营商

    interface UpdateGroupCountryNetworkStatusParams {
      group_id: string
      channel_id: string
      region_code: string
      network_id: string
      status: '0' | '1' // 0禁用1启用
      type: '1' | '2' // 1操作国家  2操作运营商网络
    }

    // 一键启用/禁用所有关联国家和运营商
    interface OneTouchGroupCountryNetworkStatusParams {
      group_id: string
      channel_id: string
      status: '0' | '1' // 1启用0禁用
    }
    /**
     * 通道组管理end
     */

    /**
     * 通道管理start
     */
    // 获取通道id
    interface GetAllChannelIdParams {}
    // 获取通道返回的数据
    interface GetAllChannelIdParamsItems {
      id: string
      name: string
    }
    //
    interface ChannelItem {
      id: string
      name: string // 通道名称
      data_total: string //队列数据
      access_type: '0' | '1' // 接入类型 0smpp  1http
      type: '1' | '2' // 通道类型  1行业  2营销
      smsc_ip: string // SMSC服务方ip地址
      smsc_port: string // smpp模式必填,端口号
      http_url: string // http接口地址
      sysid: string // smpp 用户名
      password: string // smpp  用户密码
      service_type: string // CMT，服务类型
      system_type: string // cp， 项目类型
      flow: string // 流速
      udh: string // 是否使用udh模式，1是0否
      mobile_type: string // 0:无前缀, 1:+前缀, 2:00前缀, 3:0前缀
      sens_id: string // 敏感词ID
      sens_name: string // 敏感词条目名称
      keywords: string // 敏感词明细
      block_id: string // 黑名单ID
      block_name: string // 黑名单名称
      listener_status: '0' | '1' | '2' // 0配置未添加，1配置已添加未建立连接，2已建立连接
      connection_status: 0 | -1 | -2 | 99 | -100 // 0无连接，-1连接失败正在重试，-2绑定失败正在重试，99连接异常无响应，其他值连接正常-值为链路数量
    }
    // 新增/修改通道
    interface AddChannelParams {
      id: string
      name: string // 通道名称
      access_type: '0' | '1' // 接入类型 0smpp  1http
      type: '1' | '2' // 通道类型  1行业  2营销
      smsc_ip: string // SMSC服务方ip地址
      smsc_port: string // smpp模式必填,端口号
      http_url: string // http接口地址
      sysid: string // smpp 用户名
      password: string // smpp  用户密码
      service_type: string // CMT，服务类型
      system_type: string // cp， 项目类型
      flow: string // 流速
      udh: string // 是否使用udh模式，1是0否
      mobile_type: string // 0:无前缀, 1:+前缀, 2:00前缀, 3:0前缀
    }
    // 获取通道关联的国家
    interface getChannelCountryParams {
      channel: string
    }
    // 修改通道关联国家及网络，已存在的关联国家直接跳过
    interface UpdateChannelCountryNetworkParams {
      channel: string
      region_code_list: string
    }
    interface CountryItem {
      area: string
      label: string
      value: string
    }
    interface LetterCountryItem {
      letter: string
      children: CountryItem[]
    }
    interface NetworkListItem {
      id: string
      network_enabled: '0' | '1'
      network_id: string
      network_name: string
      price_mke: string // 营销价格
      price_tra: string // 行业价格
      sug_price: string // 建议销售价
      cost_price: string // 成本价
    }
    // 关联国家/地区
    interface ChannelCountryConfigItem {
      channel_id: string
      country_cn: string
      country_enabled: '0' | '1'
      id: string
      network_list: NetworkListItem[]
      price_mke: string // 营销价格
      price_tra: string // 行业价格
      region_code: string
      sug_price: string
      cost_price: string
      bg_start: 0 | 1 // 手动添加的属性。运营商背景色 0-白色开始1灰色开始
    }

    interface ChannelRelatedDataRes
      extends Response<ChannelCountryConfigItem[]> {
      list_status: '1' | '2' | '3' // 1全部开启状态   2部分开启状态   3全部关闭状态
    }

    // 修改通道关联国家及网络接口参数
    interface UpdateChannelCountryNetworkPriceParams {
      id: string // 国家ID或运营商ID
      price_mke: string // 营销价格
      price_tra: string // 行业价格
    }
    // 批量启用禁用通道关联国家及网络
    interface UpdateChannelCountryNetworkStatusParams {
      channel_id: string
      region_code: string
      network_id: string // 网络id   操作国家传0 操作运营商网络必须有值
      status: '1' | '0' // 1启用 0禁用
      type: '1' | '2' // 操作类型   1操作国家  2操作运营商网络
    }
    // 通道组添加通道-参数
    interface ChannelGroupAddChannelParams {
      group_id: string
      channel_id: string
    }
    // 通道组删除通道-参数
    interface ChannelGroupDeleteChannelParams
      extends ChannelGroupAddChannelParams {}
    // 通道组-通道修改关键字-参数
    interface ChannelGroupUpdateKeywordParams {
      group_id: string // 通道组ID
      channel_id: string // 通道ID
      keywords_route_id: string // 关键字ID
    }
    // 修改通道组关联通道-运营商权重
    interface UpdateChannelsCountryNetworkParams {
      group_id: string
      channel_id: string
      region_code: string
      network_id: string
      weight: string
    }
    // 一键启用/禁用所有关联国家和运营商
    interface OneTouchChannelCountryNetworkStatusParams {
      channel_id: string
      status: '0' | '1' // 1启用0禁用
    }
    // 通道绑定/取消绑定敏感词
    interface UpdateChannelBindSensitiveWordParams {
      channel_id: string
      sens_id: string // 敏感词ID
    }
    // 通道绑定/取消绑定黑名单
    interface UpdateChannelBindBlackParams {
      channel_id: string
      block_id?: string // 敏感词ID
    }
    interface UpdateChannelListener {
      channel_id: string
    }
    /**
     * 通道管理end
     */

    /**
     * 国家信息配置start
     */
    // 获取国家信息
    interface GetCountryListParams {
      id: string
      keyword: string
      group_id: string
    }
    // 获取国家信息返回的数据
    interface GetCountryListItems {
      id: string
      country: string
      country_cn: string
      country_area_code: string
      region_code: string
      tra_group: string
      tra_group_name: string
      tra_sender: string
      mke_group: string
      mke_group_name: string
      mke_sender: string
      area: string
    }

    /**
     * 国家信息配置end
     */
    /**
     * 获取单个国家通道信息详情start
     */
    interface GetSingleCountryInfoParams {
      region_code: string
      channel_name: string
    }
    // 获取单个国家通道返回的数据
    interface GetSingleCountryInfoItems {
      id: string
      country_cn: string
      region_code: string
      channel_id: string
      channel_name: string
      price: string
      network_name: string
      network_price: string
      comment: string
      datetime: string
      operator: string
      network_list: array
    }

    //新增网络
    interface addNetworkParams {
      country_cn: string
      region_code: string
      channel_id: string
      channel_name: string
      network_name: string
      network_price: string
    }
    // 保存网络/通道
    interface SaveChaneNetworkParams {
      id: string
      type: string
      price: string
      comment: string
      network_name: string
      network_price: string
    }

    // 删除单个网络信息
    interface DeleteSingleNetWorkParams {
      id: string
    }
    /**
     * 获取单个国家信息详情end
     */

    /**
     * 网络信息配置start
     */
    // 获取网络信息
    interface GetNetWorkParams {
      id: string
      keyword: string
    }
    // 获取网络信息返回的数据
    interface GetNetWorkListItems {
      id: string
      country_cn: string
      region_code: string
      area: string
      name: string
      cost_price: string
      sug_price: string
    }
    // 保存网络信息列表
    interface SaveNetWorkParams {
      id: string
      country_cn: string
      region_code: string
      area: string
      name: string
      cost_price: string
      sug_price: string
    }
    // 删除网络信息
    interface DeleteNetWorkParams {
      id: string
    }
    /**
     * 网络信息配置end
     */

    /**
     * 号码通道路由start
     */
    // 获取号码通道路由
    interface GetMobileRouteListParams {
      id: string
      type: string
      keyword: string
      group: string
    }
    // 获取号码通道路由的数据
    interface GetMobileRouteListItems {
      id: string
      mobile: string
      name: string
      type: string
      group: string
      datetime: string
      // channel_name: string
      group_name: string
      sender: string
      account: string
      region_code: string
      country_cn: string
    }
    // 保存号码通道路由
    interface SaveMobileRouteParams {
      id: string
      mobile: string
      name: string
      type: string
      channel: string
      sender: string
      region_code: string
      country_cn: string
    }
    //删除号码通道路由
    interface DeleteMobileRouteListParams {
      id: string
    }
    /**
     * 号码通道路由end
     */

    /**
     * 报警设置start
     */
    // 获取报警设置
    interface GetalArmConfigListParams {
      id: string
      type: string
      keyword: string
    }
    // 获取报警设置的数据
    interface GetalArmConfigListItems {
      id: string
      type: string
      country_cn: string
      region_code: string
      time: string
      row: string
      fail: string
      status: string
      datetime: string
      sender_mail: string
      channel_name: string
      sender: string
    }
    // 获取报警人员设置
    interface GetAlarmNotifierParams {}
    // 获取报警人员设置的数据
    interface GetAlarmNotifierItems {
      mob: string
      name: string
      key?: number
    }
    // 保存报警设置
    interface SaveAlarmConfigListParams {
      id: string
      type: string
      country_cn: string
      region_code: string
      time: string
      row: string
      fail: string
      status: string
      channel_id: string
      sender_id: string
    }
    // 保存报警人员设置
    interface SaveAlarmNotifierListParams {
      mob: string
      name: string
    }
    //报警设置量启用/停用  0关闭 1启用
    interface UpdateAlarmConfigStatusParams {
      id: string
      status: string
    }
    //删除报警设置
    interface DeleteAlarmConfigListParams {
      id: string
    }
    //删除报警人员设置
    interface DeleteAlarmNotifierListParams {
      mob: string
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

    // 获取敏感词
    interface GetSensitiveWordListParams {
      id: string
    }
    // 获取敏感词返回数据
    interface GetSensitiveWordListItems {
      comment: string
      enabled: string
      id: string
      keywords: string
      name: string
    }
    // 新增敏感词列表参数
    interface AddSensitiveWordListParams {
      id: string
      name: string
      keywords: string
      comment: string
    }
    // 删除敏感词列表参数
    interface DeleteSensitiveWordListParams {
      id: string
    }
    //敏感词批量启用/停用  0关闭 1启用
    interface SensitiveWordListStopUsingParams {
      id: string
      status: '0' | '1' // 1开启0关闭
    }
    // 通道组绑定的敏感词
    interface ChannelsBindSensitiveItem {
      enabled: '1' | '0' // 0关闭1开启
      group_id: string
      keywords: string
      name: string
      priority: string
      sens_id: string
    }
    /**
     * 敏感词管理end
     */

    /**
     * 关键词管理start
     */
    // 获取关键词
    interface GetkeyWordParams {
      id: string
    }
    // 获取所有关键词返回数据
    interface GetkeyWordItems {
      id: string
      name: string
      comment: string
      keywords: string
      enabled: string
    }
    // 获取可用关键词返回数据
    interface GetKeywordEnabledItems {
      id: string
      name: string
      keywords: string
    }
    // 新增关键词列表参数
    interface AddkeyWordParams {
      id: string
      name: string
      keywords: string
      comment: string
    }
    // 删除关键词列表参数
    interface DeletekeyWordParams {
      id: string
    }
    //关键词批量启用/停用  0关闭 1启用
    interface keyWordStopUsingParams {
      id: string
      status: string
    }
    /**
     * 关键词管理end
     */
    /**
     * 获取客户注册文件记录start
     */
    interface GetSenderEvidenceParams {
      id: string
      keyword: string
      status: string
      limit: string
      page: string
    }

    // 获取客户注册文件记录的数据
    interface GetSenderEvidenceItems {
      id: string
      maid: string
      account: string
      region_code: string
      country_cn: string
      channel_id: string
      sender: string
      sender_type: string
      sender_status: string
      business_license: string
      registration: string
      date: string
      date_last: string
      channel_name: string
      mail: string
    }
    //新增客户注册文件记录参数
    interface AddSenderEvidenceParams {
      mail: string
      region_code: string
      country_cn: string
      channel_id: string
      sender: string
      sender_type: string
      sender_status: string
      business_license: any
      registration: any
    }
    // 更新客户注册文件记录参数
    interface UpdateSenderEvidenceParams {
      id: string
      user_id: string
      sender: string
      sender_type: string
      sender_status: string
      business_license: any
      registration: any
    }

    // 删除客户注册文件记录参数
    interface DeleteSenderEvidenceParams {
      id: string
    }

    /**
     * 获取客户注册文件记录end
     */
    //

    /**
     * 状态码对照表start
     */

    /**
     * 状态码对照表end
     */

    /**
     * 黑名单管理start
     */
    // 获取黑名单
    interface GetBlackListParams {
      id: string
      page: string
    }
    // 获取黑名单返回数据
    interface GetBlackListItems {
      id: string
      name: string
      enabled: '0' | '1' // 0关闭1开启
    }
    // 新增黑名单
    interface AddBlackListParams {
      id: string
      name: string
      enabled: string
    }
    //黑名单启用/停用  0关闭 1启用
    interface blackListStopUsingParams {
      id: string
      enabled: string
    }
    // 删除黑名单
    interface DeleteBlackListParams {
      id: string
    }
    // 获取黑名单电话明细
    interface GetBlackDetailListParams {
      list_id: string
      keyword: string
      limit: number
      page: number
    }
    // 获取黑名单电话明细返回数据
    interface GetBlackDetailListItems {
      id: string
      list: string
      mobile: string
    }
    // 新增黑名单手机号码
    interface AddBlackMobileListParams {
      list_id: string
      mobile: string
      file: string
    }
    // 删除黑名单手机号码
    interface DeleteBlackMobileListParams {
      id: string
    }
    // 上传黑名单文件
    interface UploadBlackMobileListParams {
      list_id: string
      mobile: string
      file: any
    }
    /**
     * 黑名单管理end
     */

    /**
     * 统计管理start
     */
    // 统计管理参数
    interface GetStatisticsParams {
      page: number
      limit: number
      start: string
      end: string
      channel: string
      region_code: string
      network: string
    }
    // 获取统计管理返回数据
    interface GetStatisticsItems {
      channel_name: string
      country_cn: string
      network_name: string
      request: number
      deliveryed: number
      sms_count: number
      cost: number
      fee: number
      profit: number
    }
    interface TotalList {
      cost: number
      fee: number
      profit: number
      sms_count: number
    }
    interface GetStatisticsResList {
      list: GetStatisticsItems[]
      total: number
      total_list: TotalList
    }
    /**
     * 统计管理end
     */

    /**
     * 登陆start
     */

    // 用户登录，用户名密码相关信息验证-获取验证码
    interface GetLoginCodeParams {
      account: string // 邮箱账户
      password: string // 密码
    }
    interface userInfo {
      mail: string
      name: string
      mob: string
    }

    interface LoginParams {
      mob: string
      code: string
    }

    interface UserInfo {
      mail: string
      mob: string
      name: string
    }
    interface GetLogParams {
      page: number
      limit: number
    }
    // 登陆日志
    interface LoginLogItem {
      ip: string
      platform: string // 操作系统
      agent: string // 浏览器版本
      datetime: string
      country: string
      province: string
      city: string
    }

    interface LogRes extends Response<LoginLogItem[]> {
      total: number
    }

    /**
     * 登陆end
     */
  }
}
