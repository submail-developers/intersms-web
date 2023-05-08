export interface Response<T = any> {
  data: T
}

export interface BaseParams {
  loading?: boolean // 是否需要loading， 默认false
  token?: boolean // 是否需要token， 默认为true
  contentType?: string // 默认application/json
}

export type Tag = {
  id: number
  name: string
}

export interface PetInfoRes {
  id: number
  name: string
  photoUrls: string[]
  category: {
    id: number
    name: string
  }
  tags: Tag[]
}

export namespace GetPetInfo {
  // 示例接口-get
  export interface PetInfoParams extends BaseParams {
    id: number
  }
}

export namespace CreatePet {
  // 示例接口-post
  export interface CreatePetParams extends BaseParams {
    name: string
    status: string
  }
}
