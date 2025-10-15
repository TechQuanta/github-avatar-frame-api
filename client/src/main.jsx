import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './main.css';

// Initialize AOS (Animate On Scroll)
AOS.init({
  duration: 1000, // animation duration in ms
  once: true,     // animation occurs only once
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
