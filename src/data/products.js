export const categories = [
  { id: 'all', label: 'All Products' },
  { id: 'lips', label: 'Lips' },
  { id: 'face', label: 'Face' },
  { id: 'tools', label: 'Makeup Tools' },
  { id: 'sponges', label: 'Sponges' },
  { id: 'bags', label: 'Bags' },
  { id: 'skincare', label: 'Skin Care' },
];

export const products = [
  // ─── LIPS ───────────────────────────────────────────────
  {
    id: 1, category: 'lips', name: 'MTF Liquid Lipstick', price: 91.71,
    img: '/images/products/lips/MTF Liquid Lipstick.png',
    desc: 'Long-wearing liquid lipstick with a rich, creamy finish. Stays vibrant all day with a single swipe.',
    featured: true,
  },
  {
    id: 2, category: 'lips', name: 'MTF Liquid Lipstick II', price: 91.71,
    img: '/images/products/lips/MTF Liquid Lipstick II.png',
    desc: 'Second edition of our bestselling liquid lipstick in deeper, bolder shades for the night.',
    featured: false,
  },
  {
    id: 3, category: 'lips', name: 'MTF Liquid Lipstick Collection', price: 110.06,
    img: '/images/products/lips/MTF LIQUID LIPSTICK 2.png',
    desc: 'A curated set of our most-loved liquid lipstick shades — the perfect gift-ready collection.',
    featured: true,
  },
  {
    id: 4, category: 'lips', name: 'MTF Lip Balm', price: 47.67,
    img: '/images/products/lips/MTF Lip Balm.png',
    desc: 'Nourishing lip balm infused with botanical oils. Soft, hydrated lips from morning to night.',
    featured: false,
  },
  {
    id: 5, category: 'lips', name: 'MTF Lip Gloss', price: 69.69,
    img: '/images/products/lips/MTF Lip Gloss.png',
    desc: 'High-shine lip gloss for that irresistible, plump pout. Non-sticky formula with mirror finish.',
    featured: false,
  },
  {
    id: 6, category: 'lips', name: 'MTF Lipstick', price: 84.37,
    img: '/images/products/lips/MTF Lipstick.png',
    desc: 'Classic bullet lipstick in luxurious satin finish. Creamy, pigmented, and effortlessly bold.',
    featured: true,
  },

  // ─── FACE ────────────────────────────────────────────────
  {
    id: 7, category: 'face', name: 'MTF Foundation', price: 128.41,
    img: '/images/products/face/MTF Foundation.png',
    desc: 'Full-coverage foundation that blends seamlessly. 24-hour wear with a natural skin-like finish.',
    featured: true,
  },
  {
    id: 8, category: 'face', name: 'MTF Hydration Cream', price: 165.11,
    img: '/images/products/face/MTF Hydration Cream.png',
    desc: 'Deep moisture cream with hyaluronic acid complex. Plumps, firms, and luminously transforms skin.',
    featured: true,
  },
  {
    id: 9, category: 'face', name: 'MTF Primer', price: 110.06,
    img: '/images/products/face/MTF Primer.png',
    desc: 'Silky-smooth primer that creates the perfect blank canvas. Minimizes pores and extends makeup wear.',
    featured: false,
  },
  {
    id: 10, category: 'face', name: 'MTF Setting Spray', price: 99.05,
    img: '/images/products/face/MTF Setting Spray.png',
    desc: 'Locking mist that locks in your look for 16+ hours. Adds a breathable, natural fresh finish.',
    featured: false,
  },
  {
    id: 11, category: 'face', name: 'MTF Toner', price: 91.71,
    img: '/images/products/face/MTF Toner.png',
    desc: 'Balancing toner that refines skin texture and preps your complexion for optimal product absorption.',
    featured: false,
  },

  // ─── TOOLS ───────────────────────────────────────────────
  {
    id: 12, category: 'tools', name: 'MTF Eyeshadow Palette', price: 146.76,
    img: '/images/products/tools/MTF Eyeshadow.png',
    desc: 'Richly pigmented eyeshadow palette with 12 versatile shades — from soft nudes to dramatic darks.',
    featured: true,
  },
  {
    id: 13, category: 'tools', name: 'MTF Liquid Felt-Tip Eyeliner', price: 62.35,
    img: '/images/products/tools/MTF Liquid Felt-Tip Eyeliner Pen.png',
    desc: 'Precision felt-tip liner for flawless wings. Intense black pigment that dries instantly.',
    featured: false,
  },
  {
    id: 14, category: 'tools', name: 'MTF Makeup Brush Set', price: 73.36,
    img: '/images/products/tools/MTF Makeup Brush.png',
    desc: 'Professional-grade synthetic bristle brush for seamless blending and flawless application.',
    featured: false,
  },
  {
    id: 15, category: 'tools', name: 'MTF Mascara', price: 80.70,
    img: '/images/products/tools/MTF Mascara.png',
    desc: 'Volumizing and lengthening mascara. Buildable, clump-free formula for dramatic defined lashes.',
    featured: true,
  },
  {
    id: 16, category: 'tools', name: 'MTF Pressed Powder', price: 102.72,
    img: '/images/products/tools/MTF Pressed Powder.png',
    desc: 'Ultra-fine pressed powder for a matte, porcelain finish. Sets makeup and controls shine all day.',
    featured: false,
  },
  {
    id: 17, category: 'tools', name: 'Angled Eyeliner Brush', price: 44.00,
    img: '/images/products/tools/Angeled Eyeline Brush.png',
    desc: 'Precise angled brush ideal for creating sharp liner looks and defined brows.',
    featured: false,
  },
  {
    id: 18, category: 'tools', name: 'Crease Brush', price: 44.00,
    img: '/images/products/tools/Crease Brush.png',
    desc: 'Tapered crease brush perfect for blending and sculpting eyeshadow in the crease.',
    featured: false,
  },
  {
    id: 19, category: 'tools', name: 'Flat Eyeshadow Brush', price: 40.33,
    img: '/images/products/tools/Flat Eyeshadow Brush.png',
    desc: 'Flat paddle brush for packing and depositing vibrant eyeshadow colour on the lid.',
    featured: false,
  },
  {
    id: 20, category: 'tools', name: 'Smudge Brush', price: 36.66,
    img: '/images/products/tools/Smudge Brush.png',
    desc: 'Compact smudge brush to effortlessly blend liner and shadow for a smoky, sultry look.',
    featured: false,
  },
  {
    id: 21, category: 'tools', name: 'Spoolie Brush', price: 32.99,
    img: '/images/products/tools/Spoolie Brush.png',
    desc: 'Dual-purpose spoolie for grooming brows and separating lashes after mascara application.',
    featured: false,
  },

  // ─── SPONGES ─────────────────────────────────────────────
  {
    id: 22, category: 'sponges', name: 'MTF Blending Sponge I', price: 55.01,
    img: '/images/products/sponges/MTF Makeup Blending Sponge  1.png',
    desc: 'Velvety micro-foam sponge for seamless foundation blending. Use damp for a skin-like finish.',
    featured: true,
  },
  {
    id: 23, category: 'sponges', name: 'MTF Blending Sponge II', price: 55.01,
    img: '/images/products/sponges/MTF Makeup Blending Sponge 2.png',
    desc: 'Tear-drop shaped sponge with dual texture zones for targeted and overall coverage.',
    featured: false,
  },
  {
    id: 24, category: 'sponges', name: 'MTF Blending Sponge III', price: 55.01,
    img: '/images/products/sponges/MTF Makeup Blending Sponge 3.png',
    desc: 'Flat-edge sponge for under-eye concealer and precise contour blending.',
    featured: false,
  },
  {
    id: 25, category: 'sponges', name: 'MTF Blending Sponge IV', price: 55.01,
    img: '/images/products/sponges/MTF Makeup Blending Sponge 4.png',
    desc: 'Extra-large sponge for full-face application and an airbrushed, streak-free effect.',
    featured: false,
  },
  {
    id: 26, category: 'sponges', name: 'MTF Blending Sponge V', price: 55.01,
    img: '/images/products/sponges/MTF Makeup Blending Sponge 5.png',
    desc: 'Silicone-infused sponge that minimizes product waste while maximizing coverage.',
    featured: false,
  },
  {
    id: 27, category: 'sponges', name: 'MTF Blending Sponge VI', price: 55.01,
    img: '/images/products/sponges/MTF Makeup Blending Sponge 6.png',
    desc: 'Mini precision sponge perfect for corners, around the nose, and detail work.',
    featured: false,
  },

  // ─── BAGS ────────────────────────────────────────────────
  {
    id: 28, category: 'bags', name: 'MTF Makeup Bag I', price: 121.07,
    img: '/images/products/bags/MTF Makeup Bag 1.png',
    desc: 'Chic travel makeup bag with rose gold hardware and spacious compartments for all your essentials.',
    featured: true,
  },
  {
    id: 29, category: 'bags', name: 'MTF Makeup Bag II', price: 135.75,
    img: '/images/products/bags/MTF Makeup Bag 2.png',
    desc: 'Premium large-capacity organizer bag. Ideal for professional makeup artists and beauty enthusiasts.',
    featured: false,
  },
  {
    id: 30, category: 'bags', name: 'MTF Makeup Bag III', price: 106.39,
    img: '/images/products/bags/MTF Makeup Bag 3.png',
    desc: 'Sleek compact pouch for everyday essentials. Lightweight, washable lining, and timeless design.',
    featured: false,
  },

  // ─── SKINCARE ────────────────────────────────────────────
  {
    id: 31, category: 'skincare', name: 'MTF Body Oil', price: 128.41,
    img: '/images/products/skincare/MTF Body Oil.png',
    desc: 'Luxurious dry body oil enriched with rosehip and argan. Absorbs instantly leaving skin silky and luminous.',
    featured: true,
  },
  {
    id: 32, category: 'skincare', name: 'MTF Serums', price: 183.46,
    img: '/images/products/skincare/MTF Serums.png',
    desc: 'Advanced brightening serum with vitamin C and niacinamide. Visibly reduces dark spots in 4 weeks.',
    featured: true,
  },
  {
    id: 33, category: 'skincare', name: 'MTF Shower Gel', price: 73.36,
    img: '/images/products/skincare/MTF Shower Gel.png',
    desc: 'Nourishing shower gel with floral extracts and shea butter. A luxurious lather that leaves skin soft.',
    featured: false,
  },
  {
    id: 34, category: 'skincare', name: 'MTF Luxury Soap', price: 55.01,
    img: '/images/products/skincare/MTF Soap.png',
    desc: 'Artisan cold-press soap enriched with kaolin clay and essential oils. Gently purifies and protects.',
    featured: false,
  },
];

export const featuredProducts = products.filter(p => p.featured);
