const API_URL = 'http://localhost:3000';

// Helper para hacer requests
const request = async (endpoint, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en la petición');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ==================== AUTH ====================
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

// ==================== CLIENTES ====================
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

// ==================== EXTINTORES ====================
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

// ==================== RECARGAS ====================
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

// ==================== INVENTARIO ====================
export const inventarioAPI = {
  // Productos
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

  // Compras
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

// ==================== COMPROBANTES ====================
export const comprobantesAPI = {
  getAll: () => request('/comprobantes'),
  getById: (id) => request(`/comprobantes/${id}`),
  getByCliente: (clienteId) => request(`/comprobantes/client/${clienteId}`),
  getPDF: (id) => request(`/comprobantes/${id}/pdf`),
  create: (data) => request('/comprobantes', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  anular: (id) => request(`/comprobantes/${id}/anular`, {
    method: 'PATCH',
  }),
  delete: (id) => request(`/comprobantes/${id}`, {
    method: 'DELETE',
  }),
};

// ==================== DASHBOARD ====================
export const dashboardAPI = {
  getStats: async () => {
    try {
      // Obtener estadísticas de múltiples endpoints
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
        extintoresVencidos: 0, // Calcular desde extintores
        proximosVencer: 0, // Calcular desde extintores expiring
        ingresosMes: recargas.ingresosMes || 0,
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  },
};