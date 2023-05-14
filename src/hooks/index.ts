import { Grid } from 'antd'

// 自定义hooks
/**
 * 根据屏幕大小 返回 'large' | 'middle' | 'small'
 */
export const useSize = () => {
  const { useBreakpoint } = Grid
  const screens = useBreakpoint()
  let size: Size = 'middle' // 默认大屏
  if (Object.keys(screens).length > 0) {
    // if (screens.xl) {
    //   // 屏幕 ≥ 1200px
    //   size = 'large'
    // } else
    if (screens.md) {
      // 屏幕 ≥ 768px
      size = 'middle'
    } else {
      size = 'small'
    }
    return size
  } else {
    return size
  }
}
