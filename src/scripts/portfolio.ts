import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onPageLoad } from './page-lifecycle';

gsap.registerPlugin(ScrollTrigger);

onPageLoad((signal) => {
  const media = gsap.matchMedia();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const bar = document.querySelector<HTMLElement>('.reading-progress');
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
    frame = 0;
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!frame) frame = requestAnimationFrame(updateProgress);
    },
    { passive: true, signal }
  );
  updateProgress();

  media.add(
    {
      desktop: '(min-width: 801px)',
      reduced: '(prefers-reduced-motion: reduce)',
      fine: '(hover: hover) and (pointer: fine)',
    },
    (context) => {
      if (context.conditions?.reduced) return;
      const desktop = Boolean(context.conditions?.desktop);
      const hoverController = new AbortController();
      if (document.querySelector('[data-hero]'))
        gsap.from('[data-hero]', {
          y: desktop ? 35 : 18,
          opacity: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
          clearProps: 'all',
        });
      if (document.querySelector('[data-hero-card]'))
        gsap.from('[data-hero-card]', {
          y: desktop ? 90 : 25,
          rotation: desktop ? -3 : 0,
          opacity: 0,
          duration: 1.1,
          stagger: 0.12,
          delay: 0.3,
          ease: 'power3.out',
          clearProps: 'all',
        });
      if (desktop && document.querySelector('.hero')) {
        gsap.to('.hero-glow', { x: 70, y: 35, scale: 1.12, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to('.hero-copy', {
          y: -45,
          opacity: 0.35,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: '50% top', scrub: 1 },
        });
        gsap.to('.hero-gallery-wrap', {
          y: -18,
          ease: 'none',
          scrollTrigger: { trigger: '.hero-gallery-wrap', start: 'top 55%', end: 'bottom top', scrub: 1 },
        });
      }
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.from(element, {
          y: desktop ? 42 : 20,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          clearProps: 'all',
          scrollTrigger: { trigger: element, start: 'top 94%', once: true },
        });
      });
      if (context.conditions?.fine && desktop) {
        document.querySelectorAll<HTMLElement>('.hero-project > a').forEach((card) => {
          card.addEventListener(
            'pointermove',
            (event) => {
              if (reduced.matches) return;
              const rect = card.getBoundingClientRect();
              gsap.to(card, {
                rotationY: ((event.clientX - rect.left) / rect.width - 0.5) * 7,
                rotationX: -((event.clientY - rect.top) / rect.height - 0.5) * 7,
                transformPerspective: 900,
                duration: 0.4,
                ease: 'power2.out',
              });
            },
            { signal: hoverController.signal }
          );
          card.addEventListener(
            'pointerleave',
            () => gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.6, ease: 'power2.out' }),
            { signal: hoverController.signal }
          );
        });
      }
      return () => hoverController.abort();
    }
  );
  document.fonts.ready.then(() => {
    if (!signal.aborted) {
      ScrollTrigger.refresh();
    }
  });
  return () => {
    cancelAnimationFrame(frame);
    media.revert();
  };
});
