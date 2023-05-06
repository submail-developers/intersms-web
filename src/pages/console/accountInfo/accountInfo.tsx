import { Space } from 'antd';
import MenuTitle from '@/components/menuTitle/menuTitle';
import LeftTab from './left';
import RightTab from './right';

// 客户信息
export default () => {
  return (
    <div data-class='accountinfo'>
      <MenuTitle title="客户信息"></MenuTitle>
      <div className='fx fx-wrap'>
          <LeftTab />
          <RightTab />
      </div>
    </div>
  );
};
