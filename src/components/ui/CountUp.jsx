import React, { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';

/**
 * Counts a number up from 0 to `end` once it scrolls into view.
 * `suffix`/`prefix` let you keep decorations like the trailing "+".
 */
export default function CountUp({ end, duration = 1.6, suffix = '', prefix = '', className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, end, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{value.toLocaleString('en-US')}{suffix}
    </span>
  );
}
