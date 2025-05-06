import { createBrowserRouter } from 'react-router';
import Register from '../components/Register.jsx';

import AdminLayout from '../layout/AdminLayout.jsx';
import ModelTraining from '../pages/ModelTraining.jsx';
import Login from '../components/Login.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import ConfidenceLevel from '../pages/ConfidenceLevel.jsx';
import Unauthorized from '../layout/Unauthorized.jsx';
import ScanComplete from '../components/ScanComplete.jsx';
import UserLayout from '../layout/UserLayout.jsx';
import FileUploadWithSteps from '../components/FileUploaderWithSteps.jsx';

export const router = createBrowserRouter(
  [
    // Main Index Page User View
    {
      path: '',
      Component: ProtectedRoute,
      loader: async () => {
        return { allowedRole: 'user' };
      },
      children: [
        {
          path: '',
          Component: UserLayout,
          children: [
            {
              path: '',
              Component: FileUploadWithSteps,
            },
            {
              path: 'scan-complete',
              Component: ScanComplete,
            },
          ],
        },
      ],
    },
    {
      path: 'register',
      Component: Register,
    },
    {
      path: 'login',
      Component: Login,
    },
    {
      path: 'unauthorized',
      Component: Unauthorized,
    },

    {
      path: 'admin',
      Component: ProtectedRoute,
      loader: async () => {
        return { allowedRole: 'admin' };
      },
      children: [
        {
          path: '',
          Component: AdminLayout,
          children: [
            {
              path: 'model-training',
              Component: ModelTraining,
            },
            {
              path: 'confidence-level',
              Component: ConfidenceLevel,
            },
          ],
        },
      ],
    },
  ],
  {
    basename: '/DefendXpert',
  }
);
