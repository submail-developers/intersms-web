import { Checkbox } from 'antd'
import type { CheckboxValueType } from 'antd/es/checkbox/Group'
import { Option } from './editDetail'

interface Props {
  label: 'A' | 'B' | 'C'
  options: Option[]
  checkedList: CheckboxValueType[] // 选中的value列表
  onChange: (checkedValue: CheckboxValueType[], label: 'A' | 'B' | 'C') => void
}

const CheckboxGroup = Checkbox.Group

export default ({ options, checkedList, onChange, label }: Props) => {
  return (
    <CheckboxGroup
      options={options}
      value={checkedList}
      onChange={(checkedValue) =>
        onChange(checkedValue, label)
      }></CheckboxGroup>
  )
}
