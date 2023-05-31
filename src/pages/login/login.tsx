import { useEffect, useState } from 'react'
import Welcome from './welcome'
import Code from './code'
import './login.scss'
import Logo from '@/assets/img/logo.svg'
import bg from '@/assets/img/login.jpg'
import { useSize } from '@/hooks'
export default function Login() {
  const size = useSize()
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
      <img src={bg} className='bg' alt='' />
      <img src={Logo} className='logo' alt='' />
      <div className={`form-wrap ${size}`}>
        <div
          className='anim'
          style={{
            transform: `translateX(-${step * (size == 'small' ? 320 : 400)}px)`,
          }}>
          <Welcome next={() => changeStep(1)} step={step} />
          <Code beforeStep={() => changeStep(0)} step={step} />
        </div>
      </div>
    </div>
  )
}
