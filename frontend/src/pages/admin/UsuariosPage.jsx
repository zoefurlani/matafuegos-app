import { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, X, Shield, Activity, Eye, EyeOff, Key } from 'lucide-react';
import { usuariosAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

function UsuariosPage() {
  const toast = useToast();

  const [usuarios, setUsuarios] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('usuarios'); 
  const [showModal, setShowModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false); 
  const [editingUser, setEditingUser] = useState(null);
  const [resetPasswordUser, setResetPasswordUser] = useState(null);
  const [blockingUser, setBlockingUser] = useState(null); 
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [blockObservacion, setBlockObservacion] = useState(''); 

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    rol: 'usuario',
    estado: 'activo'
  });

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuariosAPI.getAllUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const data = await usuariosAPI.getLogs();
      setLogs(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar logs');
    }
  };

  const handleNuevoUsuario = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      rol: 'usuario',
      estado: 'activo'
    });
    setShowModal(true);
  };

  const handleEditarUsuario = (usuario) => {
    setEditingUser(usuario);
    setFormData({
      username: usuario.username,
      email: usuario.email,
      password: '', 
      rol: usuario.rol,
      estado: usuario.estado
    });
    setShowModal(true);
  };

  const handleResetPassword = (usuario) => {
    setResetPasswordUser(usuario);
    setNewPassword('');
    setShowResetPasswordModal(true);
  };

  const handleConfirmResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      await usuariosAPI.adminResetPassword(resetPasswordUser.id, newPassword);
      toast.success(`Contraseña de ${resetPasswordUser.username} reseteada correctamente`);
      setShowResetPasswordModal(false);
      setNewPassword('');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData };
      if (editingUser && !dataToSend.password) {
        delete dataToSend.password; 
      }

      if (editingUser) {
        await usuariosAPI.updateUsuario(editingUser.id, dataToSend);
        toast.success('Usuario actualizado correctamente');
      } else {
        await usuariosAPI.createUsuario(dataToSend);
        toast.success('Usuario creado correctamente');
      }
      
      setShowModal(false);
      fetchUsuarios();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEliminar = (usuario) => {
    setBlockingUser(usuario);
    setBlockObservacion('');
    setShowBlockModal(true);
  };

  const handleConfirmBlock = async () => {
    try {
      await usuariosAPI.deleteUsuario(blockingUser.id, blockObservacion);
      toast.success('Usuario bloqueado correctamente');
      setShowBlockModal(false);
      setBlockingUser(null);
      setBlockObservacion('');
      fetchUsuarios();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getRolBadge = (rol) => {
    const roles = {
      super_admin: { color: '#ef4444', bg: '#fee2e2', text: 'Super Admin' },
      admin: { color: '#f59e0b', bg: '#fef3c7', text: 'Admin' },
      usuario: { color: '#3b82f6', bg: '#dbeafe', text: 'Usuario' }
    };
    const info = roles[rol] || roles.usuario;
    return (
      <span style={{ 
        padding: '4px 12px', 
        backgroundColor: info.bg, 
        color: info.color, 
        borderRadius: '6px', 
        fontSize: '13px', 
        fontWeight: 'bold' 
      }}>
        {info.text}
      </span>
    );
  };

  const getEstadoBadge = (estado) => {
    const estados = {
      activo: { color: '#10b981', bg: '#d1fae5', text: 'Activo' },
      inactivo: { color: '#6b7280', bg: '#f3f4f6', text: 'Inactivo' },
      bloqueado: { color: '#ef4444', bg: '#fee2e2', text: 'Bloqueado' }
    };
    const info = estados[estado] || estados.activo;
    return (
      <span style={{ 
        padding: '4px 12px', 
        backgroundColor: info.bg, 
        color: info.color, 
        borderRadius: '6px', 
        fontSize: '13px', 
        fontWeight: 'bold' 
      }}>
        {info.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ width: '60px', height: '60px', border: '6px solid #e5e7eb', borderTop: '6px solid #ef4444', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Gestión de Usuarios</h1>
          <p style={{ fontSize: '16px', color: '#6b7280' }}>Administra usuarios y permisos del sistema</p>
        </div>
        <button
          onClick={handleNuevoUsuario}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
            backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px',
            fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(239,68,68,0.4)', transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#dc2626'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ef4444'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <Plus size={20} />
          Nuevo Usuario
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0', marginBottom: '24px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <button
          onClick={() => setActiveTab('usuarios')}
          style={{
            flex: 1, padding: '16px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold',
            backgroundColor: activeTab === 'usuarios' ? '#ef4444' : 'white',
            color: activeTab === 'usuarios' ? 'white' : '#6b7280',
            transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}
        >
          <Users size={18} />
          Usuarios
        </button>
        <button
          onClick={() => { setActiveTab('logs'); fetchLogs(); }}
          style={{
            flex: 1, padding: '16px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold',
            backgroundColor: activeTab === 'logs' ? '#ef4444' : 'white',
            color: activeTab === 'logs' ? 'white' : '#6b7280',
            transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}
        >
          <Activity size={18} />
          Logs de Actividad
        </button>
      </div>

      {activeTab === 'usuarios' && (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          {usuarios.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>
              <Users size={48} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
              <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>No hay usuarios</p>
              <p style={{ fontSize: '14px' }}>Crea el primer usuario del sistema</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={headerStyle}>Usuario</th>
                  <th style={headerStyle}>Email</th>
                  <th style={headerStyle}>Rol</th>
                  <th style={headerStyle}>Estado</th>
                  <th style={headerStyle}>Último Login</th>
                  <th style={headerStyle}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(usuario => (
                  <tr key={usuario.id} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background-color 0.2s ease' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <td style={cellStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', backgroundColor: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                          {usuario.username.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 'bold', color: '#111827' }}>{usuario.username}</span>
                      </div>
                    </td>
                    <td style={cellStyle}>
                      <span style={{ color: '#6b7280' }}>{usuario.email}</span>
                    </td>
                    <td style={cellStyle}>
                      {getRolBadge(usuario.rol)}
                    </td>
                    <td style={cellStyle}>
                      {getEstadoBadge(usuario.estado)}
                    </td>
                    <td style={cellStyle}>
                      <span style={{ color: '#6b7280', fontSize: '14px' }}>
                        {usuario.ultimoLogin ? new Date(usuario.ultimoLogin).toLocaleString('es-AR') : 'Nunca'}
                      </span>
                    </td>
                    <td style={cellStyle}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEditarUsuario(usuario)} style={{ padding: '8px', backgroundColor: '#dbeafe', border: 'none', borderRadius: '6px', cursor: 'pointer' }} title="Editar">
                          <Edit2 size={16} color="#3b82f6" />
                        </button>
                        <button onClick={() => handleResetPassword(usuario)} style={{ padding: '8px', backgroundColor: '#fef3c7', border: 'none', borderRadius: '6px', cursor: 'pointer' }} title="Resetear contraseña">
                          <Key size={16} color="#f59e0b" />
                        </button>
                        {usuario.rol !== 'super_admin' && (
                          <button onClick={() => handleEliminar(usuario)} style={{ padding: '8px', backgroundColor: '#fee2e2', border: 'none', borderRadius: '6px', cursor: 'pointer' }} title="Bloquear usuario">
                            <Trash2 size={16} color="#ef4444" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'logs' && (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#111827' }}>Últimas 100 actividades</h3>
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {logs.map(log => (
              <div key={log.id} style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
                    {log.usuario?.username || 'Sistema'} - {log.accion}
                  </p>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>{log.descripcion}</p>
                </div>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                  {new Date(log.fecha).toLocaleString('es-AR')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ef4444', color: 'white', borderRadius: '16px 16px 0 0' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                <p style={{ fontSize: '14px', margin: '4px 0 0 0', opacity: 0.9 }}>Completa los datos del usuario</p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ padding: '8px', backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '6px', cursor: 'pointer', color: 'white' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleGuardar} style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Nombre de usuario *</label>
                  <input type="text" required value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} style={inputStyle} placeholder="usuario123" />
                </div>

                <div>
                  <label style={labelStyle}>Email *</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={inputStyle} placeholder="usuario@ejemplo.com" />
                </div>

                {!editingUser && (
                  <div>
                    <label style={labelStyle}>Contraseña *</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        required
                        value={formData.password} 
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                        style={{ ...inputStyle, paddingRight: '48px' }} 
                        placeholder="Mínimo 8 caracteres" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                      >
                        {showPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label style={labelStyle}>Rol *</label>
                  <select required value={formData.rol} onChange={(e) => setFormData({ ...formData, rol: e.target.value })} style={inputStyle}>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Estado *</label>
                  <select required value={formData.estado} onChange={(e) => setFormData({ ...formData, estado: e.target.value })} style={inputStyle}>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="bloqueado">Bloqueado</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end', paddingTop: '20px', borderTop: '2px solid #e5e7eb' }}>
                <button type="button" onClick={() => setShowModal(false)} style={btnCancel}>Cancelar</button>
                <button type="submit" style={btnSubmit}>{editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showResetPasswordModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '450px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f59e0b', color: 'white', borderRadius: '16px 16px 0 0' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>Resetear Contraseña</h2>
                <p style={{ fontSize: '14px', margin: '4px 0 0 0', opacity: 0.9 }}>Usuario: {resetPasswordUser?.username}</p>
              </div>
              <button onClick={() => setShowResetPasswordModal(false)} style={{ padding: '8px', backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '6px', cursor: 'pointer', color: 'white' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleConfirmResetPassword} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Nueva Contraseña *</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showNewPassword ? 'text' : 'password'} 
                    required
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    style={{ ...inputStyle, paddingRight: '48px' }} 
                    placeholder="Mínimo 8 caracteres" 
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                  >
                    {showNewPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                  </button>
                </div>
                <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>
                  La contraseña debe tener al menos 8 caracteres
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '20px', borderTop: '2px solid #e5e7eb' }}>
                <button type="button" onClick={() => setShowResetPasswordModal(false)} style={btnCancel}>Cancelar</button>
                <button type="submit" style={{ ...btnSubmit, backgroundColor: '#f59e0b' }}>Resetear Contraseña</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBlockModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ef4444', color: 'white', borderRadius: '16px 16px 0 0' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>Bloquear Usuario</h2>
                <p style={{ fontSize: '14px', margin: '4px 0 0 0', opacity: 0.9 }}>Usuario: {blockingUser?.username}</p>
              </div>
              <button onClick={() => setShowBlockModal(false)} style={{ padding: '8px', backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '6px', cursor: 'pointer', color: 'white' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ padding: '16px', backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '12px', marginBottom: '24px' }}>
                <p style={{ fontSize: '14px', color: '#991b1b', margin: 0, lineHeight: '1.6' }}>
                  ⚠️ El usuario <strong>{blockingUser?.username}</strong> no podrá acceder al sistema. Todos sus registros y logs se mantendrán intactos.
                </p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Motivo del bloqueo (opcional)</label>
                <textarea
                  value={blockObservacion}
                  onChange={(e) => setBlockObservacion(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '15px',
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: '80px',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Ej: Inactividad prolongada"
                />
                <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>
                  Esta observación quedará registrada en el historial de logs
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '20px', borderTop: '2px solid #e5e7eb' }}>
                <button 
                  type="button" 
                  onClick={() => setShowBlockModal(false)} 
                  style={btnCancel}
                >
                  Cancelar
                </button>
                <button 
                  type="button"
                  onClick={handleConfirmBlock}
                  style={btnSubmit}
                >
                  Bloquear Usuario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const headerStyle = { padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' };
const cellStyle = { padding: '16px', fontSize: '14px' };
const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#374151' };
const inputStyle = { width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '16px', outline: 'none', transition: 'border-color 0.3s ease' };
const btnCancel = { padding: '12px 24px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', color: '#6b7280' };
const btnSubmit = { padding: '12px 24px', backgroundColor: '#ef4444', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', color: 'white', boxShadow: '0 4px 12px rgba(239,68,68,0.3)' };

export default UsuariosPage;