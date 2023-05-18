declare module 'apis' {
  namespace API {
    interface Response<T = any> {
      data: T
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

    /**
     * 全局公共接口end
     */

    /**
     * 发送列表start
     */

    // 发送列表参数
    interface GetSendListParams extends BaseParams {
      page?: string
      start: string // 开始时间
      end?: string // 结束时间
      channel?: string // 通道类型
      group?: string // 通道组类型
      type?: string // 短信类型
      keyword?: string // 搜索关键字
    }

    // 发送列表
    interface SendListItem {
      id: string
      mobile: string
      account: string
      title: string
      content: string
      type: string
      send: string // 发送时间
      sent: string // 完成时间
      sender: string
      fee: string
      cost: string
      group_name: string
      channel_name: string
      country_cn: string
      region_code: string
      report_state: string
      report_code: string
      report_desc: string
    }

    /**
     * 发送列表end
     */

    /**
     * 客户信息start
     */

    // 获取客户列表参数
    interface AccountListParams {
      page?: string
      keyword?: string
    }
    // 客户列表返回值
    interface AccountListItem {
      id: string
      account: string
      sender: string
      region_code: string
      channel_id: string
      network: string
    }
    // 删除客户参数
    interface DeleteAccountParams {
      account: string
    }
    // 新增客户参数
    interface AddAccountParams {
      mail: string
      name: string
    }

    /**
     * 客户信息end
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
    interface SaveGroupParams {
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
      id: string
      keyword: string
      page: string
    }

    interface GetChannelGroupListItem {
      id: string
      name: string // 通道组名称
      type: '1' | '0' // 通道行业属性  0行业 1营销
      enabled: '0' | '1' // 是否启用 0关闭  1启用
    }

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
    interface ChannelItem {
      id: string
      name: string // 通道名称
      access_type: string // 接入类型 0smpp  1http
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
    // 新增/修改通道
    interface AddChannelParams extends ChannelItem {}
    // 获取通道关联的国家
    interface getChannelCountryParams {
      channel: string
    }
    // 修改通道关联国家及网络，已存在的关联国家直接跳过
    interface UpdateChannelCountryNetworkParams {
      channel: string
      region_code_list: string
    }
    interface ChannelCountryConfigItem {
      channel_id: string
      country_cn: string
      id: string
      enabled: '1' | '0' // 是否启用   1是  0否
      network: string // 运营商网络
      price_mke: string // 营销价格
      price_tra: string // 行业价格
      region_code: string
      cost_price: string
      sug_price: string
    }
    // 修改通道关联国家及网络接口参数
    interface UpdateChannelCountryNetworkPriceParams {
      channel_id: string
      price_mke: string // 营销价格
      price_tra: string // 行业价格
    }
    // 批量启用禁用通道关联国家及网络
    interface UpdateChannelCountryNetworkStatusParams {
      id: string
      enabled: '1' | '0' // 是否启用   1是  0否
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
      page: string
    }
    // 获取国家信息返回的数据
    interface GetCountryListItems {
      id: string
      country: string
      country_cn: string
      country_area_code: string
      region_code: string
      tra_group: string
      tra_sender: string
      mke_group: string
      mke_sender: string
    }

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

    // 获取敏感词
    interface GetSensitiveWordListParams {
      id: string
      page: string
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
      status: string
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
      page: string
    }
    // 获取关键词返回数据
    interface GetkeyWordItems {
      id: string
      name: string
      comment: string
      keywords: string
      enabled: string
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
  }
}
