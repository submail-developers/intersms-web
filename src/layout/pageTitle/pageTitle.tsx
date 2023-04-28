import { useMatches } from 'react-router-dom';
import './pageTitle.scss';

export default () => {
  const matches = useMatches()
  const match = matches[2] // 取三级导航的alias
  return (
    // @ts-ignore
    <div data-class='pageTitle' className="fn16">{match?.handle?.alias||''}</div>
  )
}
