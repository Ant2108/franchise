import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { setCookie, setUserRoles } from '../../utils/cookieUtils';
import apiClient from '../../services/axiosClient';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loginData = await apiClient.post('/auth/login', { email, password });
      const { accessToken, refreshToken } = loginData.result || loginData;
      
      if (!accessToken) throw new Error('Unable to retrieve token from server');

      setCookie('access_token', accessToken, 7);
      if (refreshToken) {
        setCookie('refresh_token', refreshToken, 7);
      }

      const userData = await apiClient.get('/auth/me');
      const user = userData.result || userData;

      const isAdmin = user.roles?.some(r => r.code === 'ADMIN');
      const isWarehouseManager = user.roles?.some(r => r.code === 'WAREHOUSE_MANAGER');

      setUserRoles(user.roles || []);

     if (isAdmin) {
      navigate('/admin');

    } else if (isWarehouseManager) {
        try {
          const warehouseRes = await apiClient.get(`/warehouses/by-manager/${user.id}`);
          const warehouse = warehouseRes.result || warehouseRes;

          if (!warehouse || !warehouse.id) {
            throw new Error("No warehouse assigned to this manager");
          }
          
          // Save warehouse ID to Cookies for the axios interceptor
          setCookie('warehouse_id', warehouse.id, 7);
          
          navigate(`/warehouse/${warehouse.id}`);

        } catch (err) {
          navigate('/no-warehouse');
        }
    } else {
      navigate('/');
    }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <img
        className="login-bg"
        src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1920&q=80"
        alt=""
      />
      <div className="login-overlay" />

      <motion.div 
        className="login-card"
        initial={{ opacity: 0, y: 30 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="login-glow" />

        <div className="login-header">
          <motion.div
            className="login-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={mounted ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            ☕ FRANCHISECHAIN
          </motion.div>
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to continue managing the system</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="login-field">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required 
            />
          </div>

          <div className="login-field">
            <div className="login-field-header">
              <label>Password</label>
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required 
            />
          </div>

          <motion.button 
            whileHover={!loading ? { translateY: -2 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            type="submit"
            className={`login-submit ${loading ? 'login-submit-loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>

        <button className="login-back" onClick={() => navigate('/')}>
          &larr; Back to Home
        </button>
      </motion.div>
    </div>
  );
};

export default Login;
