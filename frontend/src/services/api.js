const API_URL = 'http://localhost:3000/api';

// para obtener token del sessionstorage
const getToken = () => {
  return sessionStorage.getItem('token');
};

// para headers con autenticación
const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// para requests con token jwt
const request = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        sessionStorage.clear();
        window.location.href = '/';
        throw new Error('Sesión expirada');
      }
      
      const error = await response.json();
      throw new Error(error.message || 'Error en la petición');
    }

    const data = await response.json();
    
if (data && typeof data === 'object' && !Array.isArray(data)) {
  const keys = Object.keys(data);
  const arrayKeys = keys.filter(key => Array.isArray(data[key]));
  
  if (arrayKeys.length === 1 && keys.length <= 2) {
    return data[arrayKeys[0]];
  }
}

return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// auth
export const authAPI = {
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (data) => request('/auth/registro', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// clientes
export const clientesAPI = {
  getAll: () => request('/clients'),
  getById: (id) => request(`/clients/${id}`),
  search: (query) => request(`/clients/search?q=${query}`),
  create: (data) => request('/clients', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => request(`/clients/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (id) => request(`/clients/${id}`, {
    method: 'DELETE',
  }),
};

// extintores
export const extintoresAPI = {
  getAll: () => request('/extintores'),
  getById: (id) => request(`/extintores/${id}`),
  getByCliente: (clienteId) => request(`/extintores/client/${clienteId}`),
  getByNumero: (numeroEquipo) => request(`/extintores/numero/${numeroEquipo}`),
  getExpiring: () => request('/extintores/expiring'),
  create: (data) => request('/extintores', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => request(`/extintores/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (id) => request(`/extintores/${id}`, {
    method: 'DELETE',
  }),
};

// recargas
export const recargasAPI = {
  getAll: () => request('/recargas'),
  getById: (id) => request(`/recargas/${id}`),
  getByCliente: (clienteId) => request(`/recargas/client/${clienteId}`),
  getByExtintor: (extintorId) => request(`/recargas/extintor/${extintorId}`),
  getByDateRange: (startDate, endDate) => request(`/recargas/date-range?startDate=${startDate}&endDate=${endDate}`),
  getStats: () => request('/recargas/stats'),
  create: (data) => request('/recargas', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => request(`/recargas/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (id) => request(`/recargas/${id}`, {
    method: 'DELETE',
  }),
};

// intventario
export const inventarioAPI = {
 
  getAllProductos: () => request('/inventario/productos'),
  getProductoById: (id) => request(`/inventario/productos/${id}`),
  getProductosBajoStock: () => request('/inventario/productos/bajo-stock'),
  getProductosByCategoria: (categoria) => request(`/inventario/productos/categoria/${categoria}`),
  createProducto: (data) => request('/inventario/productos', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateProducto: (id, data) => request(`/inventario/productos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  deleteProducto: (id) => request(`/inventario/productos/${id}`, {
    method: 'DELETE',
  }),

  getAllCompras: () => request('/inventario/compras'),
  getCompraById: (id) => request(`/inventario/compras/${id}`),
  getComprasByProducto: (productoId) => request(`/inventario/compras/producto/${productoId}`),
  createCompra: (data) => request('/inventario/compras', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateCompra: (id, data) => request(`/inventario/compras/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  deleteCompra: (id) => request(`/inventario/compras/${id}`, {
    method: 'DELETE',
  }),

  // Stats
  getStats: () => request('/inventario/stats'),
};

// comprobantes
export const comprobantesAPI = {
  create: async (comprobanteData) => {
    return request('/comprobantes', {
      method: 'POST',
      body: JSON.stringify(comprobanteData),
    });
  },

  getAll: async () => {
    return request('/comprobantes');
  },

  getById: async (id) => {
    return request(`/comprobantes/${id}`);
  },

  getByNumero: async (numero) => {
    return request(`/comprobantes/numero/${numero}`);
  },

  getByCliente: async (nombreCliente) => {
    return request(`/comprobantes/cliente/${nombreCliente}`);
  },

  getByDateRange: async (startDate, endDate) => {
    return request(`/comprobantes/date-range?startDate=${startDate}&endDate=${endDate}`);
  },

  getStats: async () => {
    return request('/comprobantes/stats');
  },

  anular: async (id) => {
    return request(`/comprobantes/${id}/anular`, {
      method: 'PATCH',
    });
  },

  delete: async (id) => {
    return request(`/comprobantes/${id}`, {
      method: 'DELETE',
    });
  },
};

// dashboard
export const dashboardAPI = {
  getStats: async () => {
    try {
      const [clientes, extintores, recargas, inventario] = await Promise.all([
        request('/clients'),
        request('/extintores'),
        request('/recargas/stats'),
        request('/inventario/stats'),
      ]);

      return {
        totalClientes: clientes.length || 0,
        totalExtintores: extintores.length || 0,
        recargasMes: recargas.recargasMes || 0,
        stockBajo: inventario.productosBajoStock || 0,
        extintoresVencidos: 0,
        proximosVencer: 0,
        ingresosMes: recargas.ingresosMes || 0,
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  },
};

// usuarios
export const usuariosAPI = {
  getAllUsuarios: async () => {
    const response = await fetch(`${API_URL}/usuarios`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener usuarios');
    const data = await response.json();
    return data.usuarios;
  },

  getUsuario: async (id) => {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener usuario');
    return response.json();
  },

  createUsuario: async (usuarioData) => {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(usuarioData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear usuario');
    }
    return response.json();
  },

  updateUsuario: async (id, usuarioData) => {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(usuarioData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar usuario');
    }
    return response.json();
  },

  deleteUsuario: async (id, observacion) => {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: observacion ? JSON.stringify({ observacion }) : undefined,
    });
    if (!response.ok) throw new Error('Error al bloquear usuario');
    return response.json();
  },

  getLogs: async () => {
    const response = await fetch(`${API_URL}/usuarios/logs`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener logs');
    const data = await response.json();
    return data.logs;
  },

  // cambiar contraseña propia
  changePassword: async (currentPassword, newPassword) => {
    const response = await fetch(`${API_URL}/usuarios/cambiar-password`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al cambiar contraseña');
    }
    return response.json();
  },

  // admin cambia contraseña de otro usuario
  adminResetPassword: async (userId, newPassword) => {
    const response = await fetch(`${API_URL}/usuarios/${userId}/reset-password`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ newPassword }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al resetear contraseña');
    }
    return response.json();
  },
};

// ventas
export const ventasAPI = {
  create: async (ventaData) => {
    return request('/ventas', {
      method: 'POST',
      body: JSON.stringify(ventaData),
    });
  },

  getAll: async () => {
    return request('/ventas');
  },

  getById: async (id) => {
    return request(`/ventas/${id}`);
  },

  getByCliente: async (clienteId) => {
    return request(`/ventas/cliente/${clienteId}`);
  },

  getByDateRange: async (startDate, endDate) => {
    return request(`/ventas/date-range?startDate=${startDate}&endDate=${endDate}`);
  },

  getStats: async () => {
    return request('/ventas/stats');
  },

  update: async (id, ventaData) => {
    return request(`/ventas/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(ventaData),
    });
  },

  delete: async (id) => {
    return request(`/ventas/${id}`, {
      method: 'DELETE',
    });
  },
};

// recursos educativos
export const recursosEducativosAPI = {
  create: async (recursoData) => {
    return request('/recursos-educativos', {
      method: 'POST',
      body: JSON.stringify(recursoData),
    });
  },
 
  getAll: async () => {
    return request('/recursos-educativos');
  },
 
  getById: async (id) => {
    return request(`/recursos-educativos/${id}`);
  },
 
  getStats: async () => {
    return request('/recursos-educativos/stats');
  },

  update: async (id, recursoData) => {
    return request(`/recursos-educativos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(recursoData),
    });
  },
 
  delete: async (id) => {
    return request(`/recursos-educativos/${id}`, {
      method: 'DELETE',
    });
  },
 
  // en parte publica
  // obtener los recursos publicos con los filtros
  getPublic: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.categoria) params.append('categoria', filters.categoria);
    if (filters.tipoFuego) params.append('tipoFuego', filters.tipoFuego);
    if (filters.tipoExtintor) params.append('tipoExtintor', filters.tipoExtintor);
    if (filters.capacidad) params.append('capacidad', filters.capacidad);
    if (filters.aplicacion) params.append('aplicacion', filters.aplicacion);
    if (filters.search) params.append('search', filters.search);
 
    const queryString = params.toString();
    return request(`/recursos-educativos/public${queryString ? '?' + queryString : ''}`);
  },
 
  getFilters: async () => {
    return request('/recursos-educativos/public/filters');
  },
 
  getPublicById: async (id) => {
    return request(`/recursos-educativos/public/${id}`);
  },
};

export default {
  authAPI,
  clientesAPI,
  extintoresAPI,
  recargasAPI,
  inventarioAPI,
  comprobantesAPI,
  recursosEducativosAPI,
  dashboardAPI,
  usuariosAPI,
  ventasAPI,
};