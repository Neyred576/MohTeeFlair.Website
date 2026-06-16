import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, LogOut, Package, Bell, Plus, Pencil, Trash2, 
  X, Check, AlertTriangle, Send, Image, DollarSign,
  Tag, FileText, LayoutGrid, ChevronRight, Eye, EyeOff,
  BarChart2, Users, Star, Zap, Calendar, ShoppingBag, Activity
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useNotifications } from '../context/NotificationContext';
import { useGlowAndSave } from '../context/GlowAndSaveContext';
import { categories } from '../data/products';
import { collection, getDocs, onSnapshot, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
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
    name: '', price: '', category: 'lips', img: '', desc: '', featured: false, comingSoon: false
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImg(true);
    setUploadProgress(20);

    const formData = new FormData();
    formData.append('image', file);

    // ImgBB API key
    const IMGBB_API_KEY = '682d8aa29a9ed8cb72d0b40fde7d6c2a';

    try {
      setUploadProgress(50);
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
      });

      setUploadProgress(80);
      const data = await response.json();

      if (data.success) {
        handleChange('img', data.data.url);
        setUploadProgress(100);
      } else {
        throw new Error(data.error?.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploadingImg(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        ...form,
        price: form.comingSoon ? 0 : (parseFloat(form.price) || 0),
        comingSoon: !!form.comingSoon
      });
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
              <label><DollarSign size={13} /> Price Setting</label>
              {/* Price mode toggle */}
              <div className="admin-price-toggle">
                <button
                  type="button"
                  className={`admin-price-mode-btn ${!form.comingSoon ? 'admin-price-mode-btn--active' : ''}`}
                  onClick={() => handleChange('comingSoon', false)}
                >
                  AED Price
                </button>
                <button
                  type="button"
                  className={`admin-price-mode-btn ${form.comingSoon ? 'admin-price-mode-btn--active' : ''}`}
                  onClick={() => handleChange('comingSoon', true)}
                >
                  Coming Soon
                </button>
              </div>
              {!form.comingSoon && (
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={e => handleChange('price', e.target.value)}
                  placeholder="0.00"
                  style={{ marginTop: 8 }}
                />
              )}
              {form.comingSoon && (
                <div className="admin-coming-soon-preview">Will display as "COMING SOON" on site</div>
              )}
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
            <label><Image size={13} /> Product Image</label>
            <div className="admin-image-upload-wrapper">
              {form.img && (
                <div style={{ marginBottom: 10 }}>
                  <img src={form.img} alt="Preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border-color)' }} />
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                disabled={uploadingImg}
                style={{ width: '100%', padding: '8px', border: '1px dashed var(--border-color)', borderRadius: '6px', background: 'var(--surface-color)', color: 'var(--text-primary)', cursor: 'pointer' }}
              />
              {uploadingImg && (
                <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                  Uploading: {Math.round(uploadProgress)}%
                </div>
              )}
            </div>
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
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    newUsersWeek: 0,
    newUsersMonth: 0,
    totalGuests: 0,
    activeUsers: 0,
    activeGuests: 0,
    graphData: []
  });
  const usersRef = useRef([]);
  const guestsRef = useRef([]);

  const { products, loading, addProduct, updateProduct, removeProduct } = useProducts();
  const { sendNotification, notifications, deleteNotification } = useNotifications();
  const {
    glowSettings, updateGlowSettings,
    vipSettings, updateVipSettings,
    campaigns, addCampaign, updateCampaign, deleteCampaign,
    bundles, addBundle, updateBundle, deleteBundle,
    addVipMember, removeVipMember,
  } = useGlowAndSave();

  const [newVipEmail, setNewVipEmail] = useState('');
  const [discountForm, setDiscountForm] = useState({ productId: '', discountPercent: '' });
  const [campaignForm, setCampaignForm] = useState({ name: '', timerLabel: '', targetDate: '', active: true, timerMode: 'toEnd' });
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [bundleForm, setBundleForm] = useState({ name: '', desc: '', img: '', originalPrice: '', discountPercent: '', finalPrice: '', active: true, vipOnly: false });
  const [showBundleForm, setShowBundleForm] = useState(false);
  const [editingBundle, setEditingBundle] = useState(null);
  const [uploadingBundleImg, setUploadingBundleImg] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  useEffect(() => {
    if (authed) {
      const activeThreshold = 5 * 60 * 1000; // 5 mins

      const recalcStats = () => {
        const users = usersRef.current;
        const guests = guestsRef.current;
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).getTime();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        
        let today = 0, week = 0, month = 0, activeU = 0, activeG = 0;
        
        const last7Days = Array.from({length: 7}).map((_, i) => {
          const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - i));
          return { label: d.toLocaleDateString('en-US', { weekday: 'short' }), dateStr: d.toDateString(), count: 0 };
        });

        users.forEach(u => {
          if (u.createdAt) {
            const createdAtTime = new Date(u.createdAt).getTime();
            if (createdAtTime >= startOfDay) today++;
            if (createdAtTime >= startOfWeek) week++;
            if (createdAtTime >= startOfMonth) month++;
            
            const uDateStr = new Date(createdAtTime).toDateString();
            const dayBin = last7Days.find(d => d.dateStr === uDateStr);
            if (dayBin) dayBin.count++;
          }
          if (u.lastActive && (Date.now() - new Date(u.lastActive).getTime() <= activeThreshold)) {
            activeU++;
          }
        });

        guests.forEach(g => {
          const lastActivity = g.lastActive || g.lastVisited;
          if (lastActivity && (Date.now() - new Date(lastActivity).getTime() <= activeThreshold)) {
            activeG++;
          }
        });

        setStats({
          totalUsers: users.length,
          newUsersToday: today,
          newUsersWeek: week,
          newUsersMonth: month,
          totalGuests: guests.length,
          activeUsers: activeU,
          activeGuests: activeG,
          graphData: last7Days
        });
      };

      const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
        usersRef.current = snap.docs.map(d => d.data());
        recalcStats();
      });
      
      const unsubGuests = onSnapshot(collection(db, 'guests'), (snap) => {
        guestsRef.current = snap.docs.map(d => d.data());
        recalcStats();
      });
      
      const interval = setInterval(recalcStats, 30000); // 30s
      return () => { unsubUsers(); unsubGuests(); clearInterval(interval); };
    }
  }, [authed]);

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
            className={`admin-nav-btn ${tab === 'analytics' ? 'admin-nav-btn--active' : ''}`}
            onClick={() => setTab('analytics')}
          >
            <BarChart2 size={18} /> Analytics
            {tab === 'analytics' && <ChevronRight size={14} className="admin-nav-arrow" />}
          </button>
          <button
            className={`admin-nav-btn ${tab === 'glow' ? 'admin-nav-btn--active' : ''}`}
            onClick={() => setTab('glow')}
          >
            <Star size={18} /> Glow & Save
            {tab === 'glow' && <ChevronRight size={14} className="admin-nav-arrow" />}
          </button>
          <button
            className={`admin-nav-btn ${tab === 'vip' ? 'admin-nav-btn--active' : ''}`}
            onClick={() => setTab('vip')}
          >
            <Zap size={18} /> VIP Access
            {tab === 'vip' && <ChevronRight size={14} className="admin-nav-arrow" />}
          </button>
          <button
            className={`admin-nav-btn ${tab === 'products' ? 'admin-nav-btn--active' : ''}`}
            onClick={() => setTab('products')}
          >
            <Package size={18} /> Products
            {tab === 'products' && <ChevronRight size={14} className="admin-nav-arrow" />}
          </button>
          <button
            className={`admin-nav-btn ${tab === 'campaigns' ? 'admin-nav-btn--active' : ''}`}
            onClick={() => setTab('campaigns')}
          >
            <Calendar size={18} /> Campaigns
            {tab === 'campaigns' && <ChevronRight size={14} className="admin-nav-arrow" />}
          </button>
          <button
            className={`admin-nav-btn ${tab === 'bundles' ? 'admin-nav-btn--active' : ''}`}
            onClick={() => setTab('bundles')}
          >
            <ShoppingBag size={18} /> Bundles
            {tab === 'bundles' && <ChevronRight size={14} className="admin-nav-arrow" />}
          </button>
          <button
            className={`admin-nav-btn ${tab === 'stock' ? 'admin-nav-btn--active' : ''}`}
            onClick={() => setTab('stock')}
          >
            <Activity size={18} /> Stock & Urgency
            {tab === 'stock' && <ChevronRight size={14} className="admin-nav-arrow" />}
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
          {/* ── Analytics Tab ── */}
          {tab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="admin-page-header">
                <div>
                  <h1 className="admin-page-title">Analytics</h1>
                  <p className="admin-page-sub">Live visitor and customer statistics</p>
                </div>
                <button 
                  className="admin-btn admin-btn--danger"
                  onClick={async () => {
                    if (window.confirm("Are you sure you want to reset analytics? This will delete all current users and guests data.")) {
                      try {
                        const usersSnap = await getDocs(collection(db, 'users'));
                        const guestsSnap = await getDocs(collection(db, 'guests'));
                        usersSnap.forEach(d => deleteDoc(d.ref));
                        guestsSnap.forEach(d => deleteDoc(d.ref));
                        alert('Analytics successfully reset.');
                      } catch (err) {
                        console.error('Failed to reset analytics:', err);
                        alert('Error resetting analytics.');
                      }
                    }
                  }}
                >
                  <Trash2 size={16} /> Reset Analytics
                </button>
              </div>

              <div className="admin-analytics-dashboard">
                {/* Live Active Users Row */}
                <div className="admin-analytics-live">
                  <div className="live-indicator">
                    <div className="live-dot" /> Live Active Visitors
                  </div>
                  <div className="live-stats">
                    <div className="live-stat-item">
                      <span className="live-stat-value">{stats.activeUsers + stats.activeGuests}</span>
                      <span className="live-stat-label">Total Active</span>
                    </div>
                    <div className="live-stat-item">
                      <span className="live-stat-value">{stats.activeUsers}</span>
                      <span className="live-stat-label">Customers</span>
                    </div>
                    <div className="live-stat-item">
                      <span className="live-stat-value">{stats.activeGuests}</span>
                      <span className="live-stat-label">Guests</span>
                    </div>
                  </div>
                </div>

                {/* Main Metrics Grid */}
                <div className="admin-analytics-grid">
                  <div className="admin-notif-card analytics-main-card">
                    <Users size={32} className="analytics-icon text-gold" />
                    <h3>{stats.totalUsers + stats.totalGuests}</h3>
                    <p>All-Time Visitors</p>
                  </div>
                  <div className="admin-notif-card analytics-main-card">
                    <Check size={32} className="analytics-icon text-green" />
                    <h3>{stats.totalUsers}</h3>
                    <p>Total Customers</p>
                  </div>
                  <div className="admin-notif-card analytics-main-card">
                    <Eye size={32} className="analytics-icon text-gray" />
                    <h3>{stats.totalGuests}</h3>
                    <p>Total Guests</p>
                  </div>
                </div>

                {/* New Customer Growth Section */}
                <div className="admin-analytics-growth">
                  <div className="admin-notif-card">
                    <h3 className="card-title" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}><BarChart2 size={18} /> New Customers</h3>
                    <div className="growth-stats">
                      <div className="growth-stat">
                        <span className="growth-val">{stats.newUsersToday}</span>
                        <span className="growth-lbl">Today</span>
                      </div>
                      <div className="growth-stat">
                        <span className="growth-val">{stats.newUsersWeek}</span>
                        <span className="growth-lbl">This Week</span>
                      </div>
                      <div className="growth-stat">
                        <span className="growth-val">{stats.newUsersMonth}</span>
                        <span className="growth-lbl">This Month</span>
                      </div>
                    </div>
                  </div>

                  <div className="admin-notif-card">
                    <h3 className="card-title" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}><Activity size={18} /> 7-Day Growth</h3>
                    <div className="admin-bar-chart">
                      {stats.graphData.map((d, i) => {
                        const maxCount = Math.max(...stats.graphData.map(gd => gd.count), 1);
                        const height = `${(d.count / maxCount) * 100}%`;
                        return (
                          <div key={i} className="chart-bar-wrap">
                            <div className="chart-bar-bg">
                              <div className="chart-bar-fill" style={{ height }} />
                            </div>
                            <span className="chart-bar-label">{d.label}</span>
                            <div className="chart-bar-tooltip">{d.count} Users</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Glow & Save Tab ── */}
          {tab === 'glow' && (
            <motion.div
              key="glow"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="admin-page-header">
                <div>
                  <h1 className="admin-page-title">Glow & Save Controls</h1>
                  <p className="admin-page-sub">Manage your active sale page</p>
                </div>
              </div>

              <div className="admin-notif-card" style={{ padding: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Enable Glow & Save Page</h2>
                  <label className="admin-toggle">
                    <input 
                      type="checkbox" 
                      checked={glowSettings.active} 
                      onChange={e => updateGlowSettings({ active: e.target.checked })} 
                    />
                    <span className="admin-toggle__track" />
                  </label>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Enable Exclusive Bundles</h2>
                  <label className="admin-toggle">
                    <input 
                      type="checkbox" 
                      checked={glowSettings.showBundles !== false} 
                      onChange={e => updateGlowSettings({ showBundles: e.target.checked })} 
                    />
                    <span className="admin-toggle__track" />
                  </label>
                </div>
                
                <div className="admin-form-field" style={{ marginBottom: 16 }}>
                  <label>Page Title</label>
                  <input 
                    style={{ width: '100%', padding: '10px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 6, color: '#fff' }}
                    value={glowSettings.title || ''} 
                    onChange={e => updateGlowSettings({ title: e.target.value })} 
                  />
                </div>

                <div className="admin-form-field">
                  <label>Page Subtitle</label>
                  <input 
                    style={{ width: '100%', padding: '10px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 6, color: '#fff' }}
                    value={glowSettings.subtitle || ''} 
                    onChange={e => updateGlowSettings({ subtitle: e.target.value })} 
                  />
                </div>
              </div>

              <div className="admin-notif-card" style={{ padding: '30px', marginTop: '24px' }}>
                <h2 style={{ fontSize: '1.2rem', margin: '0 0 20px 0' }}>Products on Discount</h2>
                
                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                  <div className="admin-form-field" style={{ flex: 2 }}>
                    <select 
                      value={discountForm.productId}
                      onChange={e => setDiscountForm(f => ({ ...f, productId: e.target.value }))}
                      style={{ width: '100%', padding: '10px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 6, color: '#fff' }}
                    >
                      <option value="">Select a product...</option>
                      {(products || []).map(p => (
                        <option key={p.id} value={p.id}>{p.name} (AED {p.price})</option>
                      ))}
                    </select>
                  </div>
                  <div className="admin-form-field" style={{ flex: 1 }}>
                    <input 
                      type="number"
                      placeholder="Discount %"
                      value={discountForm.discountPercent}
                      onChange={e => setDiscountForm(f => ({ ...f, discountPercent: e.target.value }))}
                      style={{ width: '100%', padding: '10px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 6, color: '#fff' }}
                    />
                  </div>
                  <button 
                    className="admin-btn admin-btn--primary"
                    onClick={() => {
                      if (!discountForm.productId || !discountForm.discountPercent) return;
                      const existing = glowSettings.discountedProducts || [];
                      const updated = existing.filter(p => p.productId !== discountForm.productId);
                      updated.push({ 
                        productId: discountForm.productId, 
                        discountPercent: Number(discountForm.discountPercent) 
                      });
                      updateGlowSettings({ discountedProducts: updated });
                      setDiscountForm({ productId: '', discountPercent: '' });
                    }}
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>

                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Original Price</th>
                        <th>Discount</th>
                        <th>Final Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!(glowSettings.discountedProducts && glowSettings.discountedProducts.length > 0) && (
                        <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No products on discount.</td></tr>
                      )}
                      {(glowSettings.discountedProducts || []).map(dp => {
                        const product = (products || []).find(p => p.id === dp.productId);
                        if (!product) return null;
                        const finalPrice = product.price * (1 - dp.discountPercent / 100);
                        return (
                          <tr key={dp.productId}>
                            <td>
                              <div className="admin-product-cell">
                                <img src={product.img} alt={product.name} className="admin-product-thumb" />
                                <p className="admin-product-name">{product.name}</p>
                              </div>
                            </td>
                            <td style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>AED {product.price?.toFixed(2)}</td>
                            <td><span className="admin-badge admin-badge--gold">{dp.discountPercent}% OFF</span></td>
                            <td className="admin-price" style={{ color: 'var(--rg-gold)' }}>AED {finalPrice.toFixed(2)}</td>
                            <td>
                              <button 
                                className="admin-icon-btn admin-icon-btn--delete" 
                                onClick={() => {
                                  const updated = glowSettings.discountedProducts.filter(p => p.productId !== dp.productId);
                                  updateGlowSettings({ discountedProducts: updated });
                                }}
                              >
                                <Trash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── VIP Access Tab ── */}
          {tab === 'vip' && (
            <motion.div key="vip" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <div className="admin-page-header">
                <div><h1 className="admin-page-title">VIP Early Access</h1><p className="admin-page-sub">Control exclusive access, discounts & manage VIP members</p></div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                <div className="admin-notif-card" style={{ padding: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Enable VIP Mode</h2>
                    <label className="admin-toggle">
                      <input type="checkbox" checked={vipSettings.active} onChange={e => updateVipSettings({ active: e.target.checked })} />
                      <span className="admin-toggle__track" />
                    </label>
                  </div>
                  <div className="admin-form-field">
                    <label>Global VIP Discount (%)</label>
                    <input type="number" style={{ width: '100%', padding: '10px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 6, color: '#fff' }}
                      value={vipSettings.discountPercent || 0}
                      onChange={e => updateVipSettings({ discountPercent: Number(e.target.value) })} />
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>Automatically applied to all VIP members' carts.</p>
                  </div>
                </div>

                <div className="admin-notif-card" style={{ padding: 28 }}>
                  <h2 style={{ fontSize: '1.1rem', marginTop: 0, marginBottom: 16 }}>Add VIP Member</h2>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input
                      style={{ flex: 1, padding: '10px 14px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 6, color: '#fff' }}
                      type="email" placeholder="customer@email.com"
                      value={newVipEmail}
                      onChange={e => setNewVipEmail(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && newVipEmail.trim()) { addVipMember(newVipEmail.trim()); setNewVipEmail(''); } }}
                    />
                    <button className="admin-btn admin-btn--primary" onClick={() => { if (newVipEmail.trim()) { addVipMember(newVipEmail.trim()); setNewVipEmail(''); } }}>
                      <Plus size={15} /> Add
                    </button>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>Enter the email address of the customer to grant VIP access.</p>
                </div>
              </div>

              <div className="admin-notif-card" style={{ padding: 28 }}>
                <h2 style={{ fontSize: '1.1rem', marginTop: 0, marginBottom: 16 }}>
                  <Zap size={16} style={{ verticalAlign: 'middle', marginRight: 6, color: 'var(--rg-gold)' }} />
                  VIP Members ({(vipSettings.members || []).length})
                </h2>
                {(vipSettings.members || []).length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>No VIP members yet. Add members above.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(vipSettings.members || []).map(email => (
                      <div key={email} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.15)', borderRadius: 8 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: '1rem' }}>⭐</span>
                          <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{email}</span>
                        </span>
                        <button className="admin-icon-btn admin-icon-btn--delete" onClick={() => { if (window.confirm(`Remove VIP from ${email}?`)) removeVipMember(email); }} title="Remove VIP">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── Campaigns Tab ── */}
          {tab === 'campaigns' && (
            <motion.div key="campaigns" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <div className="admin-page-header">
                <div><h1 className="admin-page-title">Campaign Manager</h1><p className="admin-page-sub">Create and schedule countdown timers & promotions</p></div>
                <button className="admin-btn admin-btn--primary" onClick={() => { setCampaignForm({ name: '', timerLabel: '', targetDate: '', active: true, timerMode: 'toEnd' }); setEditingCampaign(null); setShowCampaignForm(v => !v); }}>
                  <Plus size={16} /> New Campaign
                </button>
              </div>

              {showCampaignForm && (
                <div className="admin-notif-card" style={{ padding: 28, marginBottom: 24 }}>
                  <h3 style={{ marginTop: 0, marginBottom: 20 }}>{editingCampaign ? 'Edit Campaign' : 'New Campaign'}</h3>
                  <div className="admin-form-row">
                    <div className="admin-form-field"><label>Campaign Name</label>
                      <input value={campaignForm.name} onChange={e => setCampaignForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Black Friday 2026" /></div>
                    <div className="admin-form-field"><label>Timer Label</label>
                      <input value={campaignForm.timerLabel} onChange={e => setCampaignForm(f => ({ ...f, timerLabel: e.target.value }))} placeholder="e.g. Glow & Save Ends In" /></div>
                  </div>
                  <div className="admin-form-row">
                    <div className="admin-form-field"><label>Target Date & Time</label>
                      <input type="datetime-local" value={campaignForm.targetDate} onChange={e => setCampaignForm(f => ({ ...f, targetDate: e.target.value }))} /></div>
                    <div className="admin-form-field"><label>Timer Mode</label>
                      <select value={campaignForm.timerMode} onChange={e => setCampaignForm(f => ({ ...f, timerMode: e.target.value }))}>
                        <option value="toEnd">Countdown to Sale End</option>
                        <option value="toStart">Countdown to Sale Start</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input type="checkbox" checked={campaignForm.active} onChange={e => setCampaignForm(f => ({ ...f, active: e.target.checked }))} /> Active Campaign
                    </label>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className="admin-btn admin-btn--primary" onClick={async () => {
                      if (editingCampaign) { await updateCampaign(editingCampaign.id, campaignForm); }
                      else { await addCampaign(campaignForm); }
                      setShowCampaignForm(false); setEditingCampaign(null);
                    }}>{editingCampaign ? 'Save Changes' : 'Create Campaign'}</button>
                    <button className="admin-btn admin-btn--ghost" onClick={() => setShowCampaignForm(false)}>Cancel</button>
                  </div>
                </div>
              )}

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Name</th><th>Timer Label</th><th>Target Date</th><th>Mode</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {campaigns.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No campaigns yet. Create your first one!</td></tr>}
                    {campaigns.map(c => (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 600 }}>{c.name}</td>
                        <td>{c.timerLabel}</td>
                        <td>{c.targetDate ? new Date(c.targetDate).toLocaleString() : '—'}</td>
                        <td><span className="admin-badge">{c.timerMode === 'toStart' ? 'To Start' : 'To End'}</span></td>
                        <td><span className={`admin-badge ${c.active ? 'admin-badge--gold' : ''}`}>{c.active ? '✓ Active' : 'Inactive'}</span></td>
                        <td><div className="admin-actions">
                          <button className="admin-icon-btn admin-icon-btn--edit" onClick={() => { setCampaignForm({ ...c }); setEditingCampaign(c); setShowCampaignForm(true); }}><Pencil size={15} /></button>
                          <button className="admin-icon-btn admin-icon-btn--delete" onClick={() => { if (window.confirm('Delete campaign?')) deleteCampaign(c.id); }}><Trash2 size={15} /></button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ── Bundles Tab ── */}
          {tab === 'bundles' && (
            <motion.div key="bundles" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <div className="admin-page-header">
                <div><h1 className="admin-page-title">Bundle Builder</h1><p className="admin-page-sub">Create discounted product bundles for Glow & Save</p></div>
                <button className="admin-btn admin-btn--primary" onClick={() => { setBundleForm({ name: '', desc: '', img: '', originalPrice: '', discountPercent: '', finalPrice: '', active: true, vipOnly: false }); setEditingBundle(null); setShowBundleForm(v => !v); }}>
                  <Plus size={16} /> New Bundle
                </button>
              </div>

              {showBundleForm && (
                <div className="admin-notif-card" style={{ padding: 28, marginBottom: 24 }}>
                  <h3 style={{ marginTop: 0, marginBottom: 20 }}>{editingBundle ? 'Edit Bundle' : 'New Bundle'}</h3>
                  <div className="admin-form-row">
                    <div className="admin-form-field"><label><Tag size={13} /> Bundle Name</label>
                      <input value={bundleForm.name} onChange={e => setBundleForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Soft Glam Bundle" /></div>
                    <div className="admin-form-field"><label><Image size={13} /> Bundle Image (Upload from PC)</label>
                      <input type="file" accept="image/*" disabled={uploadingBundleImg} onChange={async e => {
                        const file = e.target.files[0];
                        if (file) {
                          setUploadingBundleImg(true);
                          try {
                            const formData = new FormData();
                            formData.append('image', file);
                            const IMGBB_API_KEY = '682d8aa29a9ed8cb72d0b40fde7d6c2a';
                            const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                              method: 'POST',
                              body: formData
                            });
                            const data = await response.json();
                            if (data.success) {
                              setBundleForm(f => ({ ...f, img: data.data.url }));
                            } else {
                              throw new Error(data.error?.message || "Failed to upload image");
                            }
                          } catch (err) { console.error('Upload failed', err); alert('Image upload failed: ' + err.message); }
                          finally { setUploadingBundleImg(false); }
                        }
                      }} />
                      {uploadingBundleImg && <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>Uploading image...</div>}
                      {bundleForm.img && !uploadingBundleImg && <img src={bundleForm.img} alt="Preview" style={{ height: 40, objectFit: 'contain', marginTop: 8 }} />}
                    </div>
                  </div>
                  <div className="admin-form-field" style={{ marginBottom: 16 }}><label><FileText size={13} /> Description</label>
                    <textarea rows={2} value={bundleForm.desc} onChange={e => setBundleForm(f => ({ ...f, desc: e.target.value }))} placeholder="What's in this bundle?" /></div>
                  <div className="admin-form-row">
                    <div className="admin-form-field"><label><DollarSign size={13} /> Original Price (AED)</label>
                      <input type="number" value={bundleForm.originalPrice} onChange={e => {
                        const orig = parseFloat(e.target.value) || 0;
                        const disc = parseFloat(bundleForm.discountPercent) || 0;
                        const final = orig * (1 - disc / 100);
                        setBundleForm(f => ({ ...f, originalPrice: e.target.value, finalPrice: final.toFixed(2) }));
                      }} placeholder="3500" /></div>
                    <div className="admin-form-field"><label>Discount (%)</label>
                      <input type="number" min="0" max="100" value={bundleForm.discountPercent} onChange={e => {
                        const disc = parseFloat(e.target.value) || 0;
                        const orig = parseFloat(bundleForm.originalPrice) || 0;
                        const final = orig * (1 - disc / 100);
                        setBundleForm(f => ({ ...f, discountPercent: e.target.value, finalPrice: final.toFixed(2) }));
                      }} placeholder="20" /></div>
                    <div className="admin-form-field"><label style={{ color: 'var(--rg-gold)' }}>Final Price (auto-calculated)</label>
                      <input type="number" value={bundleForm.finalPrice} readOnly style={{ background: 'rgba(255,215,0,0.06)', cursor: 'not-allowed' }} /></div>
                  </div>
                  <div style={{ display: 'flex', gap: 24, marginBottom: 20, flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input type="checkbox" checked={bundleForm.active} onChange={e => setBundleForm(f => ({ ...f, active: e.target.checked }))} /> Active
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input type="checkbox" checked={bundleForm.vipOnly} onChange={e => setBundleForm(f => ({ ...f, vipOnly: e.target.checked }))} /> VIP Only
                    </label>
                  </div>
                  {bundleForm.originalPrice && bundleForm.discountPercent && (
                    <div style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: '0.9rem' }}>
                      <strong style={{ color: 'var(--rg-gold)' }}>Pricing Preview:</strong><br />
                      Original: AED {parseFloat(bundleForm.originalPrice || 0).toFixed(2)} &nbsp;→&nbsp;
                      Discount: {bundleForm.discountPercent}% &nbsp;→&nbsp;
                      <strong>Final: AED {parseFloat(bundleForm.finalPrice || 0).toFixed(2)}</strong>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className="admin-btn admin-btn--primary" disabled={uploadingBundleImg} onClick={async () => {
                      const data = { ...bundleForm, originalPrice: parseFloat(bundleForm.originalPrice) || 0, discountPercent: parseFloat(bundleForm.discountPercent) || 0, finalPrice: parseFloat(bundleForm.finalPrice) || 0 };
                      if (editingBundle) { await updateBundle(editingBundle.id, data); }
                      else { await addBundle(data); }
                      setShowBundleForm(false); setEditingBundle(null);
                    }}>{editingBundle ? 'Save Bundle' : 'Create Bundle'}</button>
                    <button className="admin-btn admin-btn--ghost" onClick={() => setShowBundleForm(false)}>Cancel</button>
                  </div>
                </div>
              )}

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Bundle</th><th>Original</th><th>Discount</th><th>Final Price</th><th>VIP</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {bundles.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No bundles yet. Build your first bundle!</td></tr>}
                    {bundles.map(b => (
                      <tr key={b.id}>
                        <td><div className="admin-product-cell">
                          {b.img && <img src={b.img} alt={b.name} className="admin-product-thumb" />}
                          <div><p className="admin-product-name">{b.name}</p><p className="admin-product-desc">{b.desc?.substring(0, 40)}</p></div>
                        </div></td>
                        <td style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>AED {b.originalPrice?.toFixed(2)}</td>
                        <td><span className="admin-badge admin-badge--gold">{b.discountPercent}% OFF</span></td>
                        <td className="admin-price" style={{ color: 'var(--rg-gold)' }}>AED {b.finalPrice?.toFixed(2)}</td>
                        <td><span className={`admin-badge ${b.vipOnly ? 'admin-badge--gold' : ''}`}>{b.vipOnly ? '⭐ VIP' : 'Public'}</span></td>
                        <td><span className={`admin-badge ${b.active ? 'admin-badge--gold' : ''}`}>{b.active ? '✓ Active' : 'Off'}</span></td>
                        <td><div className="admin-actions">
                          <button className="admin-icon-btn admin-icon-btn--edit" onClick={() => { setBundleForm({ ...b, originalPrice: b.originalPrice?.toString(), discountPercent: b.discountPercent?.toString(), finalPrice: b.finalPrice?.toString() }); setEditingBundle(b); setShowBundleForm(true); }}><Pencil size={15} /></button>
                          <button className="admin-icon-btn admin-icon-btn--delete" onClick={() => { if (window.confirm('Delete bundle?')) deleteBundle(b.id); }}><Trash2 size={15} /></button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ── Stock & Urgency Tab ── */}
          {tab === 'stock' && (
            <motion.div key="stock" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <div className="admin-page-header">
                <div><h1 className="admin-page-title">Stock & Urgency</h1><p className="admin-page-sub">Manage inventory alerts and urgency notifications</p></div>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Product</th><th>Stock</th><th>Low Stock Threshold</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {(products || []).length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No products found.</td></tr>}
                    {(products || []).map(p => {
                      const stock = p.stock ?? 0;
                      const threshold = p.lowStockThreshold ?? 10;
                      const isLow = stock <= threshold;
                      return (
                        <tr key={p.id} style={isLow ? { background: 'rgba(239,68,68,0.04)' } : {}}>
                          <td><div className="admin-product-cell"><img src={p.img} alt={p.name} className="admin-product-thumb" /><p className="admin-product-name">{p.name}</p></div></td>
                          <td>
                            <input type="number" min="0" defaultValue={stock} style={{ width: 80, padding: '6px 10px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 6, color: '#fff' }}
                              onBlur={e => updateProduct(p.id, { stock: parseInt(e.target.value) || 0 })} />
                          </td>
                          <td>
                            <input type="number" min="0" defaultValue={threshold} style={{ width: 80, padding: '6px 10px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 6, color: '#fff' }}
                              onBlur={e => updateProduct(p.id, { lowStockThreshold: parseInt(e.target.value) || 10 })} />
                          </td>
                          <td>
                            {p.comingSoon ? <span className="admin-badge admin-badge--coming-soon">Coming Soon</span>
                              : isLow ? <span className="admin-badge" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>⚠ Low Stock</span>
                              : <span className="admin-badge" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>✓ In Stock</span>}
                          </td>
                          <td><div className="admin-actions">
                            <button className="admin-icon-btn admin-icon-btn--edit" onClick={() => setEditProduct(p)} title="Edit Product"><Pencil size={15} /></button>
                          </div></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>💡 Tip: Click outside the stock input to save. Low stock alerts show when Stock ≤ Threshold.</p>
            </motion.div>
          )}

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
                            <td className="admin-price">
                              {p.comingSoon
                                ? <span className="admin-badge admin-badge--coming-soon">Coming Soon</span>
                                : `AED ${parseFloat(p.price).toFixed(2)}`
                              }
                            </td>
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
                  <h1 className="admin-page-title">Broadcast Center</h1>
                  <p className="admin-page-sub">Communicate directly with your users in real time</p>
                </div>
              </div>

              <div className="admin-notif-layout">
                {/* Left/Top: Broadcast form */}
                <div className="admin-notif-card">
                  <div className="admin-notif-card__glow" />
                  <label className="admin-notif-label">
                    <Bell size={14} /> Send a New Message
                  </label>
                  <textarea
                    className="admin-notif-textarea"
                    rows={4}
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
                      {notifStatus === 'idle' && <><Send size={15} /> Send Broadcast</>}
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

                {/* Right/Bottom: Broadcast History */}
                <div className="admin-history-card">
                  <div className="admin-notif-card__glow" />
                  <h2 className="admin-history-title">
                    <Bell size={16} /> History & Status
                  </h2>
                  <p className="admin-history-subtitle">
                    Active notifications appear on customer screens instantly.
                  </p>
                  
                  <div className="admin-history-list">
                    {notifications.length === 0 ? (
                      <div className="admin-history-empty">
                        <Bell size={24} style={{ opacity: 0.3 }} />
                        <p>No broadcast history found</p>
                      </div>
                    ) : (
                      notifications.map((notif, index) => {
                        const date = notif.createdAt && typeof notif.createdAt.toDate === 'function'
                          ? notif.createdAt.toDate().toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'Just now';
                        
                        const isCurrentlyActive = index === 0 && notif.createdAt && 
                          (new Date() - notif.createdAt.toDate()) < 24 * 60 * 60 * 1000;

                        return (
                          <div key={notif.id} className={`admin-history-item ${isCurrentlyActive ? 'admin-history-item--active' : ''}`}>
                            <div className="admin-history-item__body">
                              <div className="admin-history-item__header">
                                <span className={`admin-history-badge ${isCurrentlyActive ? 'admin-history-badge--live' : 'admin-history-badge--expired'}`}>
                                  {isCurrentlyActive ? 'Live Alert' : 'Expired'}
                                </span>
                                <span className="admin-history-item__date">{date}</span>
                              </div>
                              <p className="admin-history-item__text">{notif.message}</p>
                            </div>
                            <button
                              className="admin-history-item__delete-btn"
                              onClick={() => {
                                if (window.confirm("Delete this notification? This will instantly remove it from all users' screens in real time.")) {
                                  deleteNotification(notif.id);
                                }
                              }}
                              title="Delete notification"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        );
                      })
                    )}
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
