import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email: form.email, password: form.password });
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__bg" />
      <div className="auth-page__glow auth-page__glow--left" />
      <div className="auth-page__glow auth-page__glow--right" />

      <div className="container auth-container auth-container--centered">
        <motion.div
          className="auth-form-wrap auth-form-wrap--standalone"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <div className="auth-login-logo">
            <img src="/images/moh/mtf-logo.png" alt="Moh Tee Flair Logo" style={{ height: '60px', width: 'max-content', margin: '0 auto' }} />
          </div>

          <div className="auth-form-header">
            <Sparkles size={20} color="var(--rg-gold)" />
            <h1 className="heading-md">Welcome Back</h1>
            <p className="auth-form-header__sub">Sign in to your luxury beauty account</p>
          </div>

          {error && (
            <div className="auth-error" role="alert">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" id="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <input id="login-email" name="email" type="email" className="form-input" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className="auth-input-wrap">
                <input
                  id="login-password" name="password"
                  type={showPwd ? 'text' : 'password'}
                  className="form-input" placeholder="Your password"
                  value={form.password} onChange={handleChange} required
                />
                <button type="button" className="auth-eye" onClick={() => setShowPwd(v => !v)} tabIndex={-1}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full auth-submit" id="login-submit" disabled={loading}>
              {loading ? <><span className="contact-form__spinner" /> Signing in...</> : <>Sign In <ArrowRight size={15} /></>}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/signup" id="login-to-signup">Create one here</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
