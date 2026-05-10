import React, { useState } from 'react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isRegistering ? '/auth/register' : '/auth/login';
      const response = await fetch(`http://localhost:3000/api${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        window.location.href = '/dashboard';
      } else {
        setError(data.message || 'Error en la operación');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <div style={styles.card}>
        <div style={styles.goldBar}></div>
        <div style={styles.icon}>🍽️</div>
        <h1 style={styles.title}>
          {isRegistering ? 'Crear Cuenta' : 'Bienvenido'}
        </h1>
        <p style={styles.subtitle}>
          {isRegistering 
            ? 'Regístrate para acceder al menú exclusivo' 
            : 'Ingresa a tu cuenta premium'}
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              disabled={loading}
            />
          </div>

          {error && <div style={styles.error}>❌ {error}</div>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Procesando...' : (isRegistering ? 'Registrarse' : 'Iniciar Sesión')}
            <span style={styles.buttonGlow}></span>
          </button>
        </form>

        <button
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError('');
          }}
          style={styles.switchButton}
        >
          {isRegistering 
            ? '¿Ya tienes cuenta? Inicia sesión' 
            : '¿No tienes cuenta? Regístrate'}
        </button>

        <div style={styles.footerNote}>
          <span style={styles.footerLine}></span>
          <p>Acceso exclusivo • Menú Premium</p>
        </div>
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
    position: 'relative',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
  },
  card: {
    position: 'relative',
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    textAlign: 'center',
    zIndex: 1,
  },
  goldBar: {
    width: '60px',
    height: '3px',
    background: 'linear-gradient(90deg, #d4af37, #f3e5ab, #d4af37)',
    margin: '0 auto 1.5rem auto',
    borderRadius: '2px',
  },
  icon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    gap: '0.5rem',
  },
  label: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '0.75rem',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#6b7280',
  },
  input: {
    padding: '0.875rem 1rem',
    border: '1.5px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontFamily: "'Poppins', sans-serif",
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  button: {
    position: 'relative',
    backgroundColor: '#d4af37',
    color: '#1a1a1a',
    padding: '1rem',
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    marginTop: '0.5rem',
  },
  buttonGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '0',
    height: '0',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: 'translate(-50%, -50%)',
    transition: 'width 0.5s, height 0.5s',
  },
  switchButton: {
    backgroundColor: 'transparent',
    color: '#d4af37',
    padding: '0.75rem',
    border: 'none',
    fontSize: '0.75rem',
    cursor: 'pointer',
    marginTop: '1rem',
    fontFamily: "'Poppins', sans-serif",
    transition: 'color 0.2s ease',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '0.75rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    textAlign: 'center',
  },
  footerNote: {
    marginTop: '2rem',
  },
  footerLine: {
    display: 'block',
    width: '40px',
    height: '1px',
    backgroundColor: '#e5e7eb',
    margin: '0 auto 0.75rem',
  },
  
};

// Estilo para hover (se agrega con CSS-in-JS dinámico)
const buttonHover = {
  backgroundColor: '#c4a02e',
  transform: 'translateY(-2px)',
  boxShadow: '0 10px 20px -10px rgba(212, 175, 55, 0.3)',
};