import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="container section empty notfound">
      <motion.p
        className="notfound__code"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
      >
        404
      </motion.p>
      <h1>Page not found</h1>
      <p className="muted">The page you are looking for has moved or never existed.</p>
      <Link to="/" className="btn btn--primary">Back to home</Link>
    </div>
  );
}
