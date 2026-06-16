import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart, Lock } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="footer">
      <div className="footer__glow" />
      <div className="container">
        {/* Top Grid */}
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <img src="/images/moh/mtf-logo.png" alt="Moh Tee Flair Logo" style={{ height: '100px', width: 'auto', objectFit: 'contain' }} />
            </div>
            <p className="footer__tagline">
              Luxury beauty for the bold and refined. Every product crafted to make you feel extraordinary.
            </p>
            <div className="footer__social">
              <a href="https://www.instagram.com/mohtee_flair/" className="footer__social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">IG</a>
              <a href="https://www.facebook.com/MohTeeflair" className="footer__social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">FB</a>
              <a href="mailto:mohteeflair@gmail.com" className="footer__social-link" aria-label="Email"><Mail size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h4 className="footer__col-title">Explore</h4>
            <ul className="footer__col-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/beauty-tips">Beauty Tips</Link></li>
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer__col">
            <h4 className="footer__col-title">Categories</h4>
            <ul className="footer__col-links">
              <li><Link to="/products?cat=lips">Lips</Link></li>
              <li><Link to="/products?cat=face">Face</Link></li>
              <li><Link to="/products?cat=tools">Makeup Tools</Link></li>
              <li><Link to="/products?cat=sponges">Sponges</Link></li>
              <li><Link to="/products?cat=skincare">Skin Care</Link></li>
              <li><Link to="/products?cat=bags">Bags</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4 className="footer__col-title">Get In Touch</h4>
            <ul className="footer__contact-list">
              <li>
                <Mail size={14} />
                <a href="mailto:mohteeflair@gmail.com">mohteeflair@gmail.com</a>
              </li>
              <li>
                <Phone size={14} />
                <div style={{display:'flex', flexDirection:'column'}}>
                  <a href="tel:+254799365118">+254 799 365 118</a>
                  <a href="tel:+971526413089">+971 526 413 089</a>
                </div>
              </li>
              <li>
                <MapPin size={14} />
                <span>Dubai</span>
              </li>
            </ul>
            {/* Newsletter */}
            <div className="footer__newsletter">
              <p className="footer__newsletter-label">Stay in the loop</p>
              <form className="footer__newsletter-form" onSubmit={e => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="footer__newsletter-input"
                  id="footer-newsletter-email"
                />
                <button type="submit" className="footer__newsletter-btn">→</button>
              </form>
            </div>
          </div>
        </div>

        {/* Gold Divider */}
        <div className="gold-line" />

        {/* Bottom */}
        <div className="footer__bottom">
          <p style={{ display: 'flex', alignItems: 'center', justifySelf: 'center', gap: '4px' }}>
            © {new Date().getFullYear()} Moh Tee Flair. All rights reserved.
            <Lock 
              size={8} 
              className="footer__admin-lock"
              onClick={() => navigate('/admin')} 
              aria-label="Admin Access"
            />
          </p>
          <p className="footer__bottom-love">
            Made With MTF
          </p>
        </div>
      </div>
    </footer>
  );
}
