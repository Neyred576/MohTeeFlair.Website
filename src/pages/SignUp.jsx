import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const perks = ['Exclusive member offers', 'Early access to new products', 'Beauty tips & tutorials', 'Order tracking & history'];

export default function SignUp() {
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await signUp({ name: form.name, email: form.email, password: form.password });
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__bg auth-page__bg--signup" />
      <div className="auth-page__glow auth-page__glow--left" />
      <div className="auth-page__glow auth-page__glow--right" />

      <div className="container auth-container">
        {/* Left Panel */}
        <motion.div
          className="auth-panel auth-panel--left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="auth-panel__logo">
            <img src="/images/moh/mtf-logo.png" alt="Moh Tee Flair Logo" style={{ height: '100px', width: 'fit-content' }} />
          </div>
          <h2 className="heading-lg auth-panel__headline">
            Join the World of<br /><span className="gradient-text">Luxury Beauty</span>
          </h2>
          <p className="auth-panel__sub">
            Become a Moh Tee Flair member and unlock a world of exclusive benefits crafted for the discerning beauty lover.
          </p>
          <ul className="auth-panel__perks">
            {perks.map(p => (
              <li key={p}>
                <CheckCircle size={16} color="var(--rg-gold)" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <img
            src="/images/products/skincare/MTF Body Oil.png"
            alt="MTF Body Oil"
            className="auth-panel__product-img"
          />
        </motion.div>

        {/* Right: Form */}
        <motion.div
          className="auth-form-wrap"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="auth-form-header">
            <Sparkles size={20} color="var(--rg-gold)" />
            <h1 className="heading-md">Create Your Account</h1>
            <p className="auth-form-header__sub">Join thousands of beauty lovers</p>
          </div>

          {error && (
            <div className="auth-error" role="alert">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" id="signup-form">
            <div className="form-group">
              <label className="form-label" htmlFor="signup-name">Full Name</label>
              <input id="signup-name" name="name" type="text" className="form-input" placeholder="Your full name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-email">Email Address</label>
              <input id="signup-email" name="email" type="email" className="form-input" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-password">Password</label>
              <div className="auth-input-wrap">
                <input
                  id="signup-password" name="password"
                  type={showPwd ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Min. 6 characters"
                  value={form.password} onChange={handleChange} required
                />
                <button type="button" className="auth-eye" onClick={() => setShowPwd(v => !v)} tabIndex={-1}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-confirm">Confirm Password</label>
              <input id="signup-confirm" name="confirm" type="password" className="form-input" placeholder="Repeat your password" value={form.confirm} onChange={handleChange} required />
            </div>

            <button type="submit" className="btn btn-primary w-full auth-submit" id="signup-submit" disabled={loading}>
              {loading ? <><span className="contact-form__spinner" /> Creating Account...</> : <>Create Account <ArrowRight size={15} /></>}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login" id="signup-to-login">Sign in here</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
