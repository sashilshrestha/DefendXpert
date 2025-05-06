import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Logo from '../assets/images/logo.png';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        console.log('Login successful:', data);

        // ✅ Save token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));

        if (data.role === 'admin') navigate('/admin');

        if (data.role === 'user') navigate('/');

        // Redirect or do something after successful login
        alert('Login successful!');
        // window.location.href = '/dashboard'; // Optional redirect
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-gray-50  text-gray-400">
      <div className="relative w-full max-w-md bg-dxprimary shadow-lg rounded-lg p-6">
        <div className="flex justify-center items-center">
          <img src={Logo} />
        </div>
        <h2 className="text-2xl font-bold text-center mb-4">
          Welcome to DefendXpert
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Please sign in to access your account
        </p>

        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">
              Email or Username
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-500"
              placeholder="Enter your email or username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white bg-primary transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Logging in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center mt-4">
          <Link to={'/register'} className="text-indigo-500 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
