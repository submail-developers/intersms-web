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
