import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!correo || !password) {
      setError('Por favor, ingresa ambos campos');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        correo,
        password,
      });

      if (response.data.success) {
        navigate('/admin');
      } else {
        setError('Usuario no registrado o contraseña incorrecta');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="login-container">
      <button className="back-button" onClick={handleGoBack}>
        <FaArrowLeft /> Regresar
      </button>
      
      <div className="login-box">
        <div className="login-header">
          {/* <div className="bank-logo"></div> */}
          <h2>Iniciar Sesión</h2>
          <p>Accede a tu banca en línea</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
              <span onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">Iniciar sesión</button>
          
       
        </form>
      </div>
      
   
    </div>
  );
};

export default Login;