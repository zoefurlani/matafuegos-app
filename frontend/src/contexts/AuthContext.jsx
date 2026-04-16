import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';


const AuthContext = createContext();


export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // Verificar si hay sesión guardada
    const savedToken = sessionStorage.getItem('token');
    const savedUser = sessionStorage.getItem('user');
    const loginTime = sessionStorage.getItem('loginTime');
    
    if (savedToken && savedUser && loginTime) {
      // Verificar que no hayan pasado más de 8 horas
      const now = new Date().getTime();
      const elapsed = now - parseInt(loginTime);
      const EIGHT_HOURS = 8 * 60 * 60 * 1000;
      
      if (elapsed < EIGHT_HOURS) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } else {
        logout();
      }
    }
    setLoading(false);
  }, []);


  const login = async (email, password) => {
    try {
      // Llamar al endpoint real de login
      const response = await authAPI.login({ email, password });
      
      console.log('Login response:', response);
      
      // ⭐ CORREGIDO: El backend devuelve { access_token, usuario: { email, username, rol } }
      const access_token = response.access_token;
      const userData = {
        id: response.usuario?.id,
        email: response.usuario?.email || email,
        username: response.usuario?.username || 'admin',
        rol: response.usuario?.rol || 'usuario' // ⭐ CORREGIDO: response.usuario.rol
      };
      
      if (!access_token) {
        console.error('No se recibió access_token:', response);
        throw new Error('No se recibió token de autenticación');
      }
      
      console.log('Token recibido:', access_token);
      console.log('Usuario con rol:', userData);
      
      // Guardar en estado
      setToken(access_token);
      setUser(userData);
      setIsAuthenticated(true);
      
      // Guardar en sessionStorage
      sessionStorage.setItem('token', access_token);
      sessionStorage.setItem('user', JSON.stringify(userData));
      sessionStorage.setItem('loginTime', new Date().getTime().toString());
      
      console.log('Token guardado en sessionStorage:', sessionStorage.getItem('token'));
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };


  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('loginTime');
  };


  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user,
      token,
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