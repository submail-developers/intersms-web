import { useEffect, useState, MutableRefObject, useRef } from 'react'
import Welcome from './welcome'
import Code from './code'
import './login.scss'
import Logo from '@/assets/img/logo.svg'
import bg from '@/assets/img/login.jpg'
import { useSize } from '@/hooks'
import { API } from 'apis'
export default function Login() {
  const codeRef: MutableRefObject<any> = useRef(null)
  const [userInfo, setuserInfo] = useState<API.userInfo | null>(null)
  const size = useSize()
  const [step, setstep] = useState(0)
  const changeStep = (_step: number) => {
    setstep(_step)
  }
  const next = (info: API.userInfo) => {
    setuserInfo(info)
    changeStep(1)
    codeRef.current?.initForm()
  }
  useEffect(() => {
    return () => {
      setstep(0)
    }
  }, [])
  return (
    <div data-class='login'>
      <img src={bg} className='bg' alt='' />
      <img src={size == 'small' ? '' : Logo} className='logo' alt='' />
      <div className={`form-wrap ${size}`}>
        <div
          className='anim'
          style={{
            transform: `translateX(-${step * (size == 'small' ? 320 : 400)}px)`,
          }}>
          <Welcome next={(info) => next(info)} step={step} />
          <Code
            ref={codeRef}
            beforeStep={() => changeStep(0)}
            step={step}
            mob={userInfo?.mob || ''}
          />
        </div>
      </div>
    </div>
  )
}
