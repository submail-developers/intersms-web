// import { HashRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import router from '@/routes'
import { store } from '@/store'
import Loading from '@/components/loading/loading'

export default function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <Loading></Loading>
    </Provider>
  )
}
