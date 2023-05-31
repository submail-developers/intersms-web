import styled from 'styled-components'
import { ReactNode, CSSProperties } from 'react'

interface Props {
  children?: ReactNode
  style?: CSSProperties
}

const ErrorTips = styled.div`
  display: flex;
  align-items: center;
  margin-top: 4px;
  height: 26px;
  line-height: 26px;
`

const Icon = styled.div`
  margin-right: 10px;
  margin-left: 6px;
`

// 输入框错误提示组件
export default function FormErrorTips(props: Props) {
  return (
    <ErrorTips style={props.style}>
      <Icon className='icon iconfont icon-cuowu fn16'></Icon>
      {props.children}
    </ErrorTips>
  )
}
