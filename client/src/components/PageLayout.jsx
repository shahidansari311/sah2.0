import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const pageTransition = { duration: 0.35, ease: [0.4, 0, 0.2, 1] };

export default function PageLayout({ children, className = '' }) {
  return (
    <motion.main
      className={`page-layout ${className}`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {children}
    </motion.main>
  );
}
