import { Outlet } from 'react-router';
import Navbar from '../components/Navbar.jsx';

const UserLayout = () => {
  return (
    <>
      <div className="shadow-md bg-dxprimary">
        <div className="mx-auto max-w-7xl">
          <Navbar />
        </div>
      </div>
      <div className="mx-auto max-w-7xl">
        <Outlet />
      </div>
    </>
  );
};

export default UserLayout;
