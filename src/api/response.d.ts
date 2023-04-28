declare namespace RES {
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
}

export default RES