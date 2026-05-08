import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si hay token al cargar la página
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    console.log('DashboardPage - token:', token);
    console.log('DashboardPage - userData:', userData);
    
    if (!token) {
      console.log('No hay token, redirigiendo a login');
      navigate('/login');
      return;
    }
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Menú Premium</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Cerrar Sesión
        </button>
      </div>
      <div style={styles.content}>
        <h2>Iniciaste sesión correctamente</h2>
        <p>Bienvenido, <strong>{user?.email || 'Usuario'}</strong></p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: 'white',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
  content: {
    maxWidth: '600px',
    margin: '3rem auto',
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '1rem',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
};