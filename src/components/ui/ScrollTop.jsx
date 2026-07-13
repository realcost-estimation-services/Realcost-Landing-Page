import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/components/scroll-top.css';

const ScrollTop = () => {
  const [show, setShow] = useState(false);
  const [dir, setDir] = useState('down');
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const atTop = y < 80;
      const atBottom = y + window.innerHeight >= document.documentElement.scrollHeight - 4;

      setShow(y > 240);

      if (atBottom) setDir('up');
      else if (atTop) setDir('down');
      /* Ignore sub-pixel jitter so the arrow doesn't flicker mid-scroll */
      else if (Math.abs(y - lastY.current) > 4) setDir(y > lastY.current ? 'down' : 'up');

      lastY.current = y;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onClick = () =>
    window.scrollTo({
      top: dir === 'down' ? document.documentElement.scrollHeight : 0,
      behavior: 'smooth',
    });

  const label = dir === 'down' ? 'Jump to bottom' : 'Back to top';

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          className="scroll-top"
          onClick={onClick}
          aria-label={label}
          title={label}
          initial={{ opacity: 0, y: 16, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.85 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            animate={{ rotate: dir === 'down' ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollTop;
