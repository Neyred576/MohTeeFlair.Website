import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, LogOut, Package, Bell, Plus, Pencil, Trash2, 
  X, Check, AlertTriangle, Send, Image, DollarSign,
  Tag, FileText, LayoutGrid, ChevronRight, Eye, EyeOff
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useNotifications } from '../context/NotificationContext';
import { categories } from '../data/products';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import './AdminDashboard.css';

const ADMIN_PASSWORD = 'Mohteeflair@090021';

// ─── Password Gate ─────────────────────────────────────────────────────────────
function PasswordGate({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('mtf-admin', 'true');
      onSuccess();
    } else {
      setError('Incorrect password. Please try again.');
      setShaking(true);
      setPassword('');
      setTimeout(() => setShaking(false), 600);
    }
  };

  return (
    <div className="admin-gate">
      <div className="admin-gate__glow" />
      <motion.div
        className={`admin-gate__card ${shaking ? 'admin-gate__card--shake' : ''}`}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="admin-gate__icon-wrap">
          <Lock size={28} />
        </div>
        <h1 className="admin-gate__title">Admin Access</h1>
        <p className="admin-gate__sub">Enter your password to continue</p>

        <form onSubmit={handleSubmit} className="admin-gate__form">
          <div className="admin-gate__input-wrap">
            <input
              ref={inputRef}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="Password"
              className="admin-gate__input"
              id="admin-password-input"
            />
            <button
              type="button"
              className="admin-gate__toggle"
              onClick={() => setShowPassword(v => !v)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {error && (
            <motion.p
              className="admin-gate__error"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertTriangle size={13} /> {error}
            </motion.p>
          )}
          <button type="submit" className="admin-gate__btn" id="admin-login-btn">
            Unlock Dashboard
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Product Form Modal ─────────────────────────────────────────────────────────
function ProductModal({ product, onClose, onSave }) {
  const isEdit = !!product;
  const [form, setForm] = useState(product || {
    name: '', price: '', category: 'lips', img: '', desc: '', featured: false
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ ...form, price: parseFloat(form.price) || 0 });
      setSaved(true);
      setTimeout(onClose, 800);
    } catch (err) {
      setSaving(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div
        className="admin-modal"
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.3 }}
      >
        <div className="admin-modal__header">
          <h2>{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="admin-modal__close" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal__form">
          <div className="admin-form-row">
            <div className="admin-form-field">
              <label><Tag size={13} /> Product Name</label>
              <input required value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="MTF Product Name" />
            </div>
            <div className="admin-form-field">
              <label><DollarSign size={13} /> Price (AED)</label>
              <input required type="number" step="0.01" value={form.price} onChange={e => handleChange('price', e.target.value)} placeholder="0.00" />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-field">
              <label><LayoutGrid size={13} /> Category</label>
              <select value={form.category} onChange={e => handleChange('category', e.target.value)}>
                {categories.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="admin-form-field admin-form-field--check">
              <label><Check size={13} /> Featured Product</label>
              <label className="admin-toggle">
                <input type="checkbox" checked={form.featured} onChange={e => handleChange('featured', e.target.checked)} />
                <span className="admin-toggle__track" />
              </label>
            </div>
          </div>

          <div className="admin-form-field">
            <label><Image size={13} /> Image Path</label>
            <input value={form.img} onChange={e => handleChange('img', e.target.value)} placeholder="/images/products/category/filename.png" />
          </div>

          <div className="admin-form-field">
            <label><FileText size={13} /> Description</label>
            <textarea rows={3} value={form.desc} onChange={e => handleChange('desc', e.target.value)} placeholder="Product description..." />
          </div>

          <button type="submit" className="admin-form-submit" disabled={saving}>
            {saved ? <><Check size={16} /> Saved!</> : saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Product'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Delete Confirm Modal ────────────────────────────────────────────────────────
function DeleteModal({ product, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);
  return (
    <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div
        className="admin-modal admin-modal--sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="admin-modal__header">
          <h2>Delete Product</h2>
          <button className="admin-modal__close" onClick={onClose}><X size={18} /></button>
        </div>
        <div style={{ padding: '0 0 20px' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
            Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>{product.name}</strong>? This cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="admin-btn admin-btn--ghost" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
            <button
              className="admin-btn admin-btn--danger"
              style={{ flex: 1 }}
              disabled={deleting}
              onClick={async () => { setDeleting(true); await onConfirm(); onClose(); }}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Dashboard ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('mtf-admin') === 'true');
  const [tab, setTab] = useState('products');
  const [editProduct, setEditProduct] = useState(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [notification, setNotification] = useState('');
  const [notifStatus, setNotifStatus] = useState('idle'); // idle | sending | sent

  const { products, loading, addProduct, updateProduct, removeProduct } = useProducts();
  const { sendNotification } = useNotifications();

  const handleLogout = () => {
    sessionStorage.removeItem('mtf-admin');
    setAuthed(false);
  };

  const filteredProducts = (products || []).filter(p => {
    const matchesCat = catFilter === 'all' || p.category === catFilter;
    const matchesSearch = !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSendNotification = async () => {
    if (!notification.trim()) return;
    setNotifStatus('sending');
    try {
      // 1. Save in-app notification to Firestore (banner)
      await sendNotification(notification.trim());

      // 2. Fetch all push subscriptions and send OS-level push notifications
      try {
        const subsSnapshot = await getDocs(collection(db, 'pushSubscriptions'));
        const subscriptions = subsSnapshot.docs.map(doc => doc.data());

        if (subscriptions.length > 0) {
          await fetch('/.netlify/functions/send-push', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              subscriptions,
              title: 'Moh Tee Flair ✨',
              message: notification.trim()
            })
          });
          console.log(`[Push] Sent to ${subscriptions.length} subscribers`);
        }
      } catch (pushErr) {
        console.warn('[Push] Push sending failed (in-app still sent):', pushErr);
      }

      setNotifStatus('sent');
      setNotification('');
      setTimeout(() => setNotifStatus('idle'), 3000);
    } catch (e) {
      console.error('Notification error:', e);
      setNotifStatus('idle');
    }
  };

  if (!authed) return <PasswordGate onSuccess={() => setAuthed(true)} />;

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <img src="/images/moh/mtf-logo.png" alt="MTF" style={{ height: 50, objectFit: 'contain' }} />
          <span className="admin-sidebar__label">Admin Panel</span>
        </div>
        <nav className="admin-sidebar__nav">
          <button
            className={`admin-nav-btn ${tab === 'products' ? 'admin-nav-btn--active' : ''}`}
            onClick={() => setTab('products')}
          >
            <Package size={18} /> Products
            {tab === 'products' && <ChevronRight size={14} className="admin-nav-arrow" />}
          </button>
          <button
            className={`admin-nav-btn ${tab === 'notifications' ? 'admin-nav-btn--active' : ''}`}
            onClick={() => setTab('notifications')}
          >
            <Bell size={18} /> Notifications
            {tab === 'notifications' && <ChevronRight size={14} className="admin-nav-arrow" />}
          </button>
        </nav>
        <button className="admin-logout-btn" onClick={handleLogout}>
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-main__glow" />

        <AnimatePresence mode="wait">
          {/* ── Products Tab ── */}
          {tab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="admin-page-header">
                <div>
                  <h1 className="admin-page-title">Products</h1>
                  <p className="admin-page-sub">{(products || []).length} total products in your store</p>
                </div>
                <button className="admin-btn admin-btn--primary" onClick={() => setAddingProduct(true)}>
                  <Plus size={16} /> Add Product
                </button>
              </div>

              {/* Filters */}
              <div className="admin-filters">
                <input
                  className="admin-search"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <select className="admin-cat-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>

              {/* Products Table */}
              {loading ? (
                <div className="admin-loading">Loading products...</div>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price (AED)</th>
                        <th>Featured</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {filteredProducts.map(p => (
                          <motion.tr
                            key={p.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            layout
                          >
                            <td>
                              <div className="admin-product-cell">
                                <img src={p.img} alt={p.name} className="admin-product-thumb" />
                                <div>
                                  <p className="admin-product-name">{p.name}</p>
                                  <p className="admin-product-desc">{p.desc?.substring(0, 50)}...</p>
                                </div>
                              </div>
                            </td>
                            <td><span className="admin-badge">{p.category}</span></td>
                            <td className="admin-price">{parseFloat(p.price).toFixed(2)}</td>
                            <td>
                              <span className={`admin-badge ${p.featured ? 'admin-badge--gold' : ''}`}>
                                {p.featured ? '★ Yes' : 'No'}
                              </span>
                            </td>
                            <td>
                              <div className="admin-actions">
                                <button
                                  className="admin-icon-btn admin-icon-btn--edit"
                                  onClick={() => setEditProduct(p)}
                                  title="Edit"
                                >
                                  <Pencil size={15} />
                                </button>
                                <button
                                  className="admin-icon-btn admin-icon-btn--delete"
                                  onClick={() => setDeleteTarget(p)}
                                  title="Delete"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                  {filteredProducts.length === 0 && (
                    <p className="admin-empty">No products found.</p>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* ── Notifications Tab ── */}
          {tab === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="admin-page-header">
                <div>
                  <h1 className="admin-page-title">Send Notification</h1>
                  <p className="admin-page-sub">Broadcast a message to all users instantly</p>
                </div>
              </div>

              <div className="admin-notif-card">
                <div className="admin-notif-card__glow" />
                <label className="admin-notif-label">
                  <Bell size={14} /> Message
                </label>
                <textarea
                  className="admin-notif-textarea"
                  rows={5}
                  value={notification}
                  onChange={e => setNotification(e.target.value)}
                  placeholder="Write your message here... e.g. '🎉 New arrivals just dropped! Shop now for exclusive deals.'"
                  maxLength={300}
                />
                <div className="admin-notif-footer">
                  <span className="admin-notif-count">{notification.length}/300</span>
                  <button
                    className={`admin-btn ${notifStatus === 'sent' ? 'admin-btn--success' : 'admin-btn--primary'}`}
                    onClick={handleSendNotification}
                    disabled={!notification.trim() || notifStatus === 'sending'}
                  >
                    {notifStatus === 'sending' && 'Sending...'}
                    {notifStatus === 'sent' && <><Check size={16} /> Sent to all users!</>}
                    {notifStatus === 'idle' && <><Send size={15} /> Send Notification</>}
                  </button>
                </div>

                <div className="admin-notif-preview">
                  <p className="admin-notif-preview__label">Preview</p>
                  <div className="admin-notif-preview__banner">
                    <Bell size={16} style={{ color: '#FFD700', flexShrink: 0 }} />
                    <p>{notification || 'Your message will appear here...'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {(editProduct || addingProduct) && (
          <ProductModal
            key="product-modal"
            product={editProduct}
            onClose={() => { setEditProduct(null); setAddingProduct(false); }}
            onSave={async (data) => {
              if (editProduct) {
                await updateProduct(editProduct.id, data);
              } else {
                await addProduct(data);
              }
              setEditProduct(null);
              setAddingProduct(false);
            }}
          />
        )}
        {deleteTarget && (
          <DeleteModal
            key="delete-modal"
            product={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={() => removeProduct(deleteTarget.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
