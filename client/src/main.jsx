import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './main.css'

AOS.init({
  duration: 1000, 
  once: true,     
});

ReactDOM.createRoot(document.getElementById('root')).render(

    <App />

);
