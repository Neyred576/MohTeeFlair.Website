import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Star, ShoppingBag, Heart } from 'lucide-react';
import { categories } from '../data/products';
import { useProducts } from '../context/ProductContext';
import { useWishlist } from '../context/WishlistContext';
import { useSearchParams } from 'react-router-dom';
import ProductModal from '../components/ProductModal';
import './Products.css';

export default function Products() {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get('cat') || 'all';
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const { products, loading } = useProducts();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filtered = useMemo(() => {
    let list = products || [];
    if (activeCategory !== 'all') list = list.filter(p => p.category === activeCategory);
    if (search.trim()) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (sortBy === 'price-asc')  list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === 'name')       list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [activeCategory, search, sortBy, products]);

  return (
    <div className="products-page">
      {/* Product Modal */}

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

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
                  layoutId={`product-card-${p.id}`}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.35, delay: i < 12 ? i * 0.04 : 0 }}
                  className="product-card"
                  onClick={() => {
                    if (p.outOfStock) {
                      alert("It's out of stock stocking soon");
                    } else {
                      setSelectedProduct(p);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="img-wrap">
                    <motion.img 
                      layoutId={`product-image-${p.id}`}
                      src={p.img} 
                      alt={p.name} 
                      loading="lazy" 
                    />
                    
                    {/* Wishlist Heart Overlay */}
                    <button 
                      className={`product-card-heart ${isInWishlist(p.id) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(p.id);
                      }}
                      aria-label={isInWishlist(p.id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart 
                        size={20} 
                        fill={isInWishlist(p.id) ? "var(--rg-gold)" : "none"} 
                        color={isInWishlist(p.id) ? "var(--rg-gold)" : "#fff"} 
                      />
                    </button>

                    <div className="card-overlay">
                      <span className="btn btn-primary" style={{ padding: '10px 22px', fontSize: '0.72rem', pointerEvents: 'none' }}>
                        {p.outOfStock ? 'Out of Stock' : p.comingSoon ? 'Coming Soon' : 'Quick View'}
                      </span>
                    </div>
                  </div>
                  <div className="card-body">
                    <motion.p layoutId={`product-category-${p.id}`} className="card-category">{p.category}</motion.p>
                    <motion.p layoutId={`product-name-${p.id}`} className="card-name">{p.name}</motion.p>
                    <p className="products-card-desc">{p.desc}</p>
                    <div className="products-card-footer">
                      <p className="card-price">
                        {p.outOfStock ? 'OUT OF STOCK' : p.comingSoon ? 'COMING SOON' : `AED ${parseFloat(p.price).toFixed(2)}`}
                      </p>
                      <div className="products-card-stars">
                        {[...Array(5)].map((_, idx) => (
                          <Star key={idx} size={12} fill="var(--rg-gold)" color="var(--rg-gold)" />
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
