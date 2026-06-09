/**
 * ================================================================
 *  BuildSol Hardware — Category Page JavaScript
 *  Fully self-contained: Cart, Wishlist, Filters, Search,
 *  Quick-View, Toast, Newsletter, Nav, Pagination, Sort,
 *  View-toggle, Deal timer, Scroll-top, Mobile Nav
 * ================================================================
 */
'use strict';

/* ───────────────────────────────────────────────────────────────
   CATEGORY DATA
   Add / edit categories here. Each product has:
   id, name, brand, subcat, price (cents), rating, ratingCount,
   badge ('sale'|'new'|'bestseller'|'promo'|'bundle'|''),
   discount (%), inStock, icon (FA class), bgColor (CSS colour pair)
─────────────────────────────────────────────────────────────── */
const CATEGORIES = {

  plumbing: {
    title:       'Plumbing',
    description: 'Professional-grade pipes, fittings, taps, geysers and drainage — everything a plumber or builder needs.',
    icon:        'fas fa-faucet-drip',
    productCount:'2,400+',
    saleCount:   '320+',
    dealTag:     'Plumbing Week',
    dealTitle:   'Plumbing Week Sale',
    dealDesc:    'Save big on pipes, fittings, geysers and sanitary ware. Trade & retail pricing available.',
    dealDiscount:'30%',
    dealItems:   '320',
    dealDays:    5,
    brands: ['Cobra','Marley','Grohe','Kwikot','Geberit','Henco','Roca','Valsir'],
    subcats: [
      { id:'pipes',    label:'Pipes & Tubes',       icon:'fas fa-pipe-section', desc:'uPVC, copper, galvanized' },
      { id:'fittings', label:'Fittings',             icon:'fas fa-screwdriver',  desc:'Elbows, tees, reducers'   },
      { id:'taps',     label:'Taps & Valves',        icon:'fas fa-faucet',       desc:'Ball valves, mixers'      },
      { id:'sanitary', label:'Sanitary Ware',        icon:'fas fa-toilet',       desc:'Toilets, basins, cisterns'},
      { id:'geysers',  label:'Geysers & Heating',   icon:'fas fa-fire-burner',  desc:'Solar, electric, gas'     },
      { id:'showers',  label:'Showers & Baths',     icon:'fas fa-shower',       desc:'Enclosures, trays'        },
      { id:'drainage', label:'Drainage Systems',    icon:'fas fa-droplet',      desc:'Gutters, channels'        },
      { id:'tools',    label:'Plumbing Tools',      icon:'fas fa-wrench',       desc:'Cutters, wrenches, sealants' },
    ],
    products: [
      { id:'pl01', name:'uPVC Pressure Pipe Class 9 — 20mm × 6m', brand:'Marley',  subcat:'pipes',    price:8999,   rating:4.8, ratingCount:124, badge:'sale',       discount:18, inStock:true,  icon:'fas fa-pipe-section',  bg:'linear-gradient(135deg,#e6f0fa,#b3cce8)', iconColor:'#1a3a66' },
      { id:'pl02', name:'Single Lever Basin Mixer Tap Chrome',      brand:'Cobra',   subcat:'taps',     price:54900,  rating:4.5, ratingCount:89,  badge:'bestseller', discount:0,  inStock:true,  icon:'fas fa-faucet',        bg:'linear-gradient(135deg,#fff2cc,#ffe699)', iconColor:'#8c6500' },
      { id:'pl03', name:'Multilayer PEX Pipe 16mm — 50m Roll',      brand:'Henco',   subcat:'pipes',    price:124900, rating:4.9, ratingCount:37,  badge:'new',        discount:0,  inStock:true,  icon:'fas fa-pipe-section',  bg:'linear-gradient(135deg,#e6f0fa,#7fa8d4)', iconColor:'#0f2240' },
      { id:'pl04', name:'150L Solar Geyser System — Complete Kit',  brand:'Kwikot',  subcat:'geysers',  price:899900, rating:4.9, ratingCount:211, badge:'sale',       discount:25, inStock:true,  icon:'fas fa-fire-burner',   bg:'linear-gradient(135deg,#e8f5e9,#c8e6c9)', iconColor:'#2e7d32' },
      { id:'pl05', name:'Close-Coupled WC Suite — White',           brand:'Roca',    subcat:'sanitary', price:179900, rating:4.4, ratingCount:66,  badge:'',           discount:0,  inStock:true,  icon:'fas fa-toilet',        bg:'linear-gradient(135deg,#fce4ec,#f8bbd0)', iconColor:'#c62828' },
      { id:'pl06', name:'15mm Compression Straight Coupling Brass', brand:'Cobra',   subcat:'fittings', price:1850,   rating:4.9, ratingCount:302, badge:'sale',       discount:12, inStock:true,  icon:'fas fa-screwdriver',   bg:'linear-gradient(135deg,#f3f4f6,#e5e7eb)', iconColor:'#374151' },
      { id:'pl07', name:'Grohtherm Thermostatic Shower Mixer',      brand:'Grohe',   subcat:'showers',  price:329900, rating:4.9, ratingCount:153, badge:'bestseller', discount:0,  inStock:true,  icon:'fas fa-shower',        bg:'linear-gradient(135deg,#e3f2fd,#bbdefb)', iconColor:'#1565c0' },
      { id:'pl08', name:'Concealed Cistern Frame — Dual Flush',     brand:'Geberit', subcat:'sanitary', price:245000, rating:4.4, ratingCount:44,  badge:'',           discount:0,  inStock:false, icon:'fas fa-toilet',        bg:'linear-gradient(135deg,#e6f0fa,#b3cce8)', iconColor:'#2563a8' },
      { id:'pl09', name:'50mm ABS Drainage Trap P-Bend',            brand:'Marley',  subcat:'drainage', price:7900,   rating:4.6, ratingCount:78,  badge:'',           discount:0,  inStock:true,  icon:'fas fa-droplet',       bg:'linear-gradient(135deg,#e6f0fa,#b3cce8)', iconColor:'#1e4d8c' },
      { id:'pl10', name:'Pipe Cutter Ratchet 15–42mm',              brand:'Cobra',   subcat:'tools',    price:34900,  rating:4.7, ratingCount:55,  badge:'new',        discount:0,  inStock:true,  icon:'fas fa-wrench',        bg:'linear-gradient(135deg,#f3f4f6,#d1d5db)', iconColor:'#374151' },
      { id:'pl11', name:'PTFE Thread Seal Tape 12m Roll',           brand:'Cobra',   subcat:'tools',    price:2499,   rating:4.5, ratingCount:190, badge:'',           discount:0,  inStock:true,  icon:'fas fa-wrench',        bg:'linear-gradient(135deg,#f3f4f6,#e5e7eb)', iconColor:'#6b7280' },
      { id:'pl12', name:'Ball Valve 32mm Threaded — Brass',         brand:'Henco',   subcat:'taps',     price:18900,  rating:4.8, ratingCount:88,  badge:'sale',       discount:10, inStock:true,  icon:'fas fa-faucet',        bg:'linear-gradient(135deg,#fff2cc,#ffd666)', iconColor:'#6b4d00' },
    ],
  },

  electrical: {
    title:       'Electrical',
    description: 'Cables, DB boards, lighting, switches, sockets and solar components — specified and tested for South African standards.',
    icon:        'fas fa-plug-circle-bolt',
    productCount:'1,800+',
    saleCount:   '210+',
    dealTag:     'Electrical Special',
    dealTitle:   'Electrical Clearance',
    dealDesc:    'Save on cables, DB boards, LED lighting and solar essentials. SANS-approved stock.',
    dealDiscount:'25%',
    dealItems:   '210',
    dealDays:    3,
    brands: ['Schneider','ABB','Crabtree','Osram','Philips','Legrand','Eaton','GE'],
    subcats: [
      { id:'cable',    label:'Cable & Wire',       icon:'fas fa-plug',             desc:'PVC, armoured, flexible'    },
      { id:'db',       label:'DB Boards & MCBs',   icon:'fas fa-server',           desc:'4-way to 24-way boards'     },
      { id:'lighting', label:'Lighting & LED',     icon:'fas fa-lightbulb',        desc:'Downlights, strips, panels' },
      { id:'sockets',  label:'Sockets & Switches', icon:'fas fa-toggle-on',        desc:'Single, double, USB'        },
      { id:'solar',    label:'Solar & Inverters',  icon:'fas fa-solar-panel',      desc:'Panels, inverters, batteries'},
      { id:'conduit',  label:'Conduit & Trunking', icon:'fas fa-pipe-section',     desc:'PVC, steel, flexible'       },
      { id:'tools',    label:'Electrical Tools',   icon:'fas fa-screwdriver-wrench',desc:'Testers, crimpers, pliers' },
      { id:'safety',   label:'Safety & Protection',icon:'fas fa-shield-halved',    desc:'Surge, earth leakage, RCDs' },
    ],
    products: [
      { id:'el01', name:'2.5mm Twin & Earth Cable — 50m Drum',       brand:'Crabtree',  subcat:'cable',    price:149900, rating:4.8, ratingCount:201, badge:'sale',       discount:15, inStock:true,  icon:'fas fa-plug',              bg:'linear-gradient(135deg,#fffde7,#fff176)', iconColor:'#f57f17' },
      { id:'el02', name:'Square D 8-Way Flush DB Board with Cover',  brand:'Schneider', subcat:'db',       price:89900,  rating:4.7, ratingCount:133, badge:'bestseller', discount:0,  inStock:true,  icon:'fas fa-server',            bg:'linear-gradient(135deg,#e8eaf6,#c5cae9)', iconColor:'#283593' },
      { id:'el03', name:'LED Recessed Downlight 10W 4000K — Twin',   brand:'Osram',     subcat:'lighting', price:18900,  rating:4.6, ratingCount:88,  badge:'sale',       discount:20, inStock:true,  icon:'fas fa-lightbulb',         bg:'linear-gradient(135deg,#fff9c4,#fff176)', iconColor:'#f9a825' },
      { id:'el04', name:'2-Gang USB-A+C Socket White',               brand:'Legrand',   subcat:'sockets',  price:24900,  rating:4.9, ratingCount:54,  badge:'new',        discount:0,  inStock:true,  icon:'fas fa-toggle-on',         bg:'linear-gradient(135deg,#e3f2fd,#bbdefb)', iconColor:'#0d47a1' },
      { id:'el05', name:'3kW Inverter + 100Ah LiFePO4 Battery Kit',  brand:'Eaton',     subcat:'solar',    price:1499900,rating:4.8, ratingCount:29,  badge:'sale',       discount:12, inStock:true,  icon:'fas fa-solar-panel',       bg:'linear-gradient(135deg,#e8f5e9,#a5d6a7)', iconColor:'#1b5e20' },
      { id:'el06', name:'20mm Grey PVC Conduit — 3m Length',         brand:'ABB',       subcat:'conduit',  price:4900,   rating:4.5, ratingCount:142, badge:'',           discount:0,  inStock:true,  icon:'fas fa-pipe-section',      bg:'linear-gradient(135deg,#eceff1,#cfd8dc)', iconColor:'#546e7a' },
      { id:'el07', name:'Digital Clamp Meter 600A AC/DC',            brand:'Eaton',     subcat:'tools',    price:64900,  rating:4.7, ratingCount:47,  badge:'',           discount:0,  inStock:true,  icon:'fas fa-screwdriver-wrench',bg:'linear-gradient(135deg,#fce4ec,#ef9a9a)', iconColor:'#b71c1c' },
      { id:'el08', name:'30mA Earth Leakage Unit 63A Double Pole',   brand:'Crabtree',  subcat:'safety',   price:44900,  rating:4.9, ratingCount:98,  badge:'bestseller', discount:0,  inStock:true,  icon:'fas fa-shield-halved',     bg:'linear-gradient(135deg,#e8eaf6,#9fa8da)', iconColor:'#1a237e' },
      { id:'el09', name:'16A Single Phase MCB — 10kA (Pack of 5)',   brand:'Schneider', subcat:'db',       price:24900,  rating:4.8, ratingCount:175, badge:'sale',       discount:18, inStock:true,  icon:'fas fa-server',            bg:'linear-gradient(135deg,#e3f2fd,#90caf9)', iconColor:'#0d47a1' },
      { id:'el10', name:'LED Strip Light 12V 5m Warm White IP20',    brand:'Philips',   subcat:'lighting', price:29900,  rating:4.5, ratingCount:63,  badge:'new',        discount:0,  inStock:true,  icon:'fas fa-lightbulb',         bg:'linear-gradient(135deg,#fff9c4,#fff59d)', iconColor:'#f57f17' },
      { id:'el11', name:'4mm Green/Yellow Earth Cable — 10m Coil',   brand:'Crabtree',  subcat:'cable',    price:8900,   rating:4.6, ratingCount:89,  badge:'',           discount:0,  inStock:true,  icon:'fas fa-plug',              bg:'linear-gradient(135deg,#e8f5e9,#c8e6c9)', iconColor:'#2e7d32' },
      { id:'el12', name:'400W Monocrystalline Solar Panel 24V',      brand:'GE',        subcat:'solar',    price:349900, rating:4.7, ratingCount:41,  badge:'',           discount:0,  inStock:false, icon:'fas fa-solar-panel',       bg:'linear-gradient(135deg,#e8eaf6,#c5cae9)', iconColor:'#1a237e' },
    ],
  },

  'power-tools': {
    title:       'Power Tools',
    description: 'Professional drills, grinders, saws, and accessories from the world\'s leading power tool brands.',
    icon:        'fas fa-screwdriver-wrench',
    productCount:'1,200+',
    saleCount:   '180+',
    dealTag:     'Tool Blowout',
    dealTitle:   'Power Tool Sale',
    dealDesc:    'Up to 30% off DeWalt, Bosch, Makita and Milwaukee. Professional and DIY ranges.',
    dealDiscount:'30%',
    dealItems:   '180',
    dealDays:    7,
    brands: ['DeWalt','Bosch','Makita','Milwaukee','Ryobi','Metabo','Festool','Hilti'],
    subcats: [
      { id:'drills',   label:'Drills & Drivers',   icon:'fas fa-drill',             desc:'Cordless, SDS, impact'      },
      { id:'saws',     label:'Saws & Cutters',     icon:'fas fa-saw',               desc:'Circular, jig, reciprocating'},
      { id:'grinders', label:'Grinders',           icon:'fas fa-circle-notch',      desc:'Angle, bench, die grinders' },
      { id:'routers',  label:'Routers & Sanders',  icon:'fas fa-hand-fist',         desc:'Routers, orbital, belts'    },
      { id:'combo',    label:'Combo Kits',         icon:'fas fa-toolbox',           desc:'Multi-tool bundles'         },
      { id:'access',   label:'Accessories',        icon:'fas fa-gears',             desc:'Blades, bits, discs'        },
      { id:'measure',  label:'Measuring Tools',    icon:'fas fa-ruler-combined',    desc:'Laser levels, tape measures'},
      { id:'safety',   label:'Safety & PPE',       icon:'fas fa-hard-hat',          desc:'Goggles, gloves, hearing'   },
    ],
    products: [
      { id:'pt01', name:'DeWalt 18V XR Brushless Combi Drill + Case',  brand:'DeWalt',   subcat:'drills',   price:349900, rating:4.9, ratingCount:312, badge:'bestseller', discount:0,  inStock:true,  icon:'fas fa-drill',            bg:'linear-gradient(135deg,#fffde7,#ffee58)', iconColor:'#f57f17' },
      { id:'pt02', name:'Bosch GWS 900-100 4" Angle Grinder 900W',     brand:'Bosch',    subcat:'grinders', price:149900, rating:4.7, ratingCount:201, badge:'sale',       discount:20, inStock:true,  icon:'fas fa-circle-notch',     bg:'linear-gradient(135deg,#e3f2fd,#90caf9)', iconColor:'#0d47a1' },
      { id:'pt03', name:'Makita 18V LXT Circular Saw 165mm Blade',     brand:'Makita',   subcat:'saws',     price:279900, rating:4.8, ratingCount:156, badge:'',           discount:0,  inStock:true,  icon:'fas fa-saw',              bg:'linear-gradient(135deg,#e8f5e9,#a5d6a7)', iconColor:'#1b5e20' },
      { id:'pt04', name:'Milwaukee M18 FUEL 5-Tool Combo Kit',         brand:'Milwaukee',subcat:'combo',    price:1099900,rating:4.9, ratingCount:87,  badge:'sale',       discount:15, inStock:true,  icon:'fas fa-toolbox',          bg:'linear-gradient(135deg,#fce4ec,#ef9a9a)', iconColor:'#b71c1c' },
      { id:'pt05', name:'Ryobi 18V ONE+ Orbital Sander + Dust Bag',    brand:'Ryobi',    subcat:'routers',  price:89900,  rating:4.5, ratingCount:98,  badge:'new',        discount:0,  inStock:true,  icon:'fas fa-hand-fist',        bg:'linear-gradient(135deg,#e8f5e9,#c8e6c9)', iconColor:'#33691e' },
      { id:'pt06', name:'Bosch SDS-Plus Rotary Hammer Drill 800W',     brand:'Bosch',    subcat:'drills',   price:199900, rating:4.7, ratingCount:134, badge:'',           discount:0,  inStock:true,  icon:'fas fa-drill',            bg:'linear-gradient(135deg,#e3f2fd,#bbdefb)', iconColor:'#0d47a1' },
      { id:'pt07', name:'DeWalt 40-Piece Drill & Screwdriver Bit Set',  brand:'DeWalt',   subcat:'access',   price:29900,  rating:4.8, ratingCount:289, badge:'sale',       discount:25, inStock:true,  icon:'fas fa-gears',            bg:'linear-gradient(135deg,#fffde7,#fff176)', iconColor:'#e65100' },
      { id:'pt08', name:'Festool Kapex KS 60 Compound Mitre Saw',       brand:'Festool',  subcat:'saws',     price:1999900,rating:4.9, ratingCount:22,  badge:'',           discount:0,  inStock:false, icon:'fas fa-saw',              bg:'linear-gradient(135deg,#fce4ec,#f48fb1)', iconColor:'#880e4f' },
      { id:'pt09', name:'Hilti PR 30-HVS Rotating Laser Level Kit',    brand:'Hilti',    subcat:'measure',  price:499900, rating:4.9, ratingCount:34,  badge:'new',        discount:0,  inStock:true,  icon:'fas fa-ruler-combined',   bg:'linear-gradient(135deg,#fff3e0,#ffcc80)', iconColor:'#bf360c' },
      { id:'pt10', name:'Metabo HPT 36V MultiVolt Recipro Saw',        brand:'Metabo',   subcat:'saws',     price:249900, rating:4.7, ratingCount:61,  badge:'',           discount:0,  inStock:true,  icon:'fas fa-saw',              bg:'linear-gradient(135deg,#e8eaf6,#9fa8da)', iconColor:'#283593' },
      { id:'pt11', name:'3M Peltor Half-Mask Respirator P3',            brand:'Makita',   subcat:'safety',   price:18900,  rating:4.6, ratingCount:77,  badge:'',           discount:0,  inStock:true,  icon:'fas fa-hard-hat',         bg:'linear-gradient(135deg,#f3f4f6,#e5e7eb)', iconColor:'#374151' },
      { id:'pt12', name:'Milwaukee 50m Self-Levelling Laser Level',    brand:'Milwaukee',subcat:'measure',  price:149900, rating:4.8, ratingCount:45,  badge:'sale',       discount:10, inStock:true,  icon:'fas fa-ruler-combined',   bg:'linear-gradient(135deg,#fce4ec,#ef9a9a)', iconColor:'#c62828' },
    ],
  },

  'building-materials': {
    title:       'Building Materials',
    description: 'Cement, steel, timber, bricks, roofing, and finishing materials — trusted brands, bulk pricing available.',
    icon:        'fas fa-bricks',
    productCount:'3,100+',
    saleCount:   '400+',
    dealTag:     'Builder\'s Special',
    dealTitle:   'Builder\'s Clearance',
    dealDesc:    'Bulk pricing on cement, steel, timber and roofing. Delivery available on pallets.',
    dealDiscount:'20%',
    dealItems:   '400',
    dealDays:    10,
    brands: ['PPC','AfriSam','Safintra','SA Pine','Everite','Lafarge','MiTek','Corobrik'],
    subcats: [
      { id:'cement',   label:'Cement & Concrete',  icon:'fas fa-industry',      desc:'Bags, ready-mix, additives'   },
      { id:'steel',    label:'Steel & Reinforcing', icon:'fas fa-grip-lines',    desc:'Y-bars, mesh, angle iron'    },
      { id:'timber',   label:'Timber & Boards',    icon:'fas fa-tree',          desc:'SA Pine, OSB, plywood'        },
      { id:'roofing',  label:'Roofing & Gutters',  icon:'fas fa-house-chimney', desc:'IBR, corrugated, tiles'       },
      { id:'bricks',   label:'Bricks & Blocks',    icon:'fas fa-bricks',        desc:'Face brick, maxi, pavers'     },
      { id:'plaster',  label:'Plaster & Screeds',  icon:'fas fa-layer-group',   desc:'Render, DPC, waterproofing'   },
      { id:'insulation',label:'Insulation',        icon:'fas fa-snowflake',     desc:'Roof, wall, acoustic'         },
      { id:'fixing',   label:'Fixings & Adhesives',icon:'fas fa-bolt',          desc:'Anchors, screws, grout'       },
    ],
    products: [
      { id:'bm01', name:'PPC Surebuild 42.5N Cement 50kg Bag',        brand:'PPC',      subcat:'cement',    price:14900,  rating:4.8, ratingCount:520, badge:'bestseller', discount:0,  inStock:true,  icon:'fas fa-industry',     bg:'linear-gradient(135deg,#f9fafb,#e5e7eb)', iconColor:'#374151' },
      { id:'bm02', name:'Y10 High-Tensile Deformed Bar 6m',            brand:'AfriSam',  subcat:'steel',     price:18900,  rating:4.7, ratingCount:288, badge:'',           discount:0,  inStock:true,  icon:'fas fa-grip-lines',   bg:'linear-gradient(135deg,#eceff1,#cfd8dc)', iconColor:'#37474f' },
      { id:'bm03', name:'SA Pine 38×114 Structural Timber 4.8m',       brand:'SA Pine',  subcat:'timber',    price:8900,   rating:4.6, ratingCount:199, badge:'sale',       discount:12, inStock:true,  icon:'fas fa-tree',         bg:'linear-gradient(135deg,#e8f5e9,#c8e6c9)', iconColor:'#2e7d32' },
      { id:'bm04', name:'IBR Roofing Sheet 0.47mm — 3m Galvanised',    brand:'Safintra', subcat:'roofing',   price:24900,  rating:4.5, ratingCount:144, badge:'',           discount:0,  inStock:true,  icon:'fas fa-house-chimney',bg:'linear-gradient(135deg,#eceff1,#b0bec5)', iconColor:'#455a64' },
      { id:'bm05', name:'Maxi Brick Pack of 1000 — Delivery Included', brand:'Corobrik', subcat:'bricks',    price:899900, rating:4.9, ratingCount:73,  badge:'sale',       discount:8,  inStock:true,  icon:'fas fa-bricks',       bg:'linear-gradient(135deg,#fff3e0,#ffcc80)', iconColor:'#bf360c' },
      { id:'bm06', name:'Lafarge Plaster Slurry 40kg Bag',             brand:'Lafarge',  subcat:'plaster',   price:12900,  rating:4.4, ratingCount:112, badge:'',           discount:0,  inStock:true,  icon:'fas fa-layer-group',  bg:'linear-gradient(135deg,#f9fafb,#e5e7eb)', iconColor:'#6b7280' },
      { id:'bm07', name:'Isover Pink Rolls Roof Insulation 135mm',     brand:'Everite',  subcat:'insulation',price:69900,  rating:4.7, ratingCount:56,  badge:'new',        discount:0,  inStock:true,  icon:'fas fa-snowflake',    bg:'linear-gradient(135deg,#fce4ec,#f8bbd0)', iconColor:'#880e4f' },
      { id:'bm08', name:'12mm OSB Board 2440×1220mm',                  brand:'SA Pine',  subcat:'timber',    price:34900,  rating:4.6, ratingCount:87,  badge:'sale',       discount:15, inStock:true,  icon:'fas fa-tree',         bg:'linear-gradient(135deg,#fff3e0,#ffe0b2)', iconColor:'#e65100' },
      { id:'bm09', name:'M12 Chemical Anchor — 10 Stud Pack',          brand:'MiTek',    subcat:'fixing',    price:19900,  rating:4.8, ratingCount:131, badge:'',           discount:0,  inStock:true,  icon:'fas fa-bolt',         bg:'linear-gradient(135deg,#e3f2fd,#bbdefb)', iconColor:'#0d47a1' },
      { id:'bm10', name:'AfriSam ReadyMix Concrete 25kg — 40 Bag Plt', brand:'AfriSam',  subcat:'cement',    price:599900, rating:4.7, ratingCount:62,  badge:'sale',       discount:10, inStock:true,  icon:'fas fa-industry',     bg:'linear-gradient(135deg,#eceff1,#e0e0e0)', iconColor:'#424242' },
      { id:'bm11', name:'102mm Face Brick — 500 Pcs (Pallet)',         brand:'Corobrik', subcat:'bricks',    price:579900, rating:4.8, ratingCount:48,  badge:'new',        discount:0,  inStock:false, icon:'fas fa-bricks',       bg:'linear-gradient(135deg,#fff3e0,#ffab91)', iconColor:'#bf360c' },
      { id:'bm12', name:'Corrugated Asphalt Roofing Sheet 2m — Black', brand:'Safintra', subcat:'roofing',   price:18900,  rating:4.5, ratingCount:95,  badge:'',           discount:0,  inStock:true,  icon:'fas fa-house-chimney',bg:'linear-gradient(135deg,#eceff1,#90a4ae)', iconColor:'#263238' },
    ],
  },
};

/* ───────────────────────────────────────────────────────────────
   UTILITIES
─────────────────────────────────────────────────────────────── */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const fmt = (cents) =>
  'R\u202f' + (cents / 100).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const debounce = (fn, ms = 280) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

const lsGet = (k, fb = null) => { try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

/** Detect current category from <section data-category="..."> */
const detectCategory = () => {
  const el = qs('#pageHero');
  return (el?.dataset.category) || Object.keys(CATEGORIES)[0];
};

/* ───────────────────────────────────────────────────────────────
   TOAST
─────────────────────────────────────────────────────────────── */
const Toast = (() => {
  const stack = () => qs('#toast-stack');
  const ICONS  = { success:'fa-circle-check', error:'fa-circle-xmark', info:'fa-circle-info', warning:'fa-triangle-exclamation' };
  const COLORS = { success:'#10b981', error:'#ef4444', info:'#3b82f6', warning:'#f59e0b' };

  const show = (msg, type = 'success', ms = 3200) => {
    const t = document.createElement('div');
    t.className = 'toast';
    t.setAttribute('role','alert');
    t.innerHTML = `
      <i class="fas ${ICONS[type]} toast-icon" style="color:${COLORS[type]}"></i>
      <span class="toast-msg">${msg}</span>
      <button class="toast-close" aria-label="Dismiss"><i class="fas fa-xmark"></i></button>`;
    t.style.borderLeft = `4px solid ${COLORS[type]}`;
    stack().appendChild(t);

    requestAnimationFrame(() => t.classList.add('show'));

    const dismiss = () => {
      t.classList.remove('show');
      t.style.opacity = '0';
      setTimeout(() => t.remove(), 350);
    };
    t.querySelector('.toast-close').onclick = dismiss;
    const timer = setTimeout(dismiss, ms);
    t.addEventListener('mouseenter', () => clearTimeout(timer));
    t.addEventListener('mouseleave', () => setTimeout(dismiss, 1500));
  };

  return { show };
})();

/* ───────────────────────────────────────────────────────────────
   CART
─────────────────────────────────────────────────────────────── */
const Cart = (() => {
  const KEY = 'bs_cart_v2';
  let items = lsGet(KEY, []);

  const save = () => lsSet(KEY, items);
  const find = id => items.find(i => i.id === id);
  const qty  = ()  => items.reduce((s, i) => s + i.qty, 0);
  const total= ()  => items.reduce((s, i) => s + i.price * i.qty, 0);
  const FREE_SHIP = 150000; // R1 500 in cents

  /* badge */
  const syncBadge = () => {
    const q = qty();
    qsa('.cart-count, #cartBadge').forEach(el => {
      el.textContent = q;
      el.style.display = q > 0 ? '' : 'none';
    });
    const hc = qs('#cdHeadCount');
    if (hc) { hc.textContent = q > 0 ? q : ''; }
  };

  /* render drawer body */
  const renderDrawer = () => {
    const itemsEl  = qs('#cdItems');
    const footerEl = qs('#cdFooter');
    if (!itemsEl) return;

    syncBadge();

    if (!items.length) {
      itemsEl.innerHTML = `
        <div class="cd-empty">
          <i class="fas fa-cart-shopping"></i>
          <p>Your cart is empty</p>
          <span>Add some products to get started.</span>
        </div>`;
      footerEl.innerHTML = '';
      return;
    }

    itemsEl.innerHTML = items.map(it => `
      <div class="cd-item" data-id="${it.id}">
        <div class="cd-item-img">${it.image ? `<img src="${it.image}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-md)">` : `<i class="${it.icon || 'fas fa-box'}"></i>`}</div>
        <div class="cd-item-info">
          <div class="cd-item-brand">${it.brand}</div>
          <div class="cd-item-name" title="${it.name}">${it.name}</div>
          <div class="cd-item-row">
            <div class="cd-qty">
              <button class="cd-q-btn" data-id="${it.id}" data-d="-1" aria-label="Remove one">−</button>
              <span>${it.qty}</span>
              <button class="cd-q-btn" data-id="${it.id}" data-d="1" aria-label="Add one">+</button>
            </div>
            <span class="cd-item-price">${fmt(it.price * it.qty)}</span>
            <button class="cd-remove" data-id="${it.id}" aria-label="Remove ${it.name}"><i class="fas fa-trash-can"></i></button>
          </div>
        </div>
      </div>`).join('');

    /* wire qty & remove */
    qsa('.cd-q-btn', itemsEl).forEach(btn => {
      btn.onclick = () => changeQty(btn.dataset.id, +btn.dataset.d);
    });
    qsa('.cd-remove', itemsEl).forEach(btn => {
      btn.onclick = () => remove(btn.dataset.id);
    });

    /* shipping progress */
    const rem = FREE_SHIP - total();
    const pct = clamp((total() / FREE_SHIP) * 100, 0, 100);
    const shipHtml = rem > 0
      ? `<div class="cd-ship-bar">
           <p>Add <strong>${fmt(rem)}</strong> more for <strong>free delivery</strong>!</p>
           <div class="cd-ship-track"><div class="cd-ship-fill" style="width:${pct}%"></div></div>
         </div>`
      : `<p class="cd-ship-ok"><i class="fas fa-truck-fast"></i> You qualify for free delivery!</p>`;

    footerEl.innerHTML = `
      ${shipHtml}
      <div class="cd-totals">
        <span>Subtotal (${qty()} item${qty()!==1?'s':''})</span>
        <span>${fmt(total())}</span>
      </div>
      <p class="cd-note">Delivery calculated at checkout.</p>
      <button class="cd-checkout" id="cdCheckout"><i class="fas fa-lock"></i> Proceed to Checkout</button>
      <button class="cd-view" id="cdView">View Full Cart</button>`;

    qs('#cdCheckout').onclick = handleCheckout;
    qs('#cdView').onclick = closeDrawer;
  };

  /* open / close */
  const openDrawer = () => {
    renderDrawer();
    qs('#cart-overlay').classList.add('open');
    qs('#cart-drawer').classList.add('open');
    document.body.style.overflow = 'hidden';
    qs('#cart-drawer').focus();
  };
  const closeDrawer = () => {
    qs('#cart-overlay').classList.remove('open');
    qs('#cart-drawer').classList.remove('open');
    document.body.style.overflow = '';
  };

  const add = (product) => {
    const ex = find(product.id);
    if (ex) { ex.qty = clamp(ex.qty + (product.qty || 1), 1, 99); }
    else     { items.push({ qty: 1, ...product }); }
    save(); syncBadge(); renderDrawer();
    Toast.show(`<strong>${product.name}</strong> added to cart`, 'success');
  };

  const changeQty = (id, delta) => {
    const it = find(id);
    if (!it) return;
    it.qty = clamp(it.qty + delta, 1, 99);
    save(); syncBadge(); renderDrawer();
  };

  const remove = (id) => {
    const it = find(id);
    if (!it) return;
    items = items.filter(i => i.id !== id);
    save(); syncBadge(); renderDrawer();
    Toast.show(`<strong>${it.name}</strong> removed`, 'info', 2500);
  };

  const handleCheckout = () => {
    if (!items.length) { Toast.show('Your cart is empty!', 'warning'); return; }
    Toast.show('Redirecting to checkout…', 'info', 2000);
    setTimeout(() => { window.location.href = '#checkout'; }, 2000);
  };

  const init = () => {
    syncBadge();
    document.addEventListener('click', e => {
      if (e.target.closest('#cartToggle') || e.target.closest('[data-action="open-cart"]')) {
        e.preventDefault(); openDrawer();
      }
    });
    qs('#cdClose')?.addEventListener('click', closeDrawer);
    qs('#cart-overlay')?.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
  };

  return { init, add, openDrawer, closeDrawer, qty, total };
})();

/* ───────────────────────────────────────────────────────────────
   WISHLIST
─────────────────────────────────────────────────────────────── */
const Wishlist = (() => {
  const KEY = 'bs_wishlist_v2';
  let ids = new Set(lsGet(KEY, []));

  const save = () => lsSet(KEY, [...ids]);

  const toggle = (id, name) => {
    if (ids.has(id)) { ids.delete(id); Toast.show(`Removed from wishlist`, 'info', 2000); }
    else             { ids.add(id);    Toast.show(`<strong>${name}</strong> saved to wishlist`, 'success', 2000); }
    save(); sync();
  };

  const sync = () => {
    qsa('.wishlist-btn[data-id]').forEach(btn => {
      const on = ids.has(btn.dataset.id);
      btn.classList.toggle('active', on);
      const ic = btn.querySelector('i');
      if (ic) ic.className = on ? 'fas fa-heart' : 'far fa-heart';
    });
  };

  const init = () => {
    sync();
    document.addEventListener('click', e => {
      const btn = e.target.closest('.wishlist-btn[data-id]');
      if (!btn) return;
      e.preventDefault();
      const name = btn.closest('.product-card')?.querySelector('.product-name')?.textContent?.trim() || 'item';
      toggle(btn.dataset.id, name);
    });
  };

  return { init, has: id => ids.has(id), sync };
})();

/* ───────────────────────────────────────────────────────────────
   QUICK VIEW MODAL
─────────────────────────────────────────────────────────────── */
const QuickView = (() => {
  let currentQty = 1;

  const open = (product) => {
    currentQty = 1;
    const overlay = qs('#qv-overlay');
    const content = qs('#qvContent');

    const wishlisted = Wishlist.has(product.id);
    const origPrice  = product.discount ? product.price / (1 - product.discount / 100) : 0;

    content.innerHTML = `
      <div class="qv-img" style="background:${product.bg}">
        <i class="${product.icon}" style="color:${product.iconColor};font-size:5rem"></i>
      </div>
      <div class="qv-body">
        ${product.badge ? `<span class="badge ${product.badge}" style="width:fit-content;margin-bottom:.75rem">${product.badge === 'sale' ? `-${product.discount}%` : product.badge}</span>` : ''}
        <div class="qv-brand">${product.brand}</div>
        <h2 class="qv-name">${product.name}</h2>
        <div class="qv-rating">
          <span class="stars">${'★'.repeat(Math.round(product.rating))}${'☆'.repeat(5-Math.round(product.rating))}</span>
          <span style="font-size:.8rem;color:var(--gray-500)">${product.rating} (${product.ratingCount} reviews)</span>
        </div>
        <div class="qv-price">
          <span class="current-price">${fmt(product.price)}</span>
          ${product.discount ? `<span class="original-price">${fmt(origPrice)}</span>` : ''}
        </div>
        ${!product.inStock ? '<p style="color:var(--error);font-size:.875rem;font-weight:600;margin-bottom:.875rem"><i class="fas fa-circle-xmark"></i> Out of stock</p>' : ''}
        <div class="qv-qty-row" style="${!product.inStock ? 'opacity:.4;pointer-events:none' : ''}">
          <span style="font-family:var(--font-heading);font-size:.8125rem;font-weight:600;color:var(--gray-600)">Qty:</span>
          <div class="qty-ctrl">
            <button id="qvMinus" aria-label="Decrease quantity">−</button>
            <span id="qvQty">1</span>
            <button id="qvPlus" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div class="qv-actions" style="${!product.inStock ? 'opacity:.4;pointer-events:none' : ''}">
          <button class="add-to-cart" id="qvAddCart" style="flex:unset;padding:.875rem 1.25rem;border-radius:var(--radius-md);font-size:.9375rem">
            <i class="fas fa-cart-plus"></i> Add to Cart
          </button>
          <button class="buy-now" id="qvBuyNow" style="padding:.875rem 1.25rem;border-radius:var(--radius-md);font-size:.9375rem">
            <i class="fas fa-bolt"></i> Buy Now
          </button>
          <button class="wishlist-btn" data-id="${product.id}" style="width:100%;display:flex;align-items:center;justify-content:center;gap:.5rem;padding:.75rem;border-radius:var(--radius-md);background:var(--gray-100);border:none;font-family:var(--font-heading);font-size:.875rem;font-weight:600;cursor:pointer;color:var(--gray-700)">
            <i class="${wishlisted ? 'fas' : 'far'} fa-heart" style="color:var(--error)"></i>
            ${wishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}
          </button>
        </div>
      </div>`;

    /* qty controls */
    qs('#qvMinus').onclick = () => { currentQty = clamp(currentQty - 1, 1, 99); qs('#qvQty').textContent = currentQty; };
    qs('#qvPlus').onclick  = () => { currentQty = clamp(currentQty + 1, 1, 99); qs('#qvQty').textContent = currentQty; };

    if (product.inStock) {
      qs('#qvAddCart').onclick = () => { Cart.add({ ...product, qty: currentQty }); close(); };
      qs('#qvBuyNow').onclick  = () => { Cart.add({ ...product, qty: currentQty }); close(); setTimeout(Cart.openDrawer, 200); };
    }

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    qs('#qv-overlay').classList.remove('open');
    document.body.style.overflow = '';
  };

  const init = () => {
    qs('#qvClose')?.addEventListener('click', close);
    qs('#qv-overlay')?.addEventListener('click', e => { if (e.target === qs('#qv-overlay')) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  };

  return { init, open, close };
})();

/* ───────────────────────────────────────────────────────────────
   PRODUCT RENDERER + FILTER ENGINE
─────────────────────────────────────────────────────────────── */
const Products = (() => {
  const PER_PAGE = 8;
  let catData     = null;
  let allProducts = [];
  let filtered    = [];
  let currentPage = 1;
  let activeSubcat= 'all';   // chip filter
  let activeBrand = null;    // brand strip filter
  let sortBy      = 'featured';
  let priceMax    = Infinity;
  let filterBrands= new Set();
  let filterSubcats = new Set();
  let onlyInStock = true;
  let onlyOnSale  = false;

  /* ── build a product card ── */
  const cardHTML = (p) => {
    const wishlisted = Wishlist.has(p.id);
    const origPrice  = p.discount ? p.price / (1 - p.discount / 100) : 0;
    const badgeLabel = p.badge === 'sale' ? `-${p.discount}%` : p.badge;
    return `
      <article class="product-card" data-id="${p.id}" data-subcat="${p.subcat}" data-brand="${p.brand}">
        ${p.badge ? `<div class="product-badges"><span class="badge ${p.badge}">${badgeLabel}</span></div>` : ''}
        <button class="wishlist-btn" data-id="${p.id}" aria-label="${wishlisted ? 'Remove from' : 'Add to'} wishlist">
          <i class="${wishlisted ? 'fas' : 'far'} fa-heart"></i>
        </button>
        <div class="product-image" style="display:flex;align-items:center;justify-content:center;background:${p.bg}">
          <i class="${p.icon}" style="font-size:3.5rem;color:${p.iconColor}"></i>
        </div>
        <div class="product-info">
          <span class="product-brand">${p.brand}</span>
          <h3 class="product-name">${p.name}</h3>
          <div class="product-rating">
            <div class="stars">${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5-Math.round(p.rating))}</div>
            <span class="rating-count">(${p.ratingCount})</span>
          </div>
          <div class="product-price">
            <span class="current-price">${fmt(p.price)}</span>
            ${p.discount ? `<span class="original-price">${fmt(origPrice)}</span>` : ''}
          </div>
          ${!p.inStock ? '<p style="font-size:.8rem;color:var(--error);font-weight:600;margin-bottom:.5rem"><i class="fas fa-circle-xmark"></i> Out of stock</p>' : ''}
          <div class="product-actions">
            <button class="add-to-cart" data-id="${p.id}" ${!p.inStock ? 'disabled style="opacity:.5;cursor:not-allowed"' : ''}>
              <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
            <button class="buy-now" data-id="${p.id}" ${!p.inStock ? 'disabled style="opacity:.5;cursor:not-allowed"' : ''}>
              <i class="fas fa-bolt"></i> Buy
            </button>
            <button class="quick-view" data-id="${p.id}" aria-label="Quick view ${p.name}" title="Quick view">
              <i class="fas fa-eye"></i>
            </button>
          </div>
        </div>
      </article>`;
  };

  /* ── sort ── */
  const sortProducts = (list) => {
    const clone = [...list];
    if (sortBy === 'price-asc')  return clone.sort((a,b) => a.price - b.price);
    if (sortBy === 'price-desc') return clone.sort((a,b) => b.price - a.price);
    if (sortBy === 'rating')     return clone.sort((a,b) => b.rating - a.rating);
    if (sortBy === 'newest')     return clone.filter(p => p.badge === 'new').concat(clone.filter(p => p.badge !== 'new'));
    return clone; // featured
  };

  /* ── apply all filters ── */
  const applyFilters = () => {
    filtered = allProducts.filter(p => {
      if (onlyInStock && !p.inStock) return false;
      if (onlyOnSale  && !p.discount) return false;
      if (p.price > priceMax) return false;
      if (activeSubcat !== 'all' && p.subcat !== activeSubcat) return false;
      if (activeBrand  && p.brand !== activeBrand) return false;
      if (filterBrands.size   && !filterBrands.has(p.brand))   return false;
      if (filterSubcats.size  && !filterSubcats.has(p.subcat)) return false;
      return true;
    });
    filtered = sortProducts(filtered);
    currentPage = 1;
    render();
    updateActiveTags();
  };

  /* ── render page ── */
  const render = () => {
    const grid = qs('#productsGrid');
    if (!grid) return;

    const start  = (currentPage - 1) * PER_PAGE;
    const page   = filtered.slice(start, start + PER_PAGE);

    qs('#showingCount').textContent = page.length;
    qs('#totalCount').textContent   = filtered.length;

    if (!filtered.length) {
      grid.innerHTML = `
        <div class="no-results">
          <i class="fas fa-magnifying-glass"></i>
          <h3>No products found</h3>
          <p>Try adjusting your filters or search terms.</p>
        </div>`;
    } else {
      grid.innerHTML = page.map(cardHTML).join('');
      wireCards(grid);
    }

    renderPagination();
    Wishlist.sync();
  };

  /* ── wire add-to-cart / buy-now / quick-view on cards ── */
  const wireCards = (grid) => {
    qsa('.add-to-cart[data-id]', grid).forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const p = byId(btn.dataset.id);
        if (!p || !p.inStock) return;
        Cart.add({ ...p, qty: 1 });
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Added!';
        btn.classList.add('added');
        setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('added'); }, 1800);
      });
    });

    qsa('.buy-now[data-id]', grid).forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const p = byId(btn.dataset.id);
        if (!p || !p.inStock) return;
        Cart.add({ ...p, qty: 1 });
        setTimeout(Cart.openDrawer, 200);
      });
    });

    qsa('.quick-view[data-id]', grid).forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const p = byId(btn.dataset.id);
        if (p) QuickView.open(p);
      });
    });
  };

  /* ── pagination ── */
  const renderPagination = () => {
    const nav = qs('#paginationNav');
    if (!nav) return;
    const pages = Math.ceil(filtered.length / PER_PAGE);
    if (pages <= 1) { nav.innerHTML = ''; return; }

    let html = `<button class="pg-btn arrow" data-page="${currentPage-1}" ${currentPage===1?'disabled':''} aria-label="Previous"><i class="fas fa-chevron-left"></i></button>`;
    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || Math.abs(i - currentPage) <= 1) {
        html += `<button class="pg-btn ${i===currentPage?'active':''}" data-page="${i}" ${i===currentPage?'aria-current="page"':''}>${i}</button>`;
      } else if (Math.abs(i - currentPage) === 2) {
        html += `<span class="pg-ellipsis">…</span>`;
      }
    }
    html += `<button class="pg-btn arrow" data-page="${currentPage+1}" ${currentPage===pages?'disabled':''} aria-label="Next"><i class="fas fa-chevron-right"></i></button>`;
    nav.innerHTML = html;

    qsa('.pg-btn:not([disabled])', nav).forEach(btn => {
      btn.addEventListener('click', () => {
        currentPage = +btn.dataset.page;
        render();
        qs('#products')?.scrollIntoView({ behavior:'smooth', block:'start' });
      });
    });
  };

  /* ── active filter tags ── */
  const updateActiveTags = () => {
    const container = qs('#activeTags');
    if (!container) return;
    qsa('.af-tag', container).forEach(t => t.remove());

    const insertBefore = qs('#clearAllTagsBtn', container);
    const addTag = (text, onRemove) => {
      const tag = document.createElement('span');
      tag.className = 'af-tag';
      tag.innerHTML = `${text}<button aria-label="Remove filter">×</button>`;
      tag.querySelector('button').onclick = onRemove;
      container.insertBefore(tag, insertBefore);
    };

    const tags = [];
    if (onlyInStock)       tags.push({ label:'In Stock', fn: () => { qs('#filterInStock').checked = false; onlyInStock=false; applyFilters(); } });
    if (onlyOnSale)        tags.push({ label:'On Sale',  fn: () => { qs('#filterOnSale').checked  = false; onlyOnSale=false;  applyFilters(); } });
    if (activeBrand)       tags.push({ label:activeBrand, fn: () => { activeBrand=null; qsa('.brand-item').forEach(b=>b.classList.remove('active-brand')); applyFilters(); } });
    if (activeSubcat !== 'all') {
      const sc = catData.subcats.find(s => s.id === activeSubcat);
      tags.push({ label: sc?.label || activeSubcat, fn: () => {
        activeSubcat = 'all';
        qsa('.chip').forEach((c,i) => c.classList.toggle('active', i===0));
        applyFilters();
      }});
    }
    filterBrands.forEach(b => tags.push({ label:b, fn: () => {
      filterBrands.delete(b);
      const cb = qs(`#sidebar-brand-${b.replace(/\s+/g,'_')}`);
      if (cb) cb.checked = false;
      applyFilters();
    }}));
    filterSubcats.forEach(s => {
      const sc = catData.subcats.find(x => x.id === s);
      tags.push({ label: sc?.label || s, fn: () => {
        filterSubcats.delete(s);
        const cb = qs(`#sidebar-sc-${s}`);
        if (cb) cb.checked = false;
        applyFilters();
      }});
    });
    if (priceMax < Infinity) tags.push({ label:`Under ${fmt(priceMax)}`, fn: () => {
      priceMax = Infinity;
      qs('#priceSlider').value = qs('#priceSlider').max;
      qs('#priceMax').textContent = fmt(+qs('#priceSlider').max * 1);
      applyFilters();
    }});

    tags.forEach(t => addTag(t.label, t.fn));

    const clearAll = qs('#clearAllTagsBtn');
    if (clearAll) clearAll.style.display = tags.length ? '' : 'none';
  };

  const byId = (id) => allProducts.find(p => p.id === id);

  /* ── initialise category ── */
  const init = (key) => {
    catData     = CATEGORIES[key];
    allProducts = catData.products;
    filtered    = [...allProducts];

    /* hero */
    qs('#heroTitle').textContent       = catData.title;
    qs('#heroBreadcrumb').textContent  = catData.title;
    qs('#heroDesc').textContent        = catData.description;
    qs('#heroIcon').className          = catData.icon;
    qs('#heroProductCount').textContent= catData.productCount;
    qs('#heroSaleCount').textContent   = catData.saleCount;
    document.title = `${catData.title} — BuildSol Hardware`;

    /* nav active state */
    qsa('[data-cat-nav]').forEach(li => {
      li.classList.toggle('active', li.dataset.catNav === key);
    });

    /* deal banner */
    qs('#dealTagText').textContent = catData.dealTag;
    qs('#dealTitle').textContent   = catData.dealTitle;
    qs('#dealDesc').textContent    = catData.dealDesc;
    qs('#dealDiscount').textContent= catData.dealDiscount;
    qs('#dealItems').textContent   = catData.dealItems;
    startDealTimer(catData.dealDays);

    /* brand strip */
    const brandList = qs('#brandList');
    if (brandList) {
      brandList.innerHTML = catData.brands.map(b =>
        `<span class="brand-item" data-brand="${b}">${b}</span>`
      ).join('');
      qsa('.brand-item').forEach(item => {
        item.addEventListener('click', () => {
          const was = item.classList.contains('active-brand');
          qsa('.brand-item').forEach(b => b.classList.remove('active-brand'));
          if (!was) { item.classList.add('active-brand'); activeBrand = item.dataset.brand; }
          else       { activeBrand = null; }
          applyFilters();
        });
      });
    }

    /* quick nav pills */
    const qni = qs('#quickNavInner');
    if (qni) {
      const pills = [{ id:'all', label:'All', icon:'fas fa-th' }, ...catData.subcats.map(s => ({ id:s.id, label:s.label, icon:s.icon }))]
        .map(s => `<a href="#" class="qnav-pill ${s.id==='all'?'active':''}" data-subcat="${s.id}"><i class="${s.icon}"></i>${s.label}</a>`)
        .join('');
      qni.innerHTML = `<span class="qnav-label">Jump to</span>${pills}`;
      qsa('.qnav-pill', qni).forEach(pill => {
        pill.addEventListener('click', e => {
          e.preventDefault();
          qsa('.qnav-pill', qni).forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          activeSubcat = pill.dataset.subcat;
          /* sync chip bar */
          qsa('.chip', qs('#filterChips')).forEach(c => c.classList.toggle('active', c.dataset.filter === activeSubcat));
          applyFilters();
        });
      });
    }

    /* filter chips bar */
    const chipsContainer = qs('#filterChips');
    if (chipsContainer) {
      const extraChips = catData.subcats.map(s =>
        `<button class="chip" data-filter="${s.id}">${s.label}</button>`
      ).join('');
      chipsContainer.innerHTML = `<button class="chip active" data-filter="all">All</button>${extraChips}`;
      qsa('.chip', chipsContainer).forEach(chip => {
        chip.addEventListener('click', () => {
          qsa('.chip', chipsContainer).forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          activeSubcat = chip.dataset.filter;
          /* sync quick nav */
          qsa('.qnav-pill').forEach(p => p.classList.toggle('active', p.dataset.subcat === activeSubcat));
          applyFilters();
        });
      });
    }

    /* subcategory showcase grid */
    const scGrid = qs('#subcatGrid');
    if (scGrid) {
      scGrid.innerHTML = catData.subcats.map(s => `
        <a href="#" class="subcat-card" data-subcat="${s.id}">
          <div class="subcat-img"><i class="${s.icon}"></i></div>
          <div class="subcat-body">
            <h3>${s.label}</h3>
            <span>${s.desc}</span>
          </div>
          <div class="subcat-arrow"><i class="fas fa-arrow-right"></i></div>
        </a>`).join('');
      qsa('.subcat-card').forEach(card => {
        card.addEventListener('click', e => {
          e.preventDefault();
          activeSubcat = card.dataset.subcat;
          qsa('.chip').forEach(c => c.classList.toggle('active', c.dataset.filter === activeSubcat));
          qsa('.qnav-pill').forEach(p => p.classList.toggle('active', p.dataset.subcat === activeSubcat));
          applyFilters();
          qs('#products')?.scrollIntoView({ behavior:'smooth' });
        });
      });
    }

    /* sidebar brand checkboxes */
    const sbBrands = qs('#sidebarBrands');
    if (sbBrands) {
      sbBrands.innerHTML = catData.brands.map(b => {
        const count = allProducts.filter(p => p.brand === b).length;
        const safeid = `sidebar-brand-${b.replace(/\s+/g,'_')}`;
        return `<label class="fc-item">
          <input type="checkbox" id="${safeid}" value="${b}">
          <label for="${safeid}">${b}</label>
          <span class="fc-count">${count}</span>
        </label>`;
      }).join('');
      qsa('#sidebarBrands input[type=checkbox]').forEach(cb => {
        cb.addEventListener('change', () => {
          cb.checked ? filterBrands.add(cb.value) : filterBrands.delete(cb.value);
          applyFilters();
        });
      });
    }

    /* sidebar subcat checkboxes */
    const sbSC = qs('#sidebarSubcats');
    if (sbSC) {
      sbSC.innerHTML = catData.subcats.map(s => {
        const count = allProducts.filter(p => p.subcat === s.id).length;
        return `<label class="fc-item">
          <input type="checkbox" id="sidebar-sc-${s.id}" value="${s.id}">
          <label for="sidebar-sc-${s.id}">${s.label}</label>
          <span class="fc-count">${count}</span>
        </label>`;
      }).join('');
      qsa('#sidebarSubcats input[type=checkbox]').forEach(cb => {
        cb.addEventListener('change', () => {
          cb.checked ? filterSubcats.add(cb.value) : filterSubcats.delete(cb.value);
          applyFilters();
        });
      });
    }

    /* toggle switches */
    qs('#filterInStock')?.addEventListener('change', e => { onlyInStock = e.target.checked; applyFilters(); });
    qs('#filterOnSale')?.addEventListener('change',  e => { onlyOnSale  = e.target.checked; applyFilters(); });

    /* price slider */
    const slider = qs('#priceSlider');
    if (slider) {
      slider.addEventListener('input', () => {
        priceMax = +slider.value;
        qs('#priceMax').textContent = fmt(priceMax);
      });
      slider.addEventListener('change', () => applyFilters());
    }

    /* apply & clear */
    qs('#applyFiltersBtn')?.addEventListener('click', () => { applyFilters(); Toast.show('Filters applied', 'success', 1800); });
    qs('#clearFiltersBtn')?.addEventListener('click', clearAllFilters);
    qs('#clearAllTagsBtn')?.addEventListener('click', clearAllFilters);

    /* sort */
    qs('#sortSelect')?.addEventListener('change', e => { sortBy = e.target.value; applyFilters(); });

    /* initial render */
    applyFilters();
  };

  const clearAllFilters = () => {
    onlyInStock = true; onlyOnSale = false; activeBrand = null; activeSubcat = 'all';
    filterBrands.clear(); filterSubcats.clear(); priceMax = Infinity;
    qs('#filterInStock').checked = true;
    qs('#filterOnSale').checked  = false;
    qsa('#sidebarBrands input, #sidebarSubcats input').forEach(cb => cb.checked = false);
    const sl = qs('#priceSlider'); if (sl) { sl.value = sl.max; qs('#priceMax').textContent = fmt(+sl.max); }
    qsa('.chip').forEach((c,i) => c.classList.toggle('active', i===0));
    qsa('.qnav-pill').forEach((p,i) => p.classList.toggle('active', i===0));
    qsa('.brand-item').forEach(b => b.classList.remove('active-brand'));
    applyFilters();
    Toast.show('All filters cleared', 'info', 1800);
  };

  return { init };
})();

/* ───────────────────────────────────────────────────────────────
   SEARCH AUTOCOMPLETE
─────────────────────────────────────────────────────────────── */
const Search = (() => {
  let dropdown = null;

  const build = (bar) => {
    dropdown = document.createElement('div');
    Object.assign(dropdown.style, {
      position:'absolute', top:'calc(100% + 6px)', left:'0', right:'0',
      background:'#fff', borderRadius:'10px', boxShadow:'0 8px 32px rgba(0,0,0,.14)',
      zIndex:'500', overflow:'hidden', border:'1px solid var(--gray-200)',
      maxHeight:'340px', overflowY:'auto',
    });
    bar.style.position = 'relative';
    bar.appendChild(dropdown);
  };

  const search = debounce((query) => {
    const bar = qs('#searchBar');
    if (!bar) return;
    if (query.length < 2) { dropdown?.remove(); dropdown = null; return; }
    if (!dropdown) build(bar);
    const q = query.toLowerCase();
    const allProds = Object.values(CATEGORIES).flatMap(c => c.products);
    const results = allProds.filter(p =>
      p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) ||
      p.subcat.toLowerCase().includes(q)
    ).slice(0, 8);

    if (!results.length) {
      dropdown.innerHTML = `<p style="padding:1rem 1.25rem;font-size:.875rem;color:var(--gray-500)">No results for <strong>"${query}"</strong></p>`;
      return;
    }
    dropdown.innerHTML = results.map(p => `
      <a href="#" data-search-id="${p.id}" style="display:flex;align-items:center;justify-content:space-between;padding:.875rem 1.25rem;border-bottom:1px solid var(--gray-100);text-decoration:none;cursor:pointer;transition:background .15s">
        <div>
          <p style="font-size:.6875rem;text-transform:uppercase;letter-spacing:.08em;color:var(--gray-400);font-family:var(--font-heading);font-weight:600">${p.brand}</p>
          <p style="font-size:.9rem;color:var(--gray-800);font-weight:500;margin-top:2px">${p.name}</p>
        </div>
        <span style="font-family:var(--font-heading);font-weight:700;color:var(--navy-800);white-space:nowrap;margin-left:1rem">${fmt(p.price)}</span>
      </a>`).join('');

    qsa('[data-search-id]', dropdown).forEach(el => {
      el.addEventListener('mouseenter', () => el.style.background = 'var(--gray-50)');
      el.addEventListener('mouseleave', () => el.style.background = '');
      el.addEventListener('click', e => {
        e.preventDefault();
        const p = Object.values(CATEGORIES).flatMap(c => c.products).find(x => x.id === el.dataset.searchId);
        if (p) QuickView.open(p);
        dropdown?.remove(); dropdown = null;
        qs('#searchInput').value = '';
      });
    });
  }, 220);

  const init = () => {
    qs('#searchInput')?.addEventListener('input', e => search(e.target.value.trim()));
    qs('#searchInput')?.addEventListener('keydown', e => {
      if (e.key === 'Escape') { dropdown?.remove(); dropdown = null; qs('#searchInput').blur(); }
    });
    qs('#searchBtn')?.addEventListener('click', () => {
      const v = qs('#searchInput')?.value.trim();
      if (v) Toast.show(`Searching for "<strong>${v}</strong>"…`, 'info', 2000);
    });
    document.addEventListener('click', e => {
      if (!e.target.closest('#searchBar')) { dropdown?.remove(); dropdown = null; }
    });
  };

  return { init };
})();

/* ───────────────────────────────────────────────────────────────
   MOBILE NAVIGATION
─────────────────────────────────────────────────────────────── */
const MobileNav = (() => {
  const init = () => {
    const toggle  = qs('#mobileToggle');
    const nav     = qs('#mobileNav');
    const overlay = qs('#mobileOverlay');
    const close   = qs('#mobileClose');
    if (!toggle || !nav) return;

    const openNav  = () => { nav.classList.add('active'); overlay?.classList.add('active'); document.body.style.overflow='hidden'; toggle.setAttribute('aria-expanded','true'); };
    const closeNav = () => { nav.classList.remove('active'); overlay?.classList.remove('active'); document.body.style.overflow=''; toggle.setAttribute('aria-expanded','false'); };

    toggle.addEventListener('click', openNav);
    close?.addEventListener('click', closeNav);
    overlay?.addEventListener('click', closeNav);
    document.addEventListener('keydown', e => { if(e.key==='Escape') closeNav(); });
  };
  return { init };
})();

/* ───────────────────────────────────────────────────────────────
   VIEW TOGGLE (Grid / List)
─────────────────────────────────────────────────────────────── */
const ViewToggle = (() => {
  const init = () => {
    qs('#gridViewBtn')?.addEventListener('click', () => {
      qs('#productsGrid').classList.remove('list-view');
      qs('#gridViewBtn').classList.add('active');
      qs('#listViewBtn').classList.remove('active');
    });
    qs('#listViewBtn')?.addEventListener('click', () => {
      qs('#productsGrid').classList.add('list-view');
      qs('#listViewBtn').classList.add('active');
      qs('#gridViewBtn').classList.remove('active');
    });
  };
  return { init };
})();

/* ───────────────────────────────────────────────────────────────
   DEAL COUNTDOWN TIMER
─────────────────────────────────────────────────────────────── */
const startDealTimer = (days) => {
  const el = qs('#dealTimer');
  if (!el) return;
  const end = Date.now() + days * 86400000;
  const pad = n => String(n).padStart(2,'0');
  const tick = () => {
    const diff = end - Date.now();
    if (diff <= 0) { el.textContent = 'Expired'; return; }
    const d = Math.floor(diff/86400000);
    const h = Math.floor((diff%86400000)/3600000);
    const m = Math.floor((diff%3600000)/60000);
    const s = Math.floor((diff%60000)/1000);
    el.textContent = d > 0 ? `${d}d ${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(h)}:${pad(m)}:${pad(s)}`;
  };
  tick();
  setInterval(tick, 1000);
};

/* ───────────────────────────────────────────────────────────────
   SCROLL TO TOP + STICKY HEADER
─────────────────────────────────────────────────────────────── */
const Scroll = (() => {
  const init = () => {
    const btn    = qs('#scroll-top');
    const header = qs('.main-header');
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      btn?.classList.toggle('show', y > 400);
      header?.classList.toggle('scrolled', y > 10);
    }, { passive:true });
    btn?.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
  };
  return { init };
})();

/* ───────────────────────────────────────────────────────────────
   NEWSLETTER
─────────────────────────────────────────────────────────────── */
const Newsletter = (() => {
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const KEY = 'bs_newsletter';
  const init = () => {
    const email = qs('#newsletterEmail');
    const btn   = qs('#newsletterBtn');
    if (!email || !btn) return;
    const saved = lsGet(KEY);
    if (saved) { email.value = saved; email.disabled = true; btn.textContent = '✓ Subscribed'; btn.disabled = true; }
    const submit = () => {
      if (!EMAIL_RE.test(email.value.trim())) { Toast.show('Please enter a valid email address.', 'error'); return; }
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      btn.disabled = true;
      setTimeout(() => {
        lsSet(KEY, email.value.trim());
        email.disabled = true;
        btn.textContent = '✓ Subscribed!';
        Toast.show(`Subscribed! Deals coming to <strong>${email.value.trim()}</strong>`, 'success', 4000);
      }, 900);
    };
    btn.addEventListener('click', submit);
    email.addEventListener('keydown', e => { if(e.key==='Enter') submit(); });
  };
  return { init };
})();

/* ───────────────────────────────────────────────────────────────
   PROMO MARQUEE — pause on hover
─────────────────────────────────────────────────────────────── */
const Marquee = (() => {
  const init = () => {
    const el = qs('.promo-strip-inner');
    if (!el) return;
    el.addEventListener('mouseenter', () => el.style.animationPlayState='paused');
    el.addEventListener('mouseleave', () => el.style.animationPlayState='running');
  };
  return { init };
})();

/* ───────────────────────────────────────────────────────────────
   ANIMATE ON SCROLL
─────────────────────────────────────────────────────────────── */
const AOS = (() => {
  const init = () => {
    if (!('IntersectionObserver' in window)) return;
    const targets = qsa('.store-info-card, .subcat-card, .deal-stat');
    targets.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = `opacity .45s ease ${(i%4)*70}ms, transform .45s ease ${(i%4)*70}ms`;
    });
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; obs.unobserve(e.target); }
      });
    }, { threshold:.1, rootMargin:'0px 0px -30px 0px' });
    targets.forEach(el => obs.observe(el));
  };
  return { init };
})();

/* ───────────────────────────────────────────────────────────────
   KEYBOARD SHORTCUTS
─────────────────────────────────────────────────────────────── */
const Keys = (() => {
  const init = () => {
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey||e.metaKey) && e.key==='k') { e.preventDefault(); qs('#searchInput')?.focus(); }
      if (e.key==='c' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) { Cart.openDrawer(); }
    });
  };
  return { init };
})();

/* ───────────────────────────────────────────────────────────────
   BOOT
─────────────────────────────────────────────────────────────── */
const run = () => {
  const catKey = detectCategory();

  // Core UI
  MobileNav.init();
  Marquee.init();
  Scroll.init();
  Keys.init();

  // Commerce
  Cart.init();
  Wishlist.init();
  QuickView.init();

  // Category-specific
  Products.init(catKey);
  Search.init();
  ViewToggle.init();
  Newsletter.init();
  AOS.init();

  console.info(`✅ BuildSol — category "${catKey}" loaded.`);
};

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', run)
  : run();
