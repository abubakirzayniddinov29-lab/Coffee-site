import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Enables CSS "pre-animation" hidden states only when JS runs
document.documentElement.classList.add('js-anim');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
