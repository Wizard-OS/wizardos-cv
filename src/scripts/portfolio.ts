import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { profile } from '~/data/portfolio';

gsap.registerPlugin(ScrollTrigger);
let cleanup: (() => void) | undefined;

function initializePortfolio() {
  cleanup?.();
  const controller = new AbortController();
  const { signal } = controller;
  const media = gsap.matchMedia();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector<HTMLElement>('.site-header');
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const nav = document.querySelector<HTMLElement>('#portfolio-nav');
  const setMenu = (open: boolean) => {
    nav?.classList.toggle('is-open', open);
    toggle?.setAttribute('aria-expanded', String(open));
    toggle?.setAttribute('aria-label', (open ? toggle.dataset.closeLabel : toggle.dataset.openLabel) ?? '');
  };
  header?.setAttribute('data-menu-ready', '');
  toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'), { signal });
  nav?.addEventListener(
    'click',
    (event) => {
      if ((event.target as HTMLElement).closest('a')) setMenu(false);
    },
    { signal }
  );
  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    },
    { signal }
  );
  document.addEventListener(
    'click',
    (event) => {
      if (header && !header.contains(event.target as Node)) setMenu(false);
    },
    { signal }
  );

  const gallery = document.querySelector<HTMLElement>('#hero-gallery');
  document.querySelectorAll<HTMLButtonElement>('[data-gallery-direction]').forEach((button) => {
    button.addEventListener(
      'click',
      () => {
        const card = gallery?.querySelector<HTMLElement>('.hero-project');
        gallery?.scrollBy({
          left: Number(button.dataset.galleryDirection) * ((card?.offsetWidth ?? 350) + 20),
          behavior: reduced.matches ? 'instant' : 'smooth',
        });
      },
      { signal }
    );
  });
  const syncGalleryControls = () => {
    if (!gallery) return;
    const max = gallery.scrollWidth - gallery.clientWidth;
    document.querySelectorAll<HTMLButtonElement>('[data-gallery-direction]').forEach((button) => {
      button.disabled =
        Number(button.dataset.galleryDirection) < 0 ? gallery.scrollLeft <= 2 : gallery.scrollLeft >= max - 2;
    });
  };
  gallery?.addEventListener('scroll', syncGalleryControls, { passive: true, signal });
  window.addEventListener(
    'resize',
    () => {
      syncGalleryControls();
      if (window.innerWidth > 800) setMenu(false);
    },
    { signal, passive: true }
  );
  syncGalleryControls();

  document.querySelectorAll<HTMLElement>('[data-process]').forEach((process) => {
    const tabs = [...process.querySelectorAll<HTMLButtonElement>('[data-step]')];
    const panels = [...process.querySelectorAll<HTMLElement>('[data-step-panel]')];
    process.querySelector('.process-tabs')?.setAttribute('role', 'tablist');
    const activate = (index: number, focus = false) => {
      tabs.forEach((tab, i) => {
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
      });
      panels.forEach((panel, i) => {
        panel.setAttribute('role', 'tabpanel');
        panel.tabIndex = 0;
        panel.hidden = i !== index;
      });
      if (focus) tabs[index].focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => activate(i), { signal });
      tab.addEventListener(
        'keydown',
        (event) => {
          let next: number;
          if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
          else if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = tabs.length - 1;
          else return;
          event.preventDefault();
          activate(next, true);
        },
        { signal }
      );
    });
    activate(0);
  });

  document.querySelectorAll<HTMLButtonElement>('[data-copy-email]').forEach((button) => {
    button.addEventListener(
      'click',
      async () => {
        const status = button.parentElement?.querySelector<HTMLElement>('.copy-status');
        try {
          await navigator.clipboard.writeText(profile.email);
          if (status) status.textContent = button.dataset.success ?? '';
        } catch {
          if (status) status.textContent = button.dataset.failure ?? '';
        }
      },
      { signal }
    );
  });

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
      syncGalleryControls();
    }
  });
  cleanup = () => {
    controller.abort();
    cancelAnimationFrame(frame);
    media.revert();
  };
}
document.addEventListener('astro:page-load', initializePortfolio);
document.addEventListener('astro:before-swap', () => {
  cleanup?.();
  cleanup = undefined;
});
