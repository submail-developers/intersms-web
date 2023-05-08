import { Space } from 'antd';
import MenuTitle from '@/components/menuTitle/menuTitle';
import LeftTab from './left';
import RightTab from './right';
import { useSize } from '@/hooks';

// 客户信息
export default () => {
  const size = useSize()
  return (
    <div data-class='accountinfo'>
      <MenuTitle title="客户信息"></MenuTitle>
      <div className={size=='small' ? '': 'fx fx-wrap'}>
          <LeftTab />
          <RightTab />
      </div>
    </div>
  );
};
