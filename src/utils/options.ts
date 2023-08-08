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
// 报警类型
export const waringTypeOptions = [
  {
    value: '1',
    label: '账号报警',
  },
  {
    value: '2',
    label: '通道报警',
  },
  {
    value: '3',
    label: '国家报警',
  },
]
// 报警时间范围
export const waringTimeOptions = [
  {
    value: '5',
    label: '5 分钟',
  },
  {
    value: '10',
    label: '10 分钟',
  },
  {
    value: '15',
    label: '15 分钟',
  },
  {
    value: '20',
    label: '20 分钟',
  },
  {
    value: '25',
    label: '25 分钟',
  },
  {
    value: '30',
    label: '30 分钟',
  },
  {
    value: '45',
    label: '45 分钟',
  },
  {
    value: '60',
    label: '60 分钟',
  },
]
// 通道类型-价格
export const channelPriceTypeOptions = [
  { label: '行业短信', value: '1' },
  { label: '营销短信', value: '2' },
]

// 通道组类型
export const channelsTypeOptions = [
  { label: '行业通道组', value: '0' },
  { label: '营销通道组', value: '1' },
]
// 通道组类型
export const channelsTypeOptions2 = [
  { label: '行业通道组', value: '1' },
  { label: '营销通道组', value: '2' },
]

// 启用与禁用
export const enableTypeOptions = [
  { label: '启用', value: '1' },
  { label: '禁用', value: '0' },
]
// 绑定与取消绑定
export const bindTypeOptions = [
  {
    label: '绑定',
    value: '1',
  },
  {
    label: '取消绑定',
    value: '0',
  },
]

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
