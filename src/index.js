import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa desde 'react-dom/client'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// Crea un root con React 18
const root = ReactDOM.createRoot(document.getElementById('root'));

// Usa el método render en el root creado
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Si deseas que tu app funcione offline, puedes cambiar 'unregister()' a 'register()'
serviceWorker.unregister();
