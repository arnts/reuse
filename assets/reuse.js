/* =========================================================================
   REuse Atelier — Shopify theme behavior
   Idempotent initialisation registry. Every behavior is safe to call more
   than once and re-runs on Shopify Theme Editor section lifecycle events
   (shopify:section:load / :unload / :select) so interactivity survives
   partial re-renders in the editor.

   NOTE: The contact form intentionally has NO submit handler here — it uses
   Shopify's native {% form 'contact' %} submission, validation, success and
   error handling. JS below only progressively enhances (URL prefill) and
   never intercepts or preventDefaults the native submit.
   ========================================================================= */
(function () {
  'use strict';

  var motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------------------
     Fade-in on scroll
     ---------------------------------------------------------------------- */
  function initFadeIn(root) {
    var scope = root || document;
    var els = scope.querySelectorAll('.fade-in:not([data-fade-bound])');
    if (!els.length) return;

    if (!motionOK || !('IntersectionObserver' in window)) {
      els.forEach(function (el) {
        el.classList.add('is-visible');
        el.setAttribute('data-fade-bound', '');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    els.forEach(function (el) {
      el.setAttribute('data-fade-bound', '');
      observer.observe(el);
    });
  }

  /* ----------------------------------------------------------------------
     Header — sticky shrink + mobile drawer
     ---------------------------------------------------------------------- */
  function initHeader(root) {
    var scope = root || document;
    var header = scope.querySelector('[data-site-header]') ||
      (scope.matches && scope.matches('[data-site-header]') ? scope : null) ||
      document.getElementById('site-header');
    if (!header || header.hasAttribute('data-header-bound')) return;
    header.setAttribute('data-header-bound', '');

    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    var toggle = header.querySelector('.menu-toggle');
    var nav = header.querySelector('.primary-nav');
    if (toggle && nav) {
      var mobileMq = window.matchMedia('(max-width: 880px)');
      var savedScrollY = 0;

      var syncClosedAria = function () {
        if (mobileMq.matches && !header.classList.contains('nav-open')) {
          nav.setAttribute('aria-hidden', 'true');
        } else {
          nav.removeAttribute('aria-hidden');
        }
      };

      var lockScroll = function () {
        savedScrollY = window.scrollY || window.pageYOffset || 0;
        document.body.style.position = 'fixed';
        document.body.style.top = -savedScrollY + 'px';
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
      };

      var unlockScroll = function () {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, savedScrollY);
      };

      var openMenu = function () {
        lockScroll();
        header.classList.add('nav-open');
        nav.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Lukk meny');
        nav.removeAttribute('aria-hidden');
        var firstLink = nav.querySelector('a, button');
        if (firstLink) firstLink.focus({ preventScroll: true });
      };

      var closeMenu = function (returnFocus) {
        var wasOpen = header.classList.contains('nav-open');
        header.classList.remove('nav-open');
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Åpne meny');
        if (wasOpen) unlockScroll();
        syncClosedAria();
        if (returnFocus) toggle.focus();
      };

      toggle.addEventListener('click', function () {
        if (header.classList.contains('nav-open')) {
          closeMenu(false);
        } else {
          openMenu();
        }
      });

      nav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          closeMenu(false);
        });
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && header.classList.contains('nav-open')) {
          closeMenu(true);
        }
      });

      var onBreakpointChange = function () {
        if (mobileMq.matches) {
          syncClosedAria();
        } else if (header.classList.contains('nav-open')) {
          closeMenu(false);
        } else {
          nav.removeAttribute('aria-hidden');
        }
      };
      if (mobileMq.addEventListener) {
        mobileMq.addEventListener('change', onBreakpointChange);
      } else if (mobileMq.addListener) {
        mobileMq.addListener(onBreakpointChange);
      }

      syncClosedAria();
    }
  }

  /* ----------------------------------------------------------------------
     Lightbox — a single shared dialog listening to all galleries
     ---------------------------------------------------------------------- */
  var lightboxBound = false;
  function initLightbox() {
    if (lightboxBound) return;
    var lightbox = document.querySelector('[data-lightbox]');
    if (!lightbox) return;
    lightboxBound = true;

    var imageEl = lightbox.querySelector('[data-lightbox-image]');
    var captionEl = lightbox.querySelector('[data-lightbox-caption]');
    var closeBtn = lightbox.querySelector('[data-lightbox-close]');
    var prevBtn = lightbox.querySelector('[data-lightbox-prev]');
    var nextBtn = lightbox.querySelector('[data-lightbox-next]');

    var currentTriggers = [];
    var currentIndex = 0;
    var lastFocused = null;

    function show(index) {
      var trigger = currentTriggers[index];
      if (!trigger) return;
      var img = trigger.querySelector('img');
      if (!img) return;
      currentIndex = index;
      imageEl.src = img.getAttribute('data-full') || img.src;
      imageEl.alt = img.alt;
      captionEl.textContent = img.getAttribute('data-caption') || '';
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function hide() {
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }

    function next() {
      show((currentIndex + 1) % currentTriggers.length);
    }

    function prev() {
      show((currentIndex - 1 + currentTriggers.length) % currentTriggers.length);
    }

    document.addEventListener('click', function (e) {
      var target = e.target;
      var trigger = target.closest ? target.closest('[data-gallery-trigger]') : null;
      if (!trigger) return;
      var gallery = trigger.closest('[data-gallery]');
      if (!gallery) return;
      currentTriggers = Array.prototype.slice.call(
        gallery.querySelectorAll('[data-gallery-trigger]')
      );
      var index = currentTriggers.indexOf(trigger);
      lastFocused = trigger;
      show(index >= 0 ? index : 0);
    });

    closeBtn.addEventListener('click', hide);
    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) hide();
    });

    document.addEventListener('keydown', function (e) {
      if (lightbox.getAttribute('aria-hidden') !== 'false') return;
      if (e.key === 'Escape') hide();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });
  }

  /* ----------------------------------------------------------------------
     Contact form — progressive enhancement only (URL prefill).
     Does NOT bind submit; native Shopify form handling is the source of truth.
     ---------------------------------------------------------------------- */
  function initContactForm(root) {
    var scope = root || document;
    var forms = scope.querySelectorAll('[data-contact-form]:not([data-contact-bound])');
    forms.forEach(function (form) {
      form.setAttribute('data-contact-bound', '');

      var params = new URLSearchParams(window.location.search);
      var tjeneste = params.get('tjeneste');
      var type = params.get('type');

      var serviceSelect = form.querySelector('[data-service-select]');
      if (tjeneste && serviceSelect) {
        var match = Array.prototype.slice.call(serviceSelect.options).some(function (o) {
          return o.value === tjeneste;
        });
        if (match) serviceSelect.value = tjeneste;
      }

      if (type) {
        form.querySelectorAll('[data-inquiry-type]').forEach(function (radio) {
          radio.checked = radio.value === type;
        });
      }
    });
  }

  /* ----------------------------------------------------------------------
     Run-all + Shopify Theme Editor lifecycle
     ---------------------------------------------------------------------- */
  function initAll(root) {
    initHeader(root);
    initFadeIn(root);
    initLightbox();
    initContactForm(root);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initAll(document);
    });
  } else {
    initAll(document);
  }

  document.addEventListener('shopify:section:load', function (e) {
    initAll(e.target);
  });
  document.addEventListener('shopify:section:select', function (e) {
    initAll(e.target);
  });
  document.addEventListener('shopify:section:unload', function (e) {
    var nav = e.target.querySelector ? e.target.querySelector('.primary-nav') : null;
    if (nav) {
      var y = Math.abs(parseInt(document.body.style.top || '0', 10)) || window.scrollY;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, y);
    }
  });
})();
