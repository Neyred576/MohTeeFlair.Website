import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, Star, Clock, Bookmark } from 'lucide-react';
import './BeautyTips.css';

const tips = [
  {
    id: 1,
    tag: 'Eye Makeup',
    title: 'Mastering the Perfect Smoky Eye',
    time: '5 min read',
    img: '/images/products/tools/MTF Eyeshadow.png',
    excerpt: 'A flawless smoky eye is timeless. From blending to the finishing liner, here is the MTF guide to a look that commands every room.',
    steps: [
      'Apply an eyeshadow primer to your lids for long-lasting wear and vibrant colour payoff.',
      'Pack a medium brown shadow across the lid with your flat Eyeshadow Brush.',
      'Using the Crease Brush, blend a darker shade into the crease using windshield-wiper motions.',
      'Darken the outer corner with your deepest shade and blend downward with the Smudge Brush.',
      'Line the waterline with a black pencil for extra intensity and drama.',
      'Highlight the inner corner and brow bone with a champagne shimmer shade.',
      'Finish with 2–3 coats of MTF Mascara, wiggling at the root for maximum volume.',
    ],
    pro: 'Focus the darkest colour on the outer V — this is where all the drama lives.',
  },
  {
    id: 2,
    tag: 'Foundation',
    title: 'Finding Your Perfect Foundation Match',
    time: '4 min read',
    img: '/images/products/face/MTF Foundation.png',
    excerpt: 'The right foundation transforms your skin — the wrong one can undermine your whole look. Here is how to get it right every time.',
    steps: [
      'Identify your undertone: cool (pink/blue), warm (yellow/golden), or neutral (a mix of both).',
      'Swatch three shades on your jawline and step into natural light to assess the best match.',
      'Your foundation should disappear into your skin — that is the right shade.',
      'Apply MTF Primer to clean skin and allow it to set for 60 seconds before foundation.',
      'Use your MTF Blending Sponge damp for the most skin-like, natural finish.',
      'Blend in pressing (not swiping) motions, starting from the centre of the face outward.',
      'Lock everything in with MTF Setting Spray held 30 cm from your face.',
    ],
    pro: 'Always swatch on your jawline, never on your hand — your hand is a completely different skin tone.',
  },
  {
    id: 3,
    tag: 'Lips',
    title: 'The Secret to Long-Lasting Lips',
    time: '3 min read',
    img: '/images/products/lips/MTF Liquid Lipstick.png',
    excerpt: 'Whether it is a liquid lipstick or a classic bullet, these are the expert steps for colour that stays put from morning to midnight.',
    steps: [
      'Exfoliate lips gently with a soft toothbrush or lip scrub the night before for smooth application.',
      'Apply MTF Lip Balm as a base and allow it to absorb for 2 minutes before applying colour.',
      'Outline your lips with a matching liner slightly over the natural lip line for fullness.',
      'Fill in the entire lip with liner before applying colour — this helps it lock in.',
      'Apply your MTF Lipstick or Liquid Lipstick in one precise stroke per side.',
      'Blot with a tissue, then apply a second thin coat for maximum longevity.',
      'Use a clean lip brush to clean up any edges for a polished, editorial finish.',
    ],
    pro: 'Setting your lip liner and lipstick with a whisper of translucent powder adds an extra hour of wear.',
  },
  {
    id: 4,
    tag: 'Skin Care',
    title: 'Your 5-Step MTF Morning Ritual',
    time: '6 min read',
    img: '/images/products/skincare/MTF Serums.png',
    excerpt: 'A great morning routine sets the tone for your skin and your makeup. Here is the ultimate MTF 5-step ritual for a radiant, protected complexion.',
    steps: [
      'Cleanse with MTF Shower Gel or a gentle cleanser to remove overnight buildup without stripping.',
      'Apply MTF Toner on a cotton pad and sweep across skin to balance pH and prime pores.',
      'Follow with 2–3 drops of MTF Serum, pressing gently into skin for deep penetration.',
      'Seal in the serum with MTF Hydration Cream — massage in upward, outward motions.',
      'Finish with SPF 30+ sunscreen as your final step before makeup application.',
    ],
    pro: 'Apply skincare in order of thinnest to thickest consistency — this maximises absorption of every product.',
  },
  {
    id: 5,
    tag: 'Tools',
    title: 'How to Clean Your Makeup Brushes',
    time: '4 min read',
    img: '/images/products/tools/MTF Makeup Brush.png',
    excerpt: 'Clean brushes are the foundation of flawless makeup. Here is how to care for your MTF tools so they perform like new every single day.',
    steps: [
      'Spot-clean with a brush cleanser spray after every use for a quick refresh between shades.',
      'Deep clean weekly by swirling the brush in lukewarm water with a drop of gentle shampoo.',
      'Rinse the bristles while pointing downward — never let water into the ferrule (the metal part).',
      'Reshape the bristles gently and lay flat on a towel to dry — never upright in a cup.',
      'Allow 6–8 hours to dry fully before using again for best results.',
    ],
    pro: 'Dirty brushes are the #1 cause of breakouts from makeup — clean brushes are non-negotiable for clear skin.',
  },
  {
    id: 6,
    tag: 'Contouring',
    title: 'Effortless Contouring for Every Face Shape',
    time: '5 min read',
    img: '/images/products/tools/MTF Pressed Powder.png',
    excerpt: 'Contouring does not have to be complicated or dramatic. This MTF guide teaches you to sculpt naturally for a look that is polished, not painted.',
    steps: [
      'Identify your face shape — oval, round, square, heart, or long — as this determines placement.',
      'Use a cool-toned matte powder, two shades deeper than your skin, for the shadow effect.',
      'Apply contour beneath your cheekbones following the hollow, not the apple of your cheek.',
      'Blend the sides of your forehead and jaw to add definition and reduce width if desired.',
      "Add highlighter to the tops of cheekbones, bridge of the nose, and cupid's bow.",
      'Blend everything outward with a fluffy brush in circular motions until seamless.',
      'Set with MTF Setting Spray to meld all layers together for a naturally sculpted finish.',
    ],
    pro: 'The golden rule: your contour should never be visible in natural light — if you can see it clearly, blend more.',
  },
];

export default function BeautyTips() {
  const [openId, setOpenId] = useState(null);
  const [activeTag, setActiveTag] = useState('All');
  const tags = ['All', ...Array.from(new Set(tips.map(t => t.tag)))];

  const filtered = activeTag === 'All' ? tips : tips.filter(t => t.tag === activeTag);

  return (
    <div className="tips-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header__glow" />
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="section-label">Beauty Intelligence</span>
            <h1 className="heading-xl gradient-text">Beauty Tips & Tutorials</h1>
            <p className="page-header__sub">Expert secrets, step-by-step guides, and pro techniques from the MTF team</p>
          </motion.div>
        </div>
      </div>

      <div className="container">
        {/* Tag filters */}
        <div className="tips-tags">
          {tags.map(tag => (
            <button
              key={tag}
              className={`products-cat-btn ${activeTag === tag ? 'products-cat-btn--active' : ''}`}
              onClick={() => setActiveTag(tag)}
              id={`tip-tag-${tag.replace(/\s+/g, '-').toLowerCase()}`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Tips grid */}
        <div className="tips-grid">
          {filtered.map((tip, i) => (
            <motion.article
              key={tip.id}
              className={`tip-article ${openId === tip.id ? 'tip-article--open' : ''}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              {/* Card top */}
              <div className="tip-article__top">
                <div className="tip-article__img">
                  <img src={tip.img} alt={tip.title} loading="lazy" />
                </div>
                <div className="tip-article__meta">
                  <span className="badge badge-outline">{tip.tag}</span>
                  <div className="tip-article__info">
                    <Clock size={12} /> {tip.time}
                  </div>
                </div>
                <h2 className="tip-article__title">{tip.title}</h2>
                <p className="tip-article__excerpt">{tip.excerpt}</p>
                <button
                  className="tip-article__toggle"
                  onClick={() => setOpenId(openId === tip.id ? null : tip.id)}
                  id={`tip-toggle-${tip.id}`}
                >
                  {openId === tip.id ? 'Close Guide' : 'Read Full Guide'}
                  <ChevronDown size={16} className={`tip-article__chevron ${openId === tip.id ? 'tip-article__chevron--up' : ''}`} />
                </button>
              </div>

              {/* Expanded content */}
              <AnimatePresence>
                {openId === tip.id && (
                  <motion.div
                    className="tip-article__body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <div className="gold-line" style={{ marginBottom: 24 }} />
                    <h3 className="tip-article__steps-title">
                      <Star size={14} color="var(--rg-gold)" /> Step-by-Step Guide
                    </h3>
                    <ol className="tip-article__steps">
                      {tip.steps.map((step, idx) => (
                        <li key={idx} className="tip-article__step">
                          <span className="tip-article__step-num">{idx + 1}</span>
                          <p>{step}</p>
                        </li>
                      ))}
                    </ol>
                    <div className="tip-article__pro">
                      <Sparkles size={16} color="var(--rg-gold)" />
                      <div>
                        <strong>Pro Tip:</strong> {tip.pro}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
