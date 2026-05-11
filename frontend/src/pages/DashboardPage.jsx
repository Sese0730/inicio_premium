import React, { useEffect, useState } from 'react';

export const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dishes');
  
  // Estados para búsquedas
  const [dishSearch, setDishSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const token = localStorage.getItem('token');

  // Función para buscar platillos
  const searchDishes = async () => {
    if (!dishSearch.trim()) {
      // Si no hay búsqueda, mostrar todos
      setFilteredDishes(dishes);
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3000/api/dishes/premium?search=${encodeURIComponent(dishSearch)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setFilteredDishes(data.data);
      }
    } catch (error) {
      console.error('Error buscando platillos:', error);
    }
  };

  // Función para buscar usuarios
  const searchUsers = async () => {
    if (!userSearch.trim()) {
      setFilteredUsers(users);
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3000/api/users?search=${encodeURIComponent(userSearch)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        if (data.data && data.data.users) {
          setFilteredUsers(data.data.users);
        } else if (Array.isArray(data.data)) {
          setFilteredUsers(data.data);
        } else {
          setFilteredUsers([]);
        }
      }
    } catch (error) {
      console.error('Error buscando usuarios:', error);
    }
  };

  // Limpiar búsqueda de platillos
  const clearDishSearch = () => {
    setDishSearch('');
    setFilteredDishes(dishes);
  };

  // Limpiar búsqueda de usuarios
  const clearUserSearch = () => {
    setUserSearch('');
    setFilteredUsers(users);
  };

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const loadData = async () => {
      setLoading(true);
      
      try {
        // 1. Cargar platillos premium
        const dishesRes = await fetch('http://localhost:3000/api/dishes/premium', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const dishesData = await dishesRes.json();
        if (dishesData.success) {
          setDishes(dishesData.data);
          setFilteredDishes(dishesData.data);
        }

        // 2. Cargar usuarios
        const usersRes = await fetch('http://localhost:3000/api/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const usersData = await usersRes.json();
        
        if (usersData.success) {
          if (usersData.data && usersData.data.users) {
            setUsers(usersData.data.users);
            setFilteredUsers(usersData.data.users);
          } else if (Array.isArray(usersData.data)) {
            setUsers(usersData.data);
            setFilteredUsers(usersData.data);
          } else {
            setUsers([]);
            setFilteredUsers([]);
          }
        }
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div style={styles.container}>
      {/* HEADER PREMIUM */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logoSection}>
            <span style={styles.logoIcon}></span>
            <h1 style={styles.title}>Menu<span style={styles.titleGold}>Premium</span></h1>
          </div>
          <div style={styles.userInfo}>
            <div style={styles.userBadge}>
              <span style={styles.userIcon}></span>
              <span style={styles.userEmail}>{user?.email}</span>
            </div>
            <button onClick={handleLogout} style={styles.logoutButton}>
              <span>Salir</span>
            </button>
          </div>
        </div>
        <div style={styles.headerGoldBorder}></div>
      </div>

      {/* TABS PREMIUM */}
      <div style={styles.tabsContainer}>
        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab('dishes')}
            style={{ ...styles.tab, ...(activeTab === 'dishes' ? styles.tabActive : {}) }}
          >
            <span style={styles.tabIcon}></span>
            Platillos Premium
            {activeTab === 'dishes' && <span style={styles.tabActiveIndicator}></span>}
          </button>
          <button
            onClick={() => setActiveTab('users')}
            style={{ ...styles.tab, ...(activeTab === 'users' ? styles.tabActive : {}) }}
          >
            <span style={styles.tabIcon}></span>
            Usuarios Registrados
            {activeTab === 'users' && <span style={styles.tabActiveIndicator}></span>}
          </button>
        </div>
      </div>

      {/* CONTENIDO */}
      <div style={styles.content}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Cargando experiencia premium...</p>
          </div>
        ) : (
          <>
            {/* SECCIÓN PLATILLOS CON BUSCADOR */}
            {activeTab === 'dishes' && (
              <div style={styles.fadeIn}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>Menú Exclusivo</h2>
                  <div style={styles.sectionLine}></div>
                  
                  {/* BUSCADOR DE PLATILLOS */}
                  <div style={styles.searchContainer}>
                    <input
                      type="text"
                      placeholder="Buscar por nombre..."
                      value={dishSearch}
                      onChange={(e) => setDishSearch(e.target.value)}
                      style={styles.searchInput}
                      onKeyPress={(e) => e.key === 'Enter' && searchDishes()}
                    />
                    <button onClick={searchDishes} style={styles.searchButton}>Buscar</button>
                    {dishSearch && (
                      <button onClick={clearDishSearch} style={styles.clearButton}>Limpiar</button>
                    )}
                  </div>
                  <p style={styles.subtitle}>{filteredDishes.length} platillos disponibles</p>
                </div>
                
                <div style={styles.grid}>
                  {filteredDishes.map(dish => (
                    <div key={dish.id} className="dish-card" style={styles.card}>
                      <div style={styles.cardGoldAccent}></div>
                      
                      {/* IMAGEN DEL PLATILLO */}
                      {dish.imageUrl ? (
                        <div style={styles.imageContainer}>
                          <img 
                            src={dish.imageUrl} 
                            alt={dish.name}
                            style={styles.dishImage}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
                            }}
                          />
                          <div style={styles.imageOverlay}></div>
                          <span style={styles.imageBadge}>Premium</span>
                        </div>
                      ) : (
                        <div style={styles.imagePlaceholder}>
                          <span style={styles.imagePlaceholderIcon}></span>
                        </div>
                      )}
                      
                      <div style={styles.cardContent}>
                        <h3 style={styles.dishName}>{dish.name}</h3>
                        <p style={styles.dishDescription}>{dish.description}</p>
                        <div style={styles.cardFooter}>
                          <div style={styles.priceContainer}>
                            <span style={styles.priceIcon}></span>
                            <span style={styles.price}>${parseFloat(dish.price).toFixed(2)}</span>
                          </div>
                          <span style={styles.orderHint}>Ordenar →</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {filteredDishes.length === 0 && (
                  <div style={styles.emptyState}>
                    <span style={styles.emptyIcon}></span>
                    <p>No se encontraron platillos con "{dishSearch}"</p>
                  </div>
                )}
              </div>
            )}

            {/* SECCIÓN USUARIOS CON BUSCADOR */}
            {activeTab === 'users' && (
              <div style={styles.fadeIn}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>Miembros Registrados</h2>
                  <div style={styles.sectionLine}></div>
                  
                  {/* BUSCADOR DE USUARIOS */}
                  <div style={styles.searchContainer}>
                    <input
                      type="text"
                      placeholder="Buscar por email..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      style={styles.searchInput}
                      onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
                    />
                    <button onClick={searchUsers} style={styles.searchButton}>Buscar</button>
                    {userSearch && (
                      <button onClick={clearUserSearch} style={styles.clearButton}>Limpiar</button>
                    )}
                  </div>
                  <p style={styles.subtitle}>Total: <span style={styles.totalCount}>{filteredUsers.length}</span> usuarios</p>
                </div>
                
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Rol</th>
                        <th style={styles.th}>Fecha de Registro</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(userItem => (
                        <tr key={userItem.id} style={userItem.email === user?.email ? styles.trCurrentUser : styles.tr}>
                          <td style={styles.td}>{userItem.id}</td>
                          <td style={styles.td}>
                            {userItem.email}
                            {userItem.email === user?.email && (
                              <span style={styles.currentUserBadge}> (Tú)</span>
                            )}
                          </td>
                          <td style={styles.td}>
                            <span style={userItem.role === 'admin' ? styles.roleAdmin : styles.roleUser}>
                              {userItem.role === 'admin' ? 'Administrador' : 'Usuario'}
                            </span>
                          </td>
                          <td style={styles.td}>
                            {new Date(userItem.createdAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredUsers.length === 0 && (
                  <div style={styles.emptyState}>
                    <p>No se encontraron usuarios con "{userSearch}"</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #faf8f3 0%, #f5f0e8 100%)',
  },
  header: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logoIcon: {
    fontSize: '2rem',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: '-0.5px',
  },
  titleGold: {
    color: '#d4af37',
    fontWeight: '700',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  userBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50px',
    border: '1px solid rgba(212, 175, 55, 0.3)',
  },
  userIcon: {
    fontSize: '0.875rem',
  },
  userEmail: {
    color: '#f0f0f0',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  logoutButton: {
    background: 'linear-gradient(135deg, #d4af37 0%, #b49450 100%)',
    color: '#1a1a2e',
    padding: '0.5rem 1.25rem',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    transition: 'all 0.3s ease',
  },
  headerGoldBorder: {
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #d4af37, #f3e5ab, #d4af37, transparent)',
  },
  tabsContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  tabs: {
    display: 'flex',
    gap: '0.5rem',
    borderBottom: '2px solid rgba(212, 175, 55, 0.2)',
  },
  tab: {
    position: 'relative',
    padding: '1rem 2rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#6b7280',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: "'Poppins', sans-serif",
  },
  tabIcon: {
    fontSize: '1.125rem',
  },
  tabActive: {
    color: '#d4af37',
    background: 'linear-gradient(180deg, rgba(212, 175, 55, 0.1) 0%, transparent 100%)',
  },
  tabActiveIndicator: {
    position: 'absolute',
    bottom: '-2px',
    left: '0',
    right: '0',
    height: '2px',
    background: '#d4af37',
    borderRadius: '2px',
  },
  content: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem',
  },
  fadeIn: {
    animation: 'fadeIn 0.4s ease-out',
  },
  sectionHeader: {
    marginBottom: '2rem',
    textAlign: 'center',
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '0.5rem',
  },
  sectionLine: {
    width: '80px',
    height: '3px',
    background: 'linear-gradient(90deg, #d4af37, #f3e5ab)',
    borderRadius: '3px',
    margin: '0 auto 0.75rem auto',
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.75rem',
    margin: '1.5rem 0 1rem 0',
  },
  searchInput: {
    padding: '0.75rem 1rem',
    width: '300px',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    borderRadius: '50px',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'all 0.2s ease',
    fontFamily: "'Poppins', sans-serif",
  },
  searchButton: {
    background: 'linear-gradient(135deg, #d4af37 0%, #b49450 100%)',
    color: '#1a1a2e',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  clearButton: {
    background: 'transparent',
    color: '#6b7280',
    padding: '0.75rem 1.5rem',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    borderRadius: '50px',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: '500',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '0.875rem',
    marginTop: '0.5rem',
  },
  totalCount: {
    color: '#d4af37',
    fontWeight: '700',
    fontSize: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '2rem',
  },
  card: {
    position: 'relative',
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 20px 35px -15px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.35s cubic-bezier(0.2, 0, 0, 1)',
    border: '1px solid rgba(212, 175, 55, 0.15)',
  },
  cardGoldAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #d4af37, #f3e5ab, #d4af37)',
    zIndex: 2,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '220px',
    overflow: 'hidden',
    backgroundColor: '#1a1a2e',
  },
  dishImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.4) 100%)',
  },
  imageBadge: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    backgroundColor: 'rgba(212, 175, 55, 0.95)',
    color: '#1a1a2e',
    padding: '0.25rem 0.75rem',
    borderRadius: '50px',
    fontSize: '0.7rem',
    fontWeight: '700',
    zIndex: 2,
  },
  imagePlaceholder: {
    width: '100%',
    height: '220px',
    background: 'linear-gradient(135deg, #f5f0e8, #e8e0d0)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderIcon: {
    fontSize: '3rem',
  },
  cardContent: {
    padding: '1.5rem',
  },
  dishName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '0.5rem',
  },
  dishDescription: {
    color: '#6b7280',
    fontSize: '0.8rem',
    lineHeight: '1.5',
    marginBottom: '1rem',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(212, 175, 55, 0.15)',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  priceIcon: {
    fontSize: '0.875rem',
  },
  price: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#d4af37',
  },
  orderHint: {
    fontSize: '0.75rem',
    fontWeight: '500',
    color: '#6b7280',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    padding: '0.25rem 0.75rem',
    borderRadius: '50px',
    border: '1px solid rgba(212, 175, 55, 0.3)',
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(212, 175, 55, 0.15)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '1rem 1.5rem',
    textAlign: 'left',
    fontFamily: "'Poppins', sans-serif",
    fontWeight: '600',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#6b7280',
    backgroundColor: '#faf8f3',
    borderBottom: '2px solid rgba(212, 175, 55, 0.2)',
  },
  td: {
    padding: '1rem 1.5rem',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '0.875rem',
    color: '#374151',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
  },
  tr: {
    transition: 'background 0.2s ease',
  },
  trCurrentUser: {
    background: 'rgba(212, 175, 55, 0.08)',
  },
  currentUserBadge: {
    color: '#d4af37',
    fontSize: '0.7rem',
    fontWeight: '600',
    marginLeft: '0.5rem',
  },
  roleAdmin: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    color: '#b49450',
    padding: '0.25rem 0.75rem',
    borderRadius: '50px',
    fontSize: '0.7rem',
    fontWeight: '600',
    display: 'inline-block',
  },
  roleUser: {
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    color: '#6b7280',
    padding: '0.25rem 0.75rem',
    borderRadius: '50px',
    fontSize: '0.7rem',
    fontWeight: '600',
    display: 'inline-block',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem',
    gap: '1rem',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(212, 175, 55, 0.2)',
    borderTop: '3px solid #d4af37',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: '0.875rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem',
    color: '#6b7280',
  },
  emptyIcon: {
    fontSize: '3rem',
    display: 'block',
    marginBottom: '1rem',
  },
};

// Agregar keyframes y hover effects
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .dish-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 30px 45px -20px rgba(212, 175, 55, 0.25);
    border-color: rgba(212, 175, 55, 0.4);
  }
  
  .dish-card:hover img {
    transform: scale(1.08);
  }
  
  .dish-card:hover .order-hint {
    color: #d4af37;
    border-color: #d4af37;
  }
  
  input:focus {
    border-color: #d4af37;
    box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
  }
`;
document.head.appendChild(styleSheet);

export default DashboardPage;