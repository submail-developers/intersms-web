import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Welcome from './welcome'
import Code from './code'

import loginbanner from '@/assets/img/loginbanner.png'
import './login.scss'
export default function Login() {
  const [step, setstep] = useState(0)
  const changeStep = (_step: number) => {
    setstep(_step)
  }
  useEffect(() => {
    return () => {
      setstep(0)
    }
  }, [])
  return (
    <div data-class='login'>
      <div className='img-wrap'>
        <img src={loginbanner} alt='' />
      </div>
      <div className='right'>
        <div className='form-wrap'>
          <div
            className='anim'
            style={{ transform: `translateX(-${step * 496}px)` }}>
            <Welcome next={() => changeStep(1)} step={step} />
            <Code beforeStep={() => changeStep(0)} step={step} />
          </div>
        </div>
      </div>
    </div>
  )
}
