import { useEffect, useState } from 'react';

const EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';

export function AnimatedPresence({
  show,
  children,
  className = '',
  duration = 400,
  mode = 'panel',
  id,
}) {
  const [mounted, setMounted] = useState(show);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      let mountFrame;
      let enterFrame;
      mountFrame = window.requestAnimationFrame(() => {
        setMounted(true);
        enterFrame = window.requestAnimationFrame(() => setVisible(true));
      });
      return () => {
        window.cancelAnimationFrame(mountFrame);
        if (enterFrame) window.cancelAnimationFrame(enterFrame);
      };
    }

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const exitFrame = window.requestAnimationFrame(() => setVisible(false));
    const timeout = window.setTimeout(
      () => setMounted(false),
      reducedMotion ? 0 : duration
    );

    return () => {
      window.cancelAnimationFrame(exitFrame);
      window.clearTimeout(timeout);
    };
  }, [show, duration]);

  if (!show && !mounted) return null;

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  const motionDuration = reducedMotion ? '0ms' : `${duration}ms`;
  const transition =
    mode === 'expand'
      ? `flex-grow ${motionDuration} ${EASING}, opacity ${motionDuration} ease, transform ${motionDuration} ${EASING}`
      : `opacity ${motionDuration} ease, transform ${motionDuration} ${EASING}`;

  return (
    <div
      id={id}
      className={className}
      aria-hidden={!show}
      inert={!show}
      style={{
        flex: mode === 'expand'
          ? visible ? '1 1 0%' : '0 0 0%'
          : undefined,
        opacity: visible ? 1 : 0,
        overflow: mode === 'expand' ? 'hidden' : undefined,
        pointerEvents: show ? 'auto' : 'none',
        transform: visible ? 'translate3d(0, 0, 0) scale(1)' : 'translate3d(0, 12px, 0) scale(0.98)',
        willChange: show ? 'opacity, transform' : undefined,
        transition,
      }}
    >
      {children}
    </div>
  );
}
