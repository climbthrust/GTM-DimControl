import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className='bg-gtm-gray-900 flex justify-center'>
      <App />
    </div>
  </React.StrictMode>
);
