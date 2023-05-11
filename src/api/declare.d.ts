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
  }
}
