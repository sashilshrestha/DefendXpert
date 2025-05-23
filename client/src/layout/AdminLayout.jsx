import { Outlet, useNavigate } from 'react-router';
import Sidebar from './Sidebar';
import { useEffect } from 'react';

const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/admin/confidence-level', { replace: true });
  }, []);

  return (
    <>
      <div className="min-h-screen flex">
        <Sidebar />

        <div className="flex-1 flex flex-col ml-64 relative">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
