// 1是0否
export const yesOrNoOptions = [
  {
    label: '是',
    value: '1',
  },
  {
    label: '否',
    value: '0',
  },
]

// 通道管理-号码前缀
export const mobileTypeOptions = [
  {
    value: '0',
    label: '无前缀',
  },
  {
    value: '1',
    label: '+',
  },
  {
    value: '2',
    label: '00',
  },
  {
    value: '3',
    label: '0',
  },
]

// 接入类型
export const accessTypeOptions = [
  {
    label: 'SMPP',
    value: '0',
  },
  {
    label: 'HTTP',
    value: '1',
  },
]

// 通道类型
export const channelTypeOptions = [
  {
    label: '行业通道',
    value: '1',
  },
  {
    label: '营销通道',
    value: '2',
  },
]

// 通道组类型
export const channelsTypeOptions = [
  { label: '行业通道组', value: '0' },
  { label: '营销通道组', value: '1' },
]

// 启用与禁用
export const enableTypeOptions = [
  { label: '启用', value: '1' },
  { label: '禁用', value: '0' },
]
export const TestTypeOptions = []

// 根据value获取label值
export const getOptionsLabel = (options: any[], value: string | number) => {
  let label
  options.forEach((item) => {
    if (item.value == value) {
      label = item.label
    }
  })
  return label || ''
}
