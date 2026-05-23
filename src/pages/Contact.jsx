import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import './Contact.css';

const contactInfo = [
  { icon: <Mail size={20} />,    label: 'Email Us',    value: 'mohteeflair@gmail.com',  href:'mailto:mohteeflair@gmail.com' },
  { icon: <Phone size={20} />,   label: 'Call Us (KE)',value: '+254 799 365 118',       href:'tel:+254799365118' },
  { icon: <Phone size={20} />,   label: 'Call Us (UAE)',value: '+971 526 413 089',      href:'tel:+971526413089' },
  { icon: <Clock size={20} />,   label: 'Hours',       value: 'Always Open', href:null },
];

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header__glow" />
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="section-label">Get In Touch</span>
            <h1 className="heading-xl gradient-text">Contact Us</h1>
            <p className="page-header__sub">We would love to hear from you. Our team responds within 24 hours.</p>
          </motion.div>
        </div>
      </div>

      <div className="container">
        <div className="contact-grid">
          {/* Info Panel */}
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-md mb-6">Let's Connect</h2>
            <p className="contact-info__sub">
              Whether you have questions about a product, need beauty advice, or want to collaborate with us — we're here and happy to help.
            </p>

            <div className="contact-cards">
              {contactInfo.map((c, i) => (
                <motion.div
                  key={c.label}
                  className="contact-card card-glass"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <div className="contact-card__icon">{c.icon}</div>
                  <div>
                    <p className="contact-card__label">{c.label}</p>
                    {c.href ? (
                      <a href={c.href} className="contact-card__value">{c.value}</a>
                    ) : (
                      <p className="contact-card__value">{c.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social */}
            <div className="contact-social">
              <p className="contact-social__label">Follow Our Journey</p>
              <div className="contact-social__icons">
                <a href="https://www.instagram.com/mohtee_flair/" className="footer__social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">IG</a>
                <a href="https://www.facebook.com/MohTeeflair" className="footer__social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">FB</a>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="contact-map">
              <div className="contact-map__inner">
                <MapPin size={28} color="var(--rg-gold)" />
                <p>Dubai</p>
                <span>East Africa's premier luxury beauty destination</span>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            className="contact-form-wrap"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {submitted ? (
              <div className="contact-success">
                <div className="contact-success__icon">
                  <Send size={28} />
                </div>
                <h3 className="heading-md gradient-text">Message Sent!</h3>
                <p>Thank you for reaching out. We will get back to you within 24 hours.</p>
                <button className="btn btn-outline mt-6" onClick={() => { setSubmitted(false); setForm({ name:'', email:'', subject:'', message:'' }); }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} id="contact-form">
                <h2 className="heading-md mb-6">Send a Message</h2>
                <div className="contact-form__row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-name">Full Name</label>
                    <input id="contact-name" name="name" type="text" className="form-input" placeholder="Your full name" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-email">Email Address</label>
                    <input id="contact-email" name="email" type="email" className="form-input" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-subject">Subject</label>
                  <input id="contact-subject" name="subject" type="text" className="form-input" placeholder="How can we help?" value={form.subject} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-message">Message</label>
                  <textarea id="contact-message" name="message" className="form-input form-textarea" placeholder="Tell us more..." value={form.message} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary w-full" id="contact-submit" disabled={loading}>
                  {loading ? (
                    <span className="contact-form__loading">
                      <span className="contact-form__spinner" /> Sending...
                    </span>
                  ) : (
                    <><Send size={15} /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
