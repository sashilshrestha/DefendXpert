import { useNavigate, Link } from 'react-router';
import { useEffect, useState } from 'react';
import logo from '../assets/images/logo.png';
import { logout } from '../utils/logout'; // ✅ utility from earlier

const Navbar = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');

  useEffect(() => {
    const storedName = JSON.parse(localStorage.getItem('user'))?.name || ''; // Adjust based on your user object structure

    if (storedName) {
      setName(storedName);
    }
  }, []);

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <div className="navbar text-white">
      <div className="flex-1">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-16" />
        </Link>
      </div>
      <div className="flex-none">
        <ul className="flex items-center gap-6 px-1">
          <span>Hi, {name || 'User'}</span>
          <button onClick={handleLogout} className="btn btn-primary">
            Logout
          </button>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
