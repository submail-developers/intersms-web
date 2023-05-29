import { Col, Row, Popconfirm, Button } from 'antd'
import './table.scss'
export default () => {
  return (
    <div class-data='my-table'>
      <div className='thead fn14'>
        <div className='th name'>国家/地区名称</div>
        <div className='th'>国家/地区代码</div>
        <div className='th net-type'>运营商网络</div>
        <div className='th'>行业价格</div>
        <div className='th'>营销价格</div>
        <div className='th'>操作</div>
      </div>
      <div className='tbody active'>
        <div className='tr'>
          <div className='td name'>中国</div>
          <div className='td'>CN</div>
          <div className='td '>中国移动</div>
          <div className='td'>0.05000</div>
          <div className='td'>0.05000</div>
          <div className='td'>
            <Popconfirm
              placement='bottom'
              title='警告'
              description='确定删除选中的客户吗？'
              // onConfirm={deleteEvent}
              okText='确定'
              cancelText='取消'>
              <div className='delete-btn'>删除</div>
            </Popconfirm>
          </div>
        </div>
        <div className='tr'>
          <div className='td name'></div>
          <div className='td'></div>
          <div className='td'>中国移动</div>
          <div className='td'>0.05000</div>
          <div className='td'>0.05000</div>
          <div className='td'>
            <Popconfirm
              placement='bottom'
              title='警告'
              description='确定删除选中的客户吗？'
              // onConfirm={deleteEvent}
              okText='确定'
              cancelText='取消'>
              <div className='delete-btn'>删除</div>
            </Popconfirm>
          </div>
        </div>
        <div className='tr'>
          <div className='td name'></div>
          <div className='td'></div>
          <div className='td'>中国移动</div>
          <div className='td'>0.05000</div>
          <div className='td'>0.05000</div>
          <div className='td'>
            <Popconfirm
              placement='bottom'
              title='警告'
              description='确定删除选中的客户吗？'
              // onConfirm={deleteEvent}
              okText='确定'
              cancelText='取消'>
              <div className='delete-btn'>删除</div>
            </Popconfirm>
          </div>
        </div>
        <div className='tr'>
          <div className='td name'></div>
          <div className='td'></div>
          <div className='td'>中国移动</div>
          <div className='td'>0.05000</div>
          <div className='td'>0.05000</div>
          <div className='td'>
            <Popconfirm
              placement='bottom'
              title='警告'
              description='确定删除选中的客户吗？'
              // onConfirm={deleteEvent}
              okText='确定'
              cancelText='取消'>
              <div className='delete-btn'>删除</div>
            </Popconfirm>
          </div>
        </div>
      </div>
      <div className='tbody'>
        <div className='tr'>
          <div className='td name'>中国</div>
          <div className='td'>CN</div>
          <div className='td'>中国移动</div>
          <div className='td'>0.05000</div>
          <div className='td'>0.05000</div>
          <div className='td'>
            <Popconfirm
              placement='bottom'
              title='警告'
              description='确定删除选中的客户吗？'
              // onConfirm={deleteEvent}
              okText='确定'
              cancelText='取消'>
              <div className='delete-btn'>删除</div>
            </Popconfirm>
          </div>
        </div>
        <div className='tr'>
          <div className='td name'></div>
          <div className='td'></div>
          <div className='td'>中国移动</div>
          <div className='td'>0.05000</div>
          <div className='td'>0.05000</div>
          <div className='td'>
            <Popconfirm
              placement='bottom'
              title='警告'
              description='确定删除选中的客户吗？'
              // onConfirm={deleteEvent}
              okText='确定'
              cancelText='取消'>
              <div className='delete-btn'>删除</div>
            </Popconfirm>
          </div>
        </div>
        <div className='tr'>
          <div className='td name'></div>
          <div className='td'></div>
          <div className='td'>中国移动</div>
          <div className='td'>0.05000</div>
          <div className='td'>0.05000</div>
          <div className='td'>
            <Popconfirm
              placement='bottom'
              title='警告'
              description='确定删除选中的客户吗？'
              // onConfirm={deleteEvent}
              okText='确定'
              cancelText='取消'>
              <div className='delete-btn'>删除</div>
            </Popconfirm>
          </div>
        </div>
        <div className='tr'>
          <div className='td name'></div>
          <div className='td'></div>
          <div className='td'>中国移动</div>
          <div className='td'>0.05000</div>
          <div className='td'>0.05000</div>
          <div className='td'>
            <Popconfirm
              placement='bottom'
              title='警告'
              description='确定删除选中的客户吗？'
              // onConfirm={deleteEvent}
              okText='确定'
              cancelText='取消'>
              <div className='delete-btn'>删除</div>
            </Popconfirm>
          </div>
        </div>
      </div>
    </div>
  )
}
