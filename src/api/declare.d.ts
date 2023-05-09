declare module 'apis' {
  namespace API {
    interface Response<T = any> {
      data: T
    }
    interface BaseParams {
      loading?: boolean // 是否需要loading， 默认false
      token?: boolean // 是否需要token， 默认为true
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
      start?: string
      end?: string
      channel?: string
      group?: string
      type?: string
      keyword?: string
    }

    // 发送列表
    interface SendListItem {
      id: string
      mobile: string
      account: string
      title: string
      content: string
      type: string
      send: string
      sent: string
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
  }
}
