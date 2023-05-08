declare namespace API {
  interface Response<T = any> {
    data: T
  }
  interface BaseParams {
    loading?: boolean // 是否需要loading， 默认false
    token?: boolean // 是否需要token， 默认为true
    contentType?: string // 默认application/json
  }
  // 示例接口-get
  interface PetInfo extends BaseParams {
    id: number
  }
  // 示例接口-post
  interface CreatePet extends BaseParams {
    name: string
    status: string
  }
}
