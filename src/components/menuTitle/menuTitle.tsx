import { useMatches, useLoaderData } from 'react-router-dom'
import './menuTitle.scss'

interface Params {
  title?: string
}

export default function MenuTitle(props: Params) {
  const loaderData = useLoaderData() as { name: string }
  return (
    <div data-class='menu-title' className='fx-y-center fn16'>
      {props.title || loaderData?.name || ''}
    </div>
  )
}
