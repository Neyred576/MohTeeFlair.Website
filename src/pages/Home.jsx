import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Sparkles, Shield, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import './Home.css';

const heroWords = ['Timeless.', 'Bold.', 'Unapologetic.'];

const perks = [
  { icon: <Shield size={22} />,    title: '100% Authentic',   desc: 'Genuine luxury products' },
  { icon: <RotateCcw size={22} />, title: 'Easy Returns',     desc: '30-day return policy' },
  { icon: <Star size={22} />,      title: 'Premium Quality',  desc: 'Dermatologist tested' },
];

const beautyTeaser = [
  { title: 'The Art of the Smoky Eye',      tag: 'Eye Makeup',  img: '/images/products/tools/MTF Eyeshadow.png' },
  { title: 'How to Find Your Perfect Shade', tag: 'Foundation',  img: '/images/products/face/MTF Foundation.png' },
  { title: 'Your Daily Skincare Ritual',     tag: 'Skin Care',   img: '/images/products/skincare/MTF Serums.png' },
];

export default function Home() {
  const [wordIdx, setWordIdx] = useState(0);
  const { addToCart } = useCart();
  const { products } = useProducts();
  
  const featuredProducts = products ? products.filter(p => p.featured) : [];

  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % heroWords.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="home">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__glow hero__glow--left" />
        <div className="hero__glow hero__glow--right" />

        <div className="container hero__inner">
          <div className="hero__content">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7 }}
            >
              <span className="section-label">Luxury Beauty Redefined</span>
            </motion.div>

            <motion.h1
              className="heading-hero hero__headline"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.8 }}
            >
              Beauty That's<br />
              <span className="gradient-text hero__cycle-word" key={wordIdx}>
                {heroWords[wordIdx]}
              </span>
            </motion.h1>

            <motion.p
              className="hero__sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              Discover Moh Tee Flair — where luxury meets artistry. Premium cosmetics crafted for the woman who demands the extraordinary.
            </motion.p>

            <motion.div
              className="hero__btns"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
            >
              <Link to="/products" className="btn btn-primary" id="hero-shop-btn">
                Shop the Collection <ArrowRight size={16} />
              </Link>
              <Link to="/about" className="btn btn-ghost" id="hero-about-btn">
                Our Story
              </Link>
            </motion.div>

          </div>

          {/* Hero Image */}
          <motion.div
            className="hero__visual"
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="hero__img-frame hero__img-frame--new">
              <div className="hero__img-particles">
                <span /><span /><span /><span /><span />
              </div>
              <div className="hero__img-ring hero__img-ring--a" />
              <div className="hero__img-ring hero__img-ring--b" />
              <img
                src="/images/moh/MTF LOGO .png"
                alt="MTF Hero"
                className="hero__img--main"
              />
              <div className="hero__img-shimmer" />
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="hero__scroll">
          <div className="hero__scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ── Perks ── */}
      <section className="home-perks section-sm">
        <div className="container">
          <div className="home-perks__grid">
            {perks.map((p, i) => (
              <motion.div
                key={p.title}
                className="perk-card card-glass"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="perk-card__icon">{p.icon}</div>
                <div>
                  <p className="perk-card__title">{p.title}</p>
                  <p className="perk-card__desc">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="section home-featured">
        <div className="container">
          <div className="text-center mb-12">
            <span className="section-label">Bestsellers</span>
            <h2 className="heading-xl gradient-text">Featured Products</h2>
            <p className="home-section-sub">Hand-picked luxuries loved by our community</p>
          </div>

          <div className="home-products-grid">
              {featuredProducts.slice(0, 8).map((p, i) => (
              <motion.div
                key={p.id}
                className="product-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <div className="img-wrap">
                  <img src={p.img} alt={p.name} loading="lazy" />
                  <div className="card-overlay">
                    {!p.comingSoon && (
                      <button
                        className="btn btn-primary"
                        style={{ padding: '10px 22px', fontSize: '0.72rem' }}
                        onClick={() => addToCart(p)}
                        id={`add-to-cart-${p.id}`}
                      >
                        Add to Bag
                      </button>
                    )}
                    {p.comingSoon && (
                      <span className="btn btn-ghost" style={{ padding: '10px 22px', fontSize: '0.72rem', cursor: 'default', opacity: 0.7 }}>
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>
                <div className="card-body">
                  <p className="card-category">{p.category}</p>
                  <p className="card-name">{p.name}</p>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8 }}>
                    <p className="card-price">
                      {p.comingSoon ? 'COMING SOON' : `AED ${parseFloat(p.price).toFixed(2)}`}
                    </p>
                    <div style={{ display:'flex', gap:2 }}>
                      {[...Array(5)].map((_,i) => <Star key={i} size={11} fill="#C9A07A" color="#C9A07A" />)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/products" className="btn btn-outline" id="view-all-products-btn">
              View All Products <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Brand Banner ── */}
      <section className="home-banner">
        <div className="home-banner__glow" />
        <div className="container home-banner__inner">
          <motion.div
            className="home-banner__text"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-label">The MTF Promise</span>
            <h2 className="heading-xl">
              There are women who follow the light<br />
              <span className="gradient-text">and there are women who become it.</span>
            </h2>
            <p className="home-banner__desc">
              The founder of Moh Tee Flair, has always belonged to the second kind.
            </p>
            <Link to="/about" className="btn btn-primary" id="banner-about-btn">
              Discover Our Story <ArrowRight size={15} />
            </Link>
          </motion.div>
          <motion.div
            className="home-banner__img-wrap"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="home-banner__img-bg" />
            <img
              src="/images/moh/IMG_3397.JPEG"
              alt="Moh Tee Flair Founder"
              className="home-banner__img"
            />
            <div className="home-banner__img-label">
              <Sparkles size={14} />
              <span>Founder & Creative Director</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Beauty Tips Teaser ── */}
      <section className="section home-tips">
        <div className="container">
          <div className="text-center mb-12">
            <span className="section-label">Beauty Insights</span>
            <h2 className="heading-xl">Tips & Tutorials</h2>
            <p className="home-section-sub">Expert advice to elevate your beauty ritual</p>
          </div>
          <div className="home-tips__grid">
            {beautyTeaser.map((tip, i) => (
              <motion.div
                key={tip.title}
                className="tip-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
              >
                <div className="tip-card__img">
                  <img src={tip.img} alt={tip.title} loading="lazy" />
                  <div className="tip-card__overlay" />
                </div>
                <div className="tip-card__body">
                  <span className="badge badge-outline" style={{ marginBottom: 8, display:'inline-block' }}>{tip.tag}</span>
                  <h3 className="tip-card__title">{tip.title}</h3>
                  <Link to="/beauty-tips" className="tip-card__link">
                    Read More <ArrowRight size={13} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/beauty-tips" className="btn btn-ghost" id="all-tips-btn">
              All Beauty Tips <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="home-newsletter">
        <div className="container">
          <motion.div
            className="home-newsletter__inner"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="home-newsletter__glow" />
            <Sparkles size={28} color="var(--rg-gold)" />
            <h2 className="heading-lg text-center mt-4">Join the Inner Circle</h2>
            <p className="home-newsletter__sub">
              Subscribe for exclusive offers, early launches, and luxury beauty secrets.
            </p>
            <form className="home-newsletter__form" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email address"
                className="home-newsletter__input"
                id="home-newsletter-email"
              />
              <button type="submit" className="btn btn-primary" id="home-newsletter-submit">
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
