import React from 'react';
import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

/**
 * Fades + slides a section/element in once when it scrolls into view.
 * `as` lets it render as a section/div/etc while keeping the same API.
 */
export function Reveal({ children, delay = 0, y = 28, className, style, as = 'div', viewport, ...rest }) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, ...viewport }}
      transition={{ duration: 0.95, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/** Wraps a grid/row of children and staggers their entrance. */
export function RevealGroup({ children, className, style, stagger = 0.13, y = 24, viewport, ...rest }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15, ...viewport }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
      {...rest}
    >
      {React.Children.map(children, (child) =>
        child ? (
          <motion.div
            variants={{ hidden: { opacity: 0, y }, show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } } }}
          >
            {child}
          </motion.div>
        ) : child
      )}
    </motion.div>
  );
}

/** Lift + shadow-bloom hover for cards, with spring feel. */
export function HoverLift({ children, className, style, lift = -8, scale = 1, ...rest }) {
  return (
    <motion.div
      className={className}
      style={{ willChange: 'transform', ...style }}
      whileHover={{ y: lift, scale }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
