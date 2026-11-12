import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "bc25a509-c086-4586-bc36-2a8d14a15dfd",
          subject: "New Newsletter Subscriber",
          email: email,
          message: `You have a new subscriber to the newsletter: ${email}`
        }),
      });
      
      const result = await response.json();
      if (result.success) {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };
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
              <form className="footer__newsletter-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="footer__newsletter-input"
                  id="footer-newsletter-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading' || status === 'success'}
                  required
                />
                <button 
                  type="submit" 
                  className="footer__newsletter-btn"
                  disabled={status === 'loading' || status === 'success'}
                  style={{
                    backgroundColor: status === 'success' ? '#10B981' : status === 'error' ? '#EF4444' : undefined,
                    color: (status === 'success' || status === 'error') ? '#fff' : undefined
                  }}
                >
                  {status === 'loading' ? '...' : status === 'success' ? '✓' : status === 'error' ? '!' : '→'}
                </button>
              </form>
              {status === 'success' && <p style={{ color: '#10B981', fontSize: '0.75rem', marginTop: '0.5rem' }}>Subscribed successfully!</p>}
              {status === 'error' && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.5rem' }}>Something went wrong. Try again.</p>}
            </div>
          </div>
        </div>

        {/* Gold Divider */}
        <div className="gold-line" />

        {/* Bottom */}
        <div className="footer__bottom">
          <p>
            © {new Date().getFullYear()} Moh Tee Flair. All rights reserved.
          </p>
          <p className="footer__bottom-love">
            Made With MTF
          </p>
        </div>
      </div>
    </footer>
  );
}
