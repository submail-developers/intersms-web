// 根据数组某个key的相同值生成二维数组
export const groupBy = (objectArray: any[], property: string) => {
  return objectArray.reduce((acc, obj) => {
    var key = obj[property]
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(obj)
    return acc
  }, {})
}
