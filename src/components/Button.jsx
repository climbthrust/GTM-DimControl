// src/components/Button.jsx
export default function Button({ children, variant = 'primary', onClick }) {
  const base =
    'px-4 py-2 rounded-md font-semibold focus:outline-none transition';
  const variants = {
    primary: 'bg-gtm-accent-500 hover:bg-gtm-accent-600 text-gtm-text-800',
    secondary: 'bg-gtm-gray-200 hover:bg-gtm-gray-300 text-gtm-text-700',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };

  return (
    <button onClick={onClick} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  );
}
