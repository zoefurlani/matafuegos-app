import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Credenciales hardcodeadas (temporal - después usaremos base de datos)
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'ZDMatafuegos2024!' // Cambiá esto por algo más seguro
  };

  useEffect(() => {
    // Verificar si hay sesión guardada
    const savedUser = sessionStorage.getItem('adminUser'); // Uso sessionStorage en vez de localStorage para más seguridad
    const loginTime = sessionStorage.getItem('loginTime');
    
    if (savedUser && loginTime) {
      // Verificar que no hayan pasado más de 8 horas
      const now = new Date().getTime();
      const elapsed = now - parseInt(loginTime);
      const EIGHT_HOURS = 8 * 60 * 60 * 1000;
      
      if (elapsed < EIGHT_HOURS) {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } else {
        // Sesión expirada
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    if (username === ADMIN_CREDENTIALS.username && 
        password === ADMIN_CREDENTIALS.password) {
      const userData = { 
        username, 
        role: 'admin',
        loginTime: new Date().toISOString()
      };
      setUser(userData);
      setIsAuthenticated(true);
      sessionStorage.setItem('adminUser', JSON.stringify(userData));
      sessionStorage.setItem('loginTime', new Date().getTime().toString());
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminUser');
    sessionStorage.removeItem('loginTime');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}