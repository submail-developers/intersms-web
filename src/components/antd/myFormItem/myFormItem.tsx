import React from 'react';
import './myFormItem.scss';

interface Props {
  children: React.ReactNode
  label: string
  size: 'large' | 'middle' | 'small'
  style?: React.CSSProperties
}

const defaultProps:Props = {
  children: <></>,
  label: '',
  size: 'large'
}

export default function MyFormItem(props:Props=defaultProps) {
  return (
      <div data-calss='submail-form-item' className={`fx-y-center ${props.size}`} style={props.style}>
        <div className='label fx-center-center'>{props.label}</div>
        {
          props.children
        }
      </div>
  )
}