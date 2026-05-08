import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [formError, setFormError] = useState('');

  const { login, register, loading, error } = useAuth();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setFormError('');

  console.log('1. Submit ejecutado');

  if (!email || !password) {
    setFormError('Por favor completa todos los campos');
    return;
  }

  if (password.length < 6) {
    setFormError('La contraseña debe tener al menos 6 caracteres');
    return;
  }

  let result;
  if (isRegistering) {
    console.log('2. Intentando registrar...');
    result = await register(email, password);
    console.log('3. Resultado registro:', result);
  } else {
    console.log('2. Intentando login...');
    result = await login(email, password);
    console.log('3. Resultado login:', result);
  }

  if (result && result.success) {
    console.log('4. Login exitoso');
    console.log('5. Token guardado:', localStorage.getItem('token'));
    console.log('6. User guardado:', localStorage.getItem('user'));
    
    // FORZAR REDIRECCIÓN con window.location
    window.location.href = '/dashboard';
  } else {
    console.log('4. Login falló');
  }
};

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>{isRegistering ? 'Registro' : 'Inicio de Sesión'}</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            disabled={loading}
          />

          {(formError || error) && (
            <div style={styles.error}>{formError || error}</div>
          )}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Procesando...' : isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
          </button>
        </form>

        <button
          onClick={() => {
            setIsRegistering(!isRegistering);
            setFormError('');
          }}
          style={styles.switchButton}
        >
          {isRegistering
            ? '¿Ya tienes cuenta? Inicia sesión'
            : '¿No tienes cuenta? Regístrate'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '1rem',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  switchButton: {
    backgroundColor: 'transparent',
    color: '#3b82f6',
    padding: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    marginTop: '1rem',
    width: '100%',
  },
};