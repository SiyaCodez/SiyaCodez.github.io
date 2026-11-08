/* Siya portfolio: small, optional enhancements.
   The site is fully readable without this file. */
(function () {
  'use strict';
  var d = document;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Footer year */
  [].forEach.call(d.querySelectorAll('.year'), function (el) { el.textContent = new Date().getFullYear(); });


  /* Employer logos: if a logo file is missing, show the organisation's name instead */
  [].forEach.call(d.querySelectorAll('.logo img'), function (img) {
    function fallback() { img.parentNode.classList.add('no-img'); }
    img.addEventListener('error', fallback);
    if (img.complete && img.naturalWidth === 0) fallback();
  });

  /* Mobile menu */
  var btn = d.querySelector('.menu-btn');
  var nav = d.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a')) {
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* Scroll progress line */
  var bar = d.querySelector('.progress');
  if (bar) {
    var ticking = false;
    var update = function () {
      var h = d.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* Reveal on scroll (once) */
  var reveals = [].slice.call(d.querySelectorAll('.reveal'));
  if (reveals.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
      reveals.forEach(function (el) { io.observe(el); });
    }
  }

  /* Tabs (Skills / Education / Experience / Certificates) */
  [].forEach.call(d.querySelectorAll('[data-tabs]'), function (root) {
    var tabs = [].slice.call(root.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) { return d.getElementById(t.getAttribute('aria-controls')); });
    function select(i, focus) {
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') n = 0;
        else if (e.key === 'End') n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); select(n, true); }
      });
    });
    select(0);
  });

  /* Testimonial pager (two at a time) */
  [].forEach.call(d.querySelectorAll('[data-pager]'), function (root) {
    var items = [].slice.call(root.querySelectorAll('.quote'));
    var prev = root.querySelector('[data-prev]');
    var next = root.querySelector('[data-next]');
    var live = root.querySelector('[data-live]');
    var per = 2, page = 0, pages = Math.ceil(items.length / per);
    function show() {
      items.forEach(function (el, i) { el.hidden = Math.floor(i / per) !== page; });
      prev.disabled = page === 0;
      next.disabled = page === pages - 1;
      if (live) live.textContent = 'Showing testimonials ' + (page * per + 1) + ' to ' + Math.min(items.length, page * per + per) + ' of ' + items.length;
    }
    prev.addEventListener('click', function () { if (page > 0) { page--; show(); } });
    next.addEventListener('click', function () { if (page < pages - 1) { page++; show(); } });
    show();
  });

  /* Count-up numbers on the About page */
  var counters = [].slice.call(d.querySelectorAll('[data-count]'));
  if (counters.length && !reduce && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, end = parseInt(el.getAttribute('data-count'), 10), suffix = el.getAttribute('data-suffix') || '';
        var start = null, dur = 1100;
        function step(ts) {
          if (start === null) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
          if (p < 1) window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
        co.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* Portfolio filter */
  [].forEach.call(d.querySelectorAll('[data-filters]'), function (root) {
    var buttons = [].slice.call(root.querySelectorAll('button'));
    var items = [].slice.call(d.querySelectorAll('[data-cat]'));
    var live = d.getElementById('filter-status');
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.getAttribute('data-filter');
        buttons.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        var n = 0;
        items.forEach(function (it) {
          var show = f === 'all' || it.getAttribute('data-cat') === f;
          it.hidden = !show;
          if (show) n++;
        });
        if (live) live.textContent = 'Showing ' + n + ' projects';
      });
    });
  });

  /* Contact form: opens the visitor's email app with the message filled in.
     (Swap for a form service such as Formspree later if you want direct submissions.) */
  var form = d.getElementById('contact-form');
  if (form) {
    var status = d.getElementById('form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.elements.website && form.elements.website.value) return; /* spam trap */
      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var subject = form.elements.subject.value.trim() || 'Message from your website';
      var message = form.elements.message.value.trim();
      var body = message + '\n\n' + name + '\n' + email;
      window.location.href = 'mailto:developerntombela@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      if (status) status.textContent = 'Opening your email app. If nothing opens, email developerntombela@gmail.com directly.';
    });
  }
})();
