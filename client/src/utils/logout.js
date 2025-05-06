// src/utils/logout.js
export const logout = (navigate) => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user'); // if you store user info

  // Optional: clear all if needed
  // localStorage.clear();

  // Redirect to login
  navigate('/login');
};
