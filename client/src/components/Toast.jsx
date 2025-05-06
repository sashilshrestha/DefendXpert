// src/components/Toast.jsx
import { useEffect, useState } from 'react';

const Toast = ({ toast }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 2800); // sync with duration in hook
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!toast) return null;

  const baseStyle =
    'fixed bottom-6 right-6 z-50 rounded shadow-lg text-white transition-all duration-500 transform';
  const typeStyles = {
    success: 'bg-green-700',
    error: 'bg-red-700',
    info: 'bg-blue-700',
    warning: 'bg-yellow-500 text-black',
  };

  return (
    <div
      className={`${baseStyle} ${typeStyles[toast.type] || 'bg-gray-800'} ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
      }`}
    >
      <div className="max-w-sm rounded-lg px-12 py-6 shadow-md">
        <p className="relative mb-1 text-sm font-medium">
          <span className="absolute -left-7 flex h-5 w-5 items-center justify-center rounded-xl bg-green-400 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="h-3 w-3"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </span>
          <span className="text-gray-50">{toast.message}</span>
        </p>
      </div>
    </div>
  );
};

export default Toast;
