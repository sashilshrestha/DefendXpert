import { Outlet } from 'react-router';
import Sidebar from './Sidebar';

const AdminLayout = () => {
  return (
    <>
      <div className="min-h-screen flex">
        <Sidebar />

        <div className="flex-1 flex flex-col p-4 ml-64">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
