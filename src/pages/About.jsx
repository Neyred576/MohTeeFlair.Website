import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Heart, Star, Award, Leaf } from 'lucide-react';
import './About.css';

const values = [
  { icon: <Heart size={22} />,   title: 'Made with Love',      desc: 'Every product is formulated with passion and a deep love for beauty and self-expression.' },
  { icon: <Leaf size={22} />,    title: 'Clean & Ethical',     desc: 'Cruelty-free, paraben-free formulations that respect your skin and the planet.' },
  { icon: <Award size={22} />,   title: 'Premium Quality',     desc: 'We use only the finest ingredients, dermatologist-tested for safety and efficacy.' },
  { icon: <Sparkles size={22} />, title: 'Luxury for All',     desc: 'We believe every woman deserves to experience the joy of genuine luxury beauty.' },
];

const milestones = [
  { year: '2026', event: 'Moh Tee Flair was launched — a vision of luxury beauty realized.' },
  { year: '2027', event: 'Expanded our reach across the UAE and East Africa, growing our beautiful community.' },
  { year: '2028', event: 'Introduced the full MTF collection and digital flagship store, and we keep growing.' },
];

export default function About() {
  return (
    <div className="about-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header__glow" />
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="section-label">Our Story</span>
            <h1 className="heading-xl gradient-text">About Moh Tee Flair</h1>
            <p className="page-header__sub">A story of passion, luxury, and the belief that beauty is for everyone</p>
          </motion.div>
        </div>
      </div>

      {/* Founder Section */}
      <section className="section about-founder">
        {/* Animated background */}
        <div className="about-founder__bg-anim">
          <div className="about-founder__orb about-founder__orb--1" />
          <div className="about-founder__orb about-founder__orb--2" />
          <div className="about-founder__orb about-founder__orb--3" />
          <div className="about-founder__particles">
            <span /><span /><span /><span /><span /><span /><span /><span />
          </div>
        </div>
        <div className="container about-founder__inner">
          <motion.div
            className="about-founder__img-col"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="about-founder__img-frame about-founder__img-frame--large">
              <div className="about-founder__img-ring about-founder__img-ring--outer" />
              <div className="about-founder__img-ring about-founder__img-ring--inner" />
              <div className="about-founder__img-glow" />
              <img
                src="/images/moh/IMG_3397.JPEG"
                alt="MTF Founder"
                className="about-founder__img about-founder__img--large"
              />
              <div className="about-founder__img-badge">
                <Star size={14} fill="var(--rg-gold)" color="var(--rg-gold)" />
                <span>Founder & Creative Director</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="about-founder__text"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <span className="section-label">The Visionary</span>
            <h2 className="heading-lg">Born from a Passion<br /><span className="gradient-text">for Extraordinary Beauty</span></h2>
            <div className="about-founder__copy">
              <p>
                There are women who follow the light <br />
                and there are women who become it.
              </p>
              <p>
                The founder of Moh Tee Flair, has always belonged to the second kind.
              </p>
              <p>
                Long before the world spoke her name, she carried an unspoken elegance:<br />
                a quiet confidence, a softness that did not diminish her strength,<br />
                and a presence that filled a room without raising its volume.
              </p>
              <p>
                She grew up understanding something most people miss —<br />
                that beauty is not decoration, it is identity.<br />
                Not the noise one puts on, but the radiance one reveals.
              </p>
              <p>
                Her life has been a study in contrasts:<br />
                power expressed softly, femininity held with intention,<br />
                discipline wrapped in grace.<br />
                It is this delicate balance that shaped her philosophy —<br />
                that true luxury whispers rather than shouts.<br />
                Moh Tee Flair was born from this truth.
              </p>
              <p>
                For her, beauty was never about altering the woman —<br />
                it was about elevating her essence.<br />
                She believed every woman holds a signature radiance,<br />
                a light that cannot be imitated or taught.<br />
                It simply needs to be sculpted.
              </p>
              <p>
                Guided by this belief, she envisioned Moh Tee Flair not as a cosmetics brand,<br />
                but as a legacy house — a maison of radiance.<br />
                A place where formulas meet artistry,<br />
                where science meets softness,<br />
                where every detail is deliberate, rare, and quietly powerful.
              </p>
              <p>
                Her approach to luxury is intimate.<br />
                Nothing mass-made.<br />
                Nothing loud.<br />
                Every product is a ritual.<br />
                Every bottle, a piece of couture.<br />
                Every formula, an homage to the modern woman who leads with elegance.
              </p>
              <p>
                Today, Moh Tee Flair stands as the embodiment of Her philosophy:<br />
                that beauty is not what you chase —<br />
                it is what rises from within when your identity is honored.
              </p>
              <p>
                And so her legacy begins,<br />
                not with noise, but with illumination.<br />
                Not with trends, but with timelessness.<br />
                Not with a brand, but with a signature.
              </p>
            </div>
            <Link to="/products" className="btn btn-primary mt-8" id="about-shop-btn">
              Explore the Collection <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section about-values">
        <div className="about-values__bg" />
        <div className="container">
          <div className="text-center mb-12">
            <span className="section-label">What We Stand For</span>
            <h2 className="heading-xl">Our Core Values</h2>
          </div>
          <div className="about-values__grid">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                className="value-card card-glass"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="value-card__icon">{v.icon}</div>
                <h3 className="value-card__title">{v.title}</h3>
                <p className="value-card__desc">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section about-timeline">
        <div className="container">
          <div className="text-center mb-12">
            <span className="section-label">Our Journey</span>
            <h2 className="heading-xl gradient-text">Milestones</h2>
          </div>
          <div className="timeline">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                className={`timeline-item ${i % 2 === 0 ? 'timeline-item--left' : 'timeline-item--right'}`}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="timeline-item__dot" />
                <div className="timeline-item__card card-glass">
                  <span className="timeline-item__year">{m.year}</span>
                  <p className="timeline-item__event">{m.event}</p>
                </div>
              </motion.div>
            ))}
            <div className="timeline__line" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta section-sm">
        <div className="container">
          <motion.div
            className="about-cta__inner"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="about-cta__glow" />
            <Sparkles size={28} color="var(--rg-gold)" />
            <h2 className="heading-lg text-center mt-4 gradient-text">Be Part of the Story</h2>
            <p className="about-cta__sub">
              Join thousands of women who have chosen Moh Tee Flair as their luxury beauty companion.
            </p>
            <div className="hero__btns justify-center mt-8">
              <Link to="/products" className="btn btn-primary" id="about-cta-shop">Shop Now</Link>
              <Link to="/contact" className="btn btn-outline" id="about-cta-contact">Get in Touch</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
