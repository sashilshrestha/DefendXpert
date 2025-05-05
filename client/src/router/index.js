import { createBrowserRouter } from 'react-router';
import App from '../App.jsx';
import ScanComplete from '../components/ScanComplete.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import AdminLayout from '../layout/AdminLayout.jsx';
import ModelTraining from '../pages/ModelTraining.jsx';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: App,
    },
    {
      path: 'scan-complete',
      Component: ScanComplete,
    },
    {
      path: 'admin',
      Component: AdminLayout,
      children: [
        {
          path: 'dashboard',
          Component: Dashboard,
        },
        {
          path: 'model-training',
          Component: ModelTraining,
        },
        // Add more routes here as needed
      ],
    },
  ],
  {
    basename: '/DefendXpert', // 👈 add this
  }
);
