import './menuTitle.scss'

interface Params {
  title?: string
}

export default function MenuTitle(props: Params) {
  return (
    <>
      {props.title && (
        <div data-class='menu-title' className='fx-y-center fn16'>
          {props.title}
        </div>
      )}
    </>
  )
}
