import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/beauty-tips', label: 'Beauty Tips' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { itemCount, setCartOpen } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
          <img src="/images/moh/mtf-logo.png" alt="Moh Tee Flair Logo" style={{ height: '40px', width: 'auto' }} />
        </Link>

        {/* Desktop Links */}
        <ul className="navbar__links">
          {navLinks.map(l => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="navbar__actions">
          {/* Cart */}
          <button
            className="navbar__icon-btn"
            id="nav-cart-btn"
            onClick={() => setCartOpen(true)}
            aria-label="Open cart"
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && <span className="navbar__badge">{itemCount}</span>}
          </button>

          {/* User */}
          {user ? (
            <div className="navbar__user-wrap">
              <button
                className="navbar__icon-btn"
                onClick={() => setUserMenuOpen(o => !o)}
                id="nav-user-btn"
                aria-label="User menu"
              >
                <User size={20} />
              </button>
              {userMenuOpen && (
                <div className="navbar__user-dropdown">
                  <p className="navbar__user-name">Hello, {user.name.split(' ')[0]} ✨</p>
                  <button className="navbar__user-logout" onClick={handleLogout}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/signup" className="btn btn-primary navbar__signup-btn" id="nav-signup-btn">
              Sign Up
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            id="nav-hamburger"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}>
        {navLinks.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) => `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {l.label}
          </NavLink>
        ))}
        {!user && (
          <Link
            to="/signup"
            className="btn btn-primary navbar__mobile-signup"
            onClick={() => setMenuOpen(false)}
          >
            Sign Up
          </Link>
        )}
        {user && (
          <button className="navbar__mobile-logout" onClick={() => { handleLogout(); setMenuOpen(false); }}>
            <LogOut size={14} /> Sign Out
          </button>
        )}
      </div>
    </nav>
  );
}
