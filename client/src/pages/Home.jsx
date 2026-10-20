import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/useFetch.js';
import { CATEGORY_META } from '../lib/format.js';
import ProductCard, { CardSkeleton } from '../components/ProductCard.jsx';
import Reveal from '../components/Reveal.jsx';
import { ArrowRightIcon, ReturnIcon, ShieldIcon, TruckIcon, WrenchIcon } from '../components/Icons.jsx';

const HERO_WORDS = ['Objects', 'made', 'to', 'be', 'lived', 'with.'];
const u = (id, w = 700) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 18 });
  const sy = useSpring(my, { stiffness: 80, damping: 18 });
  const layer = (depth) => ({
    x: useTransform(sx, (v) => v * depth),
    y: useTransform(sy, (v) => v * depth),
  });
  const l1 = layer(-18);
  const l2 = layer(26);
  const l3 = layer(-10);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section className="hero" onMouseMove={onMove} onMouseLeave={() => { mx.set(0); my.set(0); }}>
      <div className="hero__bg" aria-hidden="true">
        <span className="blob blob--a" />
        <span className="blob blob--b" />
        <span className="grain" />
      </div>
      <div className="container hero__inner">
        <div className="hero__copy">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Autumn collection 2026
          </motion.p>
          <h1 className="hero__title">
            {HERO_WORDS.map((w, i) => (
              <Fragment key={w}>
                <span className="word-mask">
                  <motion.span
                    className={i === 4 ? 'accent-word' : undefined}
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {w}
                  </motion.span>
                </span>{' '}
              </Fragment>
            ))}
          </h1>
          <motion.p
            className="hero__lead"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Headphones, watches, desk tools and home pieces chosen for good materials, honest
            design and parts you can replace.
          </motion.p>
          <motion.div
            className="hero__cta"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
          >
            <Link to="/shop" className="btn btn--primary btn--lg">
              Shop the collection <ArrowRightIcon width={18} height={18} />
            </Link>
            <Link to="/shop?onSale=true" className="btn btn--ghost btn--lg">
              View offers
            </Link>
          </motion.div>
        </div>

        <div className="hero__art" aria-hidden="true">
          <motion.div className="hero__tile hero__tile--1" style={l1}
            initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: -4 }}
            transition={{ duration: 0.9, delay: 0.2 }}>
            <img src={u('1505740420928-5e560c06d30e')} alt="" />
          </motion.div>
          <motion.div className="hero__tile hero__tile--2" style={l2}
            initial={{ opacity: 0, scale: 0.9, rotate: 8 }}
            animate={{ opacity: 1, scale: 1, rotate: 5 }}
            transition={{ duration: 0.9, delay: 0.35 }}>
            <img src={u('1523275335684-37898b6baf30')} alt="" />
          </motion.div>
          <motion.div className="hero__tile hero__tile--3" style={l3}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.5 }}>
            <img src={u('1553062407-98eeb64c6a62')} alt="" />
          </motion.div>
          <motion.div className="hero__chip"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}>
            <span className="dot" /> Free shipping over $150
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ['Free shipping over $150', '30-day returns', '2-year warranty', 'Replaceable parts', 'Small-batch makers'];
  const row = [...items, ...items];
  return (
    <div className="marquee" aria-label={items.join(', ')}>
      <div className="marquee__track" aria-hidden="true">
        {row.map((t, i) => (
          <span key={i}>{t}<span className="marquee__sep">&#10022;</span></span>
        ))}
      </div>
    </div>
  );
}

function Categories() {
  const { data } = useFetch((s) => api.categories(s), []);
  const cats = data ?? Object.keys(CATEGORY_META).map((slug) => ({ slug, count: null, image: null }));
  return (
    <section className="section container">
      <Reveal className="section__head">
        <div>
          <p className="eyebrow">Browse</p>
          <h2>Shop by category</h2>
        </div>
        <Link to="/shop" className="link-arrow">All products <ArrowRightIcon width={16} height={16} /></Link>
      </Reveal>
      <div className="bento">
        {cats.map((c, i) => (
          <Reveal key={c.slug} delay={i * 0.06} className={`bento__item bento__item--${i}`}>
            <Link to={`/shop?category=${c.slug}`} className="cat-tile">
              {c.image ? <img src={c.image} alt="" loading="lazy" /> : <div className="skeleton" />}
              <div className="cat-tile__shade" />
              <div className="cat-tile__text">
                <h3>{CATEGORY_META[c.slug]?.label ?? c.slug}</h3>
                <p>{CATEGORY_META[c.slug]?.blurb}</p>
                {c.count != null && <span className="cat-tile__count">{c.count} products</span>}
              </div>
              <span className="cat-tile__arrow"><ArrowRightIcon width={18} height={18} /></span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const TABS = [
  { id: 'featured', label: 'Featured', load: (s) => api.featured(s) },
  { id: 'new', label: 'New arrivals', load: (s) => api.products({ sort: 'newest', limit: 8 }, s).then((r) => r.items.filter((p) => p.isNewArrival)) },
  { id: 'sale', label: 'On sale', load: (s) => api.products({ onSale: 'true', limit: 8 }, s).then((r) => r.items) },
];

function ProductTabs() {
  const [tab, setTab] = useState('featured');
  const active = TABS.find((t) => t.id === tab);
  const { data, loading, error } = useFetch((s) => active.load(s), [tab]);

  return (
    <section className="section container">
      <Reveal className="section__head">
        <div>
          <p className="eyebrow">Curated</p>
          <h2>Picked for you</h2>
        </div>
        <div className="tabs" role="tablist" aria-label="Product collections">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={`tabs__btn ${tab === t.id ? 'is-active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {tab === t.id && <motion.span layoutId="tab-pill" className="tabs__pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
              <span className="tabs__label">{t.label}</span>
            </button>
          ))}
        </div>
      </Reveal>
      {error && <p className="error-box">Could not load products. Is the API running?</p>}
      <div className="grid" role="tabpanel">
        {loading
          ? Array.from({ length: 4 }, (_, i) => <CardSkeleton key={i} />)
          : (
            <AnimatePresence mode="popLayout">
              {data?.slice(0, 8).map((p, i) => <ProductCard key={`${tab}-${p._id}`} product={p} index={i} />)}
            </AnimatePresence>
          )}
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="story">
      <div className="container story__inner">
        <Reveal className="story__media">
          <img src={u('1495474472287-4d71bcdd2085', 1100)} alt="Hands holding cups of latte over a cafe table" loading="lazy" />
        </Reveal>
        <div className="story__copy">
          <Reveal><p className="eyebrow eyebrow--light">Our approach</p></Reveal>
          <Reveal delay={0.05}><h2>Fewer, better things.</h2></Reveal>
          <Reveal delay={0.1}>
            <p>
              We work with small makers and pick products we would use every day ourselves. Every
              listing tells you what it is made of and how to look after it, so you can buy once and
              keep it for years.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <Link to="/shop" className="btn btn--accent">Explore the range</Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const PERKS = [
  { icon: TruckIcon, title: 'Free shipping over $150', text: 'Flat $9 below that, shown before you check out.' },
  { icon: ReturnIcon, title: '30-day returns', text: 'Changed your mind? Send it back within 30 days.' },
  { icon: ShieldIcon, title: '2-year warranty', text: 'Every product is covered against manufacturing defects.' },
  { icon: WrenchIcon, title: 'Built to be repaired', text: 'Spare parts and care guides for the things you own.' },
];

function Perks() {
  return (
    <section className="section container perks">
      {PERKS.map(({ icon: Icon, title, text }, i) => (
        <Reveal key={title} delay={i * 0.08} className="perk">
          <span className="perk__icon"><Icon /></span>
          <h3>{title}</h3>
          <p>{text}</p>
        </Reveal>
      ))}
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Categories />
      <ProductTabs />
      <Story />
      <Perks />
    </>
  );
}
