import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Star, ShoppingBag, Loader2 } from 'lucide-react';
import { categories } from '../data/products';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useSearchParams } from 'react-router-dom';
import './Products.css';

export default function Products() {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get('cat') || 'all';
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const { addToCart } = useCart();
  const { products, loading } = useProducts();
  const [added, setAdded] = useState({});

  const filtered = useMemo(() => {
    let list = products || [];
    if (activeCategory !== 'all') list = list.filter(p => p.category === activeCategory);
    if (search.trim()) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (sortBy === 'price-asc')  list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === 'name')       list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [activeCategory, search, sortBy, products]);

  const handleAdd = (p) => {
    addToCart(p);
    setAdded(prev => ({ ...prev, [p.id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [p.id]: false })), 1500);
  };

  return (
    <div className="products-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__glow" />
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label">Our Collection</span>
            <h1 className="heading-xl gradient-text">All Products</h1>
            <p className="page-header__sub">{products.length} luxury beauty essentials, crafted to perfection</p>
          </motion.div>
        </div>
      </div>

      <div className="container">
        {/* Toolbar */}
        <div className="products-toolbar">
          {/* Search */}
          <div className="products-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="products-search__input"
              id="products-search"
            />
          </div>
          {/* Sort */}
          <div className="products-sort">
            <SlidersHorizontal size={15} />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="products-sort__select"
              id="products-sort"
            >
              <option value="default">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A–Z</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="products-cats">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`products-cat-btn ${activeCategory === cat.id ? 'products-cat-btn--active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
              id={`cat-${cat.id}`}
            >
              {cat.label}
              {cat.id !== 'all' && (
                <span className="products-cat-count">
                  {products.filter(p => p.category === cat.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="products-count">
          Showing <span>{filtered.length}</span> {filtered.length === 1 ? 'product' : 'products'}
          {activeCategory !== 'all' && ` in ${categories.find(c => c.id === activeCategory)?.label}`}
        </p>

        {/* Grid */}
        <motion.div layout className="products-grid">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <div className="products-empty">
                <ShoppingBag size={48} strokeWidth={1} />
                <p>No products found</p>
              </div>
            ) : (
              filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.35, delay: i < 12 ? i * 0.04 : 0 }}
                  className="product-card"
                >
                  <div className="img-wrap">
                    <img src={p.img} alt={p.name} loading="lazy" />
                    <div className="card-overlay">
                      <button
                        className={`btn ${added[p.id] ? 'btn-ghost' : 'btn-primary'}`}
                        style={{ padding: '10px 22px', fontSize: '0.72rem' }}
                        onClick={() => handleAdd(p)}
                        id={`product-add-${p.id}`}
                      >
                        {added[p.id] ? '✓ Added!' : 'Add to Bag'}
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <p className="card-category">{p.category}</p>
                    <p className="card-name">{p.name}</p>
                    <p className="products-card-desc">{p.desc}</p>
                    <div className="products-card-footer">
                      <p className="card-price">{[1, 3].includes(p.id) ? 'AED 30' : 'COMING SOON'}</p>
                      <div className="products-card-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={11} fill="var(--rg-gold)" color="var(--rg-gold)" />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
