import { Box } from '@mantine/core';
import { useLayoutEffect, useRef, useState } from 'react';

type CollapseProps = {
  opened: boolean;
  durationMs?: number;
  easing?: string;
  children: React.ReactNode;
};

export function Collapse({
  opened,
  durationMs = 600,
  easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
  children,
}: CollapseProps) {
  const innerRef = useRef<HTMLDivElement | null>(null);
  const raf1 = useRef<number | null>(null);
  const raf2 = useRef<number | null>(null);
  const [height, setHeight] = useState<number | 'auto'>(opened ? 'auto' : 0);

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    if (raf1.current) cancelAnimationFrame(raf1.current);
    if (raf2.current) cancelAnimationFrame(raf2.current);

    if (opened) {
      // Opening: 0 -> scrollHeight -> auto
      setHeight(0);
      raf1.current = requestAnimationFrame(() => {
        const target = el.scrollHeight;
        setHeight(target);
      });
      return;
    }

    // Closing: currentHeight(auto -> px) -> 0
    const current = el.getBoundingClientRect().height;
    setHeight(current);
    raf2.current = requestAnimationFrame(() => {
      setHeight(0);
    });
  }, [opened]);

  return (
    <Box
      style={{
        height: height === 'auto' ? 'auto' : `${height}px`,
        overflow: 'hidden',
        opacity: opened ? 1 : 0,
        transition: `height ${durationMs}ms ${easing}, opacity ${durationMs}ms ${easing}`,
        pointerEvents: opened ? 'auto' : 'none',
      }}
      onTransitionEnd={e => {
        if (e.propertyName !== 'height') return;
        if (opened) setHeight('auto');
      }}
    >
      <div ref={innerRef}>{children}</div>
    </Box>
  );
}
