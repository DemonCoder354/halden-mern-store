import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import App from './App.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { UIProvider } from './context/UIContext.jsx';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Respects the OS "reduce motion" setting for every animation. */}
      <MotionConfig reducedMotion="user">
        <UIProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </UIProvider>
      </MotionConfig>
    </BrowserRouter>
  </React.StrictMode>
);
