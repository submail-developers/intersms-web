import { Spin } from 'antd';
import { useAppSelector } from '@/store/hook'
import { loadingStatus } from '@/store/reducers/loading';

import './loading.scss';

export default () => {
  const show = useAppSelector(loadingStatus)
  return (
    <>
      {
        show&&<div data-class="loading">
          <Spin />
        </div>
      }
    </>
  )
}