import { FC } from 'react';
import { RouterProvider } from "react-router-dom";
import { Provider } from 'react-redux';
import router from '@/routes';
import { store } from '@/store';
import Loading from '@/components/loading/loading';

const App: FC = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <Loading></Loading>
    </Provider>
  )
}

export default App
