import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { setCookie } from '../../utils/cookieUtils';
import './Login.css';

const GATEWAY_URL = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => setMounted(true), []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Gọi API login trên Eureka Server → lấy access token
      const loginRes = await fetch(`${GATEWAY_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!loginRes.ok) {
        const errData = await loginRes.json().catch(() => null);
        throw new Error(errData?.message || 'Invalid email or password');
      }

      const loginData = await loginRes.json();
      const token = loginData.result?.accessToken;

      if (!token) throw new Error('Unable to retrieve token from server');

      // 2. Lưu token vào cookie
      setCookie('access_token', token, 7);
      await fetch(`${GATEWAY_URL}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); 

      // 3. Gọi API /me trên Eureka Server (kèm token) → lấy role
      const meRes = await fetch(`${GATEWAY_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!meRes.ok) throw new Error('Unable to authenticate user');

      const user = await meRes.json();
      const userData = user.result || user;

      // 4. Kiểm tra roles array, tìm code === 'ADMIN'
      const isAdmin = userData.roles?.some(r => r.code === 'ADMIN');

      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/warehouse');
      }
    } catch (err) {
      setError(err.message);
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
