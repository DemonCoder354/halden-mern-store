import { Link } from 'react-router-dom';
import { CATEGORY_META } from '../lib/format.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Link to="/" className="logo logo--light">
            <span className="logo__mark" aria-hidden="true">H</span>
            Halden
          </Link>
          <p>
            Considered objects for listening, working and living. A MERN stack demo store built
            with MongoDB, Express, React and Node.js.
          </p>
        </div>
        <div>
          <h3>Shop</h3>
          <ul>
            {Object.entries(CATEGORY_META).map(([slug, m]) => (
              <li key={slug}><Link to={`/shop?category=${slug}`}>{m.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Help</h3>
          <ul>
            <li><Link to="/policies#shipping">Shipping</Link></li>
            <li><Link to="/policies#returns">Returns & refunds</Link></li>
            <li><Link to="/policies#warranty">Warranty</Link></li>
          </ul>
        </div>
        <div>
          <h3>Legal</h3>
          <ul>
            <li><Link to="/policies#privacy">Privacy policy</Link></li>
            <li><Link to="/policies#terms">Terms of service</Link></li>
            <li><Link to="/policies#cookies">Cookie policy</Link></li>
            <li><Link to="/policies#data">Data deletion</Link></li>
          </ul>
        </div>
      </div>
      <div className="container footer__bottom">
        <p>&copy; {new Date().getFullYear()} Halden Demo Store. Product photos from Unsplash.</p>
        <p>Demo project: no real payments are processed.</p>
      </div>
    </footer>
  );
}
