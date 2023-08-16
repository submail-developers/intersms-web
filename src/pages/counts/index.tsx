import * as Echarts from 'echarts'
import { MutableRefObject, useEffect, useRef } from 'react'
import { Card, Space, Row, Col } from 'antd'
import style from './chart.module.scss'
import MenuTitle from '@/components/menuTitle/menuTitle'
type EChartsOption = echarts.EChartsOption

const pieOption: EChartsOption = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line',
    },
  ],
}
const pieOption2: EChartsOption = {
  tooltip: {
    trigger: 'item',
  },
  legend: {
    top: '5%',
    left: 'center',
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold',
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' },
      ],
    },
  ],
}
const pieOption3: EChartsOption = {
  title: {
    text: 'Referer of a Website',
    subtext: 'Fake Data',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
}
const pieOption4: EChartsOption = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar',
    },
  ],
}

function Echart() {
  const chartpie: MutableRefObject<any> = useRef(null)
  const chartpie2: MutableRefObject<any> = useRef(null)
  const chartpie3: MutableRefObject<any> = useRef(null)
  const chartpie4: MutableRefObject<any> = useRef(null)

  const chartInit = () => {
    const mychartpie = Echarts.init(chartpie.current)
    mychartpie.setOption(pieOption, true)

    const mychartpie2 = Echarts.init(chartpie2.current)
    mychartpie2.setOption(pieOption2, true)

    const mychartpie3 = Echarts.init(chartpie3.current)
    mychartpie3.setOption(pieOption3, true)

    const mychartpie4 = Echarts.init(chartpie4.current)
    mychartpie4.setOption(pieOption4, true)

    window.onresize = () => {
      mychartpie.resize()
      mychartpie2.resize()
      mychartpie3.resize()
      mychartpie4.resize()
    }
  }

  useEffect(() => {
    chartInit()

    return () => {
      window.onresize = null
    }
  }, [])

  return (
    <>
      <div>
        <MenuTitle title='行业短信数据'></MenuTitle>
        <Row justify='space-between' gutter={30}>
          <Col span={24}>
            <Card size='small' title='API 分析报告'>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <div>
                  API 请求 <div>29</div>
                </div>
                <div>
                  发送成功<div>22</div>
                </div>
                <div>
                  发送失败<div>22</div>
                </div>
                <div>
                  实际计费<div>￥7.737</div>
                </div>
                <div>
                  短信数量<div>29</div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30} style={{ marginTop: '40px' }}>
          <Col span={12}>
            <Card size='small' title='发送与计费'>
              {' '}
              <div ref={chartpie} className={style.chartbox}></div>
            </Card>
          </Col>
          <Col span={12}>
            <Card size='small' title='时段'>
              <div ref={chartpie2} className={style.chartbox}></div>
            </Card>
          </Col>
        </Row>

        <Row justify='space-between' gutter={30} style={{ marginTop: '40px' }}>
          <Col span={8}>
            <Card size='small' title='成功率'>
              <div ref={chartpie3} className={style.chartbox}></div>
            </Card>
          </Col>
          <Col span={16}>
            <Card size='small' title='失败分析'>
              <div className='bin'>
                <div ref={chartpie4} className={style.chartbox}></div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      <div></div>
    </>
  )
}

export default Echart
