import { ReactNode } from 'react';

import './buttonGroup.scss'

type ButtonItem = {
  danger: boolean
  icon: ReactNode
  text: string
}

interface Props {
  list: ButtonItem[]
  size?: 'large' | 'middle' | 'small'
}


const defaultProps:Props = {
  list: [],
  size: 'large'
}

export default (props: Props = defaultProps) => {
  return (
    <div data-class="buttonGroup" className={`fx ${props.size}`}>
      {
        props.list.map(item => (
          <div className={`button-item fx-center-center ${item.danger&&'danger'}`}>
            {item.icon}
            <span className='button-text'>{item.text}</span>
          </div>
        ))
      }
    </div>
  )
}