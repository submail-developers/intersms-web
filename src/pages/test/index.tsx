import { useAppDispatch, useAppSelector } from '@/store/hook'
import {
  addList,
  addNumber,
  addListAsync,
  addNumberAsync,
  testState,
} from '@/store/reducers/test'
import { Button } from 'antd'
import { getPetInfo, createPet, getNumberList } from '@/api'
import { useState } from 'react'
import type RES from '@/api/response.d.ts'

export default function Fn() {
  const dispatch = useAppDispatch()
  const testStore = useAppSelector(testState)

  const [petinfo, setpetInfo] = useState<RES.PetInfoRes>()
  const [createRes, setCreateRes] = useState<RES.PetInfoRes>()
  const [test, setTest] = useState<number[]>()

  const getDetail = () => {
    getPetInfo({
      id: 1,
    }).then((res) => {
      setpetInfo(res.data)
    })
  }

  const create = () => {
    createPet({
      name: '123',
      status: '123',
    }).then((res) => {
      setCreateRes(res.data)
    })
  }

  const testFn = () => {
    getNumberList().then((res) => {
      setTest(res.data)
    })
  }

  return (
    <div data-class='test'>
      <h1>reduxjs/toolkit使用方法</h1>
      <h2>number：{testStore.number}</h2>
      <div className='fx'>
        <Button onClick={() => dispatch(addNumber(1))}>同步add-number</Button>
        <Button onClick={() => dispatch(addNumberAsync(1))}>异步add</Button>
      </div>
      <dl>
        <dt>list: </dt>
        {testStore.list.map((item) => (
          <dd key={item.id}>
            id: {item.id};name: {item.name}
          </dd>
        ))}
      </dl>
      <div className='fx'>
        <Button onClick={() => dispatch(addList())}>同步add-list</Button>
        <Button onClick={() => dispatch(addListAsync())}>异步add-list</Button>
      </div>

      <h1>示例接口1-get：</h1>
      <div className='fx-y-center'>
        <Button onClick={getDetail}>获取接口1</Button>
        <p>{JSON.stringify(petinfo)}</p>
      </div>

      <h1>示例接口2-post：</h1>
      <div className='fx-y-center'>
        <Button onClick={create}>获取接口2</Button>
        <p>{JSON.stringify(createRes)}</p>
      </div>

      <h1>测试接口3-get：</h1>
      <div className='fx-y-center'>
        <Button onClick={testFn}>获取接口3</Button>
        <p>{JSON.stringify(test)}</p>
      </div>
    </div>
  )
}
