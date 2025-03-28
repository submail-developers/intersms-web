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
  {
    label: 'CMPP',
    value: '2',
  },
]
// 是否开启补发
export const isOpenTypeOptions = [
  {
    label: '是',
    value: '1',
  },
  {
    label: '否',
    value: '0',
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
  {
    label: '自动处理',
    value: '3',
  },
  {
    label: '自动拦截',
    value: '4',
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
    value: '30',
    label: '30 分钟',
  },
  {
    value: '60',
    label: '1 小时',
  },
  {
    value: '120',
    label: '2 小时',
  },
  {
    value: '180',
    label: '3 小时',
  },
]
// 通道类型-价格
export const channelPriceTypeOptions = [
  { label: '行业短信', value: '1' },
  { label: '营销短信', value: '2' },
]

// Sender管理
export const senderManageOptions = [
  { label: '国际Sender', value: '1' },
  { label: '本地Sender', value: '2' },
]
// 失败处理方式
export const failTaskOptions = [
  { label: '状态推送', value: '0' },
  { label: '二次发送', value: '1' },
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

// 通道组管理 批量操作选项
export const allChannelsNum = [
  {
    value: '0',
    label: '0',
  },
  {
    value: '10',
    label: '10',
  },
  {
    value: '20',
    label: '20',
  },
  {
    value: '30',
    label: '30',
  },
  {
    value: '40',
    label: '40',
  },
  {
    value: '50',
    label: '50',
  },
  {
    value: '60',
    label: '60',
  },
  {
    value: '70',
    label: '70',
  },
  {
    value: '80',
    label: '80',
  },
  {
    value: '90',
    label: '90',
  },
  {
    value: '100',
    label: '100',
  },
]
