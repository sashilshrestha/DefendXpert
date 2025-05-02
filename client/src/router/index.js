import { createBrowserRouter } from 'react-router';
import App from '../App.jsx';
import ScanComplete from '../components/ScanComplete.jsx';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: App,
    },
    {
      path: '/scan-complete',
      Component: ScanComplete,
    },
  ],
  {
    basename: '/DefendXpert', // 👈 add this
  }
);
