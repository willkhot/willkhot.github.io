(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  // ---------- Mobile menu ----------
  var menuBtn = $('#menuBtn'), links = $('#navLinks');
  menuBtn.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  $$('#navLinks a').forEach(function (a) {
    a.addEventListener('click', function () { links.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); });
  });

  // ---------- Scroll: progress bar, nav shadow, active link ----------
  var nav = $('#nav'), prog = $('#scrollProgress');
  var sections = $$('main section[id]');
  var navAnchors = $$('#navLinks a');
  function onScroll() {
    var h = document.documentElement;
    var pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    prog.style.width = pct + '%';
    nav.classList.toggle('scrolled', h.scrollTop > 10);
    var cur = '';
    sections.forEach(function (s) { if (s.getBoundingClientRect().top <= 120) cur = s.id; });
    navAnchors.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + cur); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Reveal on scroll ----------
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // ---------- Counters ----------
  function runCounter(el) {
    var target = parseFloat(el.dataset.count), dec = parseInt(el.dataset.decimals || '0', 10);
    var suffix = el.dataset.suffix || '', dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (dec ? (target * eased).toFixed(dec) : Math.round(target * eased).toLocaleString('en-US')) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = $$('[data-count]');
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { runCounter(en.target); co.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = Number(c.dataset.count).toLocaleString('en-US', { minimumFractionDigits: parseInt(c.dataset.decimals || '0', 10) }) + (c.dataset.suffix || ''); });
  }

  // ---------- Typing effect ----------
  var phrases = ['Microsoft Entra ID', 'Zero Trust & least privilege', 'Azure Infrastructure as Code', 'Identity & access management', 'Cloud security'];
  var typed = $('#typed'), pi = 0, ci = 0, del = false;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function tick() {
    var word = phrases[pi];
    if (reduce) { typed.textContent = word; pi = (pi + 1) % phrases.length; return setTimeout(tick, 2200); }
    typed.textContent = word.slice(0, ci);
    if (!del && ci < word.length) { ci++; return setTimeout(tick, 70); }
    if (!del) { del = true; return setTimeout(tick, 1400); }
    if (ci > 0) { ci--; return setTimeout(tick, 35); }
    del = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 300);
  }
  tick();

  // ---------- Terminal language tabs ----------
  $$('.term-tabs button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var l = btn.dataset.lang;
      $$('.term-tabs button').forEach(function (b) {
        var on = b === btn; b.classList.toggle('active', on); b.setAttribute('aria-selected', on);
      });
      $$('.term pre').forEach(function (pre) { pre.hidden = pre.dataset.lang !== l; });
    });
  });

  // ---------- Lightbox ----------
  var lb = $('#lightbox'), lbImg = $('#lbImg');
  function closeLb() { lb.hidden = true; lbImg.src = ''; document.body.style.overflow = ''; }
  $$('.zoomable').forEach(function (b) {
    b.addEventListener('click', function () {
      lbImg.src = b.dataset.full;
      lbImg.alt = ($('img', b) || {}).alt || '';
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  });
  lb.addEventListener('click', closeLb);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lb.hidden) closeLb(); });

  // ---------- Footer year ----------
  $('#year').textContent = new Date().getFullYear();
})();
