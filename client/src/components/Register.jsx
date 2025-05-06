import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Logo from '../assets/images/logo.png';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    re_password: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ ${data.message} (${data.name})`);
        // Optionally redirect or reset
        // window.location.href = '/login';
        setTimeout(() => {
          navigate('/login'); // ← Step 3: redirect
        }, 1000);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 text-gray-400">
      <div className="w-full max-w-md bg-dxprimary p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          Create an Account
        </h2>

        {message && (
          <div className="mb-4 text-green-600 text-center">{message}</div>
        )}
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center items-center">
            <img src={Logo} />
          </div>
          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input
              name="first_name"
              type="text"
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-500"
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              name="last_name"
              type="text"
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-500"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-500"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-500"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Confirm Password
            </label>
            <input
              name="re_password"
              type="password"
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-500"
              value={formData.re_password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white btn btn-primary transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <Link to={'/login'} className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
