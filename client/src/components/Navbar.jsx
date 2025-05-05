import logo from '../assets/images/logo.png';
import { Link } from 'react-router';

const Navbar = () => {
  return (
    <>
      <div className="navbar">
        <div className="flex-1">
          <Link to="/">
            <img src={logo} alt="" className="h-16" />
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1 text-white">
            <li>
              <Link to={'admin/model-training'}>Admin</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
