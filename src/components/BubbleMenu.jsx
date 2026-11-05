// src/components/BubbleMenu.jsx
// Menu de burbujas basado en el componente BubbleMenu original.
// Conserva la linea de tiempo de GSAP (escala de burbujas + etiquetas con
// stagger) pero funciona de forma controlada: el disparador vive fuera del
// menu ("Planetas visibles") y cada burbuja puede abrir una ficha.

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import './BubbleMenu.css';

export default function BubbleMenu({
  items = [],
  open = false,
  onClose,
  onSelect,
  className,
  style,
  title,
  subtitle,
  menuBg = '#0c0f20',
  menuContentColor = '#e0e7ff',
  animationEase = 'back.out(1.5)',
  animationDuration = 0.5,
  staggerDelay = 0.12,
}) {
  const overlayRef = useRef(null);
  const bubblesRef = useRef([]);
  const labelRefs = useRef([]);
  const hasOpenedRef = useRef(false);

  const menuItems = items;

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const bubbles = bubblesRef.current.filter(Boolean);
    const labels = labelRefs.current.filter(Boolean);

    if (!overlay || !bubbles.length) return;

    const reduceMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const duration = reduceMotion ? 0.01 : animationDuration;

    if (open) {
      hasOpenedRef.current = true;
      gsap.set(overlay, { display: 'flex' });
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.set(bubbles, { scale: 0, transformOrigin: '50% 50%' });
      gsap.set(labels, { y: 24, autoAlpha: 0 });

      bubbles.forEach((bubble, i) => {
        const delay = i * staggerDelay + gsap.utils.random(-0.05, 0.05);
        const tl = gsap.timeline({ delay });

        tl.to(bubble, {
          scale: 1,
          duration,
          ease: animationEase,
        });
        if (labels[i]) {
          tl.to(
            labels[i],
            {
              y: 0,
              autoAlpha: 1,
              duration,
              ease: 'power3.out',
            },
            `-=${duration * 0.9}`
          );
        }
      });
    } else if (hasOpenedRef.current) {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.to(labels, {
        y: 24,
        autoAlpha: 0,
        duration: reduceMotion ? 0.01 : 0.2,
        ease: 'power3.in',
      });
      gsap.to(bubbles, {
        scale: 0,
        duration: reduceMotion ? 0.01 : 0.2,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(overlay, { display: 'none' });
        },
      });
    }
  }, [open, animationEase, animationDuration, staggerDelay]);

  useEffect(() => {
    const handleResize = () => {
      if (!open) return;
      const bubbles = bubblesRef.current.filter(Boolean);
      const isDesktop = window.innerWidth >= 900;

      bubbles.forEach((bubble, i) => {
        const item = menuItems[i];
        if (bubble && item) {
          const rotation = isDesktop ? item.rotation ?? 0 : 0;
          gsap.set(bubble, { rotation });
        }
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [open, menuItems]);

  return (
    <div
      ref={overlayRef}
      className={`bubble-menu-items fixed ${className ?? ''}`.trim()}
      style={style}
      role="dialog"
      aria-modal="true"
      aria-label={title ?? 'Menu de planetas'}
      aria-hidden={!open}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <button
        type="button"
        className="bubble-menu-close"
        onClick={onClose}
        aria-label="Cerrar menu de planetas"
      >
        <span aria-hidden="true">×</span>
      </button>

      {(title || subtitle) && (
        <header className="bubble-menu-heading">
          {title && <p className="bubble-menu-kicker">Mapa del cielo</p>}
          {title && <h2 className="bubble-menu-title">{title}</h2>}
          {subtitle && <p className="bubble-menu-subtitle">{subtitle}</p>}
        </header>
      )}

      <ul className="pill-list" role="menu" aria-label={title ?? 'Planetas'}>
        {menuItems.map((item, idx) => (
          <li key={item.key ?? item.label} role="none" className="pill-col">
            <button
              type="button"
              role="menuitem"
              aria-label={item.ariaLabel || item.label}
              className="pill-link"
              onClick={() => onSelect?.(item)}
              style={{
                '--item-rot': `${item.rotation ?? 0}deg`,
                '--pill-bg': menuBg,
                '--pill-color': menuContentColor,
                '--hover-bg': item.hoverStyles?.bgColor || '#f3f4f6',
                '--hover-color':
                  item.hoverStyles?.textColor || menuContentColor,
              }}
              ref={(el) => {
                if (el) bubblesRef.current[idx] = el;
              }}
            >
              <span
                className="pill-planet"
                aria-hidden="true"
                style={{
                  '--planet-color': item.color || '#c084fc',
                  '--planet-soft':
                    item.colorSuave || item.color || '#e0e7ff',
                }}
              />
              <span
                className="pill-label"
                ref={(el) => {
                  if (el) labelRefs.current[idx] = el;
                }}
              >
                <span className="pill-name">{item.label}</span>
                {item.meta && <span className="pill-meta">{item.meta}</span>}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <p className="bubble-menu-hint">
        Elige un planeta para ver su ficha y la mejor zona de observación
      </p>
    </div>
  );
}
