import { Navigate, Outlet, useLoaderData } from 'react-router';

export default function ProtectedRoute() {
  const mode = useLoaderData();

  const token = localStorage.getItem('token');
  const role = JSON.parse(localStorage.getItem('user'))?.role || 'user';

  if (!token) return <Navigate to="/login" replace />;
  if (role !== mode.allowedRole) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
}
// return token ? <Outlet /> : <Navigate to="/login" replace />;}
