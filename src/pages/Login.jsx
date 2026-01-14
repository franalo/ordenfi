import React, { useState } from 'react';
import { db } from '../lib/db';
import { LogIn, UserPlus, Mail, Lock, ShieldCheck } from 'lucide-react';

export default function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        const user = await db.login(email, password);
        if (user) onLogin(user);
        else setError('Credenciales inválidas. Intente nuevamente.');
      } else {
        const user = await db.register(name, email, password);
        if (user) onLogin(user);
        else setError('El usuario ya existe (o hubo un error en el registro).');
      }
    } catch (err) {
      setError(err.message || 'Error en la conexión con el servidor.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card card">
        <div className="login-header">
          <div className="logo-icon">
            <ShieldCheck size={32} color="white" />
          </div>
          <h1>{isLogin ? 'ORDENFI_' : 'ÚNETE AHORA_'}</h1>
          <p>{isLogin ? 'Ingresa a tu centro de control financiero.' : 'Comienza a gestionar tu patrimonio hoy.'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <input
                placeholder="Tu nombre"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="input-group">
            <div className="input-icon"><Mail size={18} /></div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <div className="input-icon"><Lock size={18} /></div>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary">
            {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="auth-footer">
          <button onClick={() => setIsLogin(!isLogin)} className="toggle-btn">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <strong>{isLogin ? 'Registrate aquí' : 'Ingresa aquí'}</strong>
          </button>
        </div>
      </div>

      <style>{`
                .login-container {
                  min-height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background-color: var(--bg-primary); 
                  padding: 1rem;
                }

                .login-card {
                  background: var(--bg-card);
                  padding: 3.5rem;
                  border-radius: 28px;
                  width: 100%;
                  max-width: 480px;
                  box-shadow: var(--shadow-lg);
                  border: 1px solid var(--border);
                }

                .login-header {
                  text-align: center;
                  margin-bottom: 3rem;
                }

                .logo-icon {
                  width: 64px;
                  height: 64px;
                  background: linear-gradient(135deg, var(--vibrant-blue), var(--vibrant-violet));
                  border-radius: 18px;
                  margin: 0 auto 1.5rem;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4);
                }
                
                h1 {
                  font-size: 2.25rem;
                  font-weight: 900;
                  color: var(--text-primary);
                  margin-bottom: 0.5rem;
                  letter-spacing: -0.05em;
                }

                p {
                  color: var(--text-secondary);
                  font-size: 1rem;
                  font-weight: 500;
                  line-height: 1.4;
                }

                form { margin-bottom: 2.5rem; }

                .input-group {
                  position: relative;
                  margin-bottom: 1.25rem;
                }

                .input-icon {
                  position: absolute;
                  left: 16px;
                  top: 50%;
                  transform: translateY(-50%);
                  color: var(--text-muted);
                  pointer-events: none;
                  z-index: 10;
                }

                input {
                  width: 100%;
                  padding: 16px 16px 16px 48px;
                  background: var(--bg-secondary);
                  border: 1px solid var(--border);
                  border-radius: 14px;
                  color: var(--text-primary);
                  font-size: 1rem;
                  font-weight: 500;
                  outline: none;
                  transition: all 0.2s;
                }

                input:focus {
                  background: #fff;
                  border-color: var(--vibrant-blue);
                  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
                  transform: translateY(-1px);
                }

                .btn-primary {
                  width: 100%;
                  padding: 16px;
                  background: linear-gradient(135deg, var(--vibrant-blue), var(--vibrant-violet));
                  color: white;
                  border: none;
                  border-radius: 14px;
                  font-weight: 800;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 12px;
                  transition: all 0.2s;
                  margin-top: 2rem;
                  font-size: 1.1rem;
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                  box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.3);
                }

                .btn-primary:hover:not(:disabled) {
                  transform: translateY(-2px);
                  box-shadow: 0 15px 30px -5px rgba(37, 99, 235, 0.4);
                  filter: brightness(1.1);
                }
                
                .auth-footer {
                  text-align: center;
                  padding-top: 2rem;
                  border-top: 1px solid var(--border);
                }

                .toggle-btn {
                  color: var(--text-secondary);
                  font-size: 1rem;
                  font-weight: 600;
                }

                .toggle-btn strong {
                  color: var(--vibrant-blue);
                  margin-left: 6px;
                }

                .error-message {
                  color: #fff;
                  font-weight: 700;
                  font-size: 0.95rem;
                  text-align: center;
                  margin: 1.5rem 0;
                  background: var(--vibrant-pink);
                  padding: 1rem;
                  border-radius: 14px;
                  animation: shake 0.4s ease-in-out;
                }

                @keyframes shake {
                  0%, 100% { transform: translateX(0); }
                  25% { transform: translateX(-5px); }
                  75% { transform: translateX(5px); }
                }
            `}</style>
    </div>
  );
}
