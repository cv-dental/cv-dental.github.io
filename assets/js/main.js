/* Group 16 team site: small, dependency-free enhancements. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initHeader();
    initReveal();
    initCounters();
    initCompare();
    initTeamTap();
    initViewer();
    initHeroJaw();
  });

  /* ---------- light / dark toggle ---------- */
  function initTheme() {
    var btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    function current() { return root.dataset.theme || (mq.matches ? 'dark' : 'light'); }
    function label() { btn.setAttribute('aria-label', current() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'); }
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
      label();
    });
    label();
  }

  /* ---------- header background once scrolled ---------- */
  function initHeader() {
    var header = document.querySelector('.site-header');
    var ticking = false;
    function update() { header.classList.toggle('is-scrolled', window.scrollY > 24); ticking = false; }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---------- reveal on scroll ---------- */
  function initReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    document.querySelectorAll('.steps .step').forEach(function (el, i) { el.style.setProperty('--i', i); });
    if (!('IntersectionObserver' in window) || reduceMotion.matches) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- count-up stats ---------- */
  function initCounters() {
    var els = document.querySelectorAll('[data-count]');
    if (!els.length) return;

    function render(el, p) {
      var a = Math.round(+el.dataset.count * p);
      var pre = el.dataset.prefix || '';
      var html;
      if (el.dataset.count2) {
        html = a + '–' + Math.round(+el.dataset.count2 * p);
      } else if (pre.indexOf('up to') === 0) {
        html = '<span class="pre">up to </span>' + a;
      } else {
        html = pre + a + (el.dataset.suffix || '');
      }
      if (el.dataset.unit) html += '<small>' + el.dataset.unit + '</small>';
      el.innerHTML = html;
    }

    function run(el) {
      if (reduceMotion.matches) { render(el, 1); return; }
      var start = null, dur = 1600;
      function frame(t) {
        if (start === null) start = t;
        var k = Math.min(1, (t - start) / dur);
        render(el, 1 - Math.pow(1 - k, 3));
        if (k < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    els.forEach(function (el) {
      if (!reduceMotion.matches) render(el, 0);
      io.observe(el);
    });
  }

  /* ---------- before / after slider ---------- */
  function initCompare() {
    var fig = document.querySelector('.compare');
    if (!fig) return;
    var stage = fig.querySelector('.compare-stage');
    var range = fig.querySelector('.compare-range');
    var before = fig.querySelector('.compare-before');
    var after = fig.querySelector('.compare-after');
    var lesion = document.querySelector('.legend-lesion');
    var cases = {
      healthy: {
        before: ['assets/img/scan-healthy-raw.webp', 1246, 768, 'Raw 3D CT rendering of a lower jaw with teeth'],
        after: ['assets/img/scan-healthy-ai.webp', 1246, 768, 'The same jaw after AI segmentation: bone in green, teeth in yellow'],
        lesion: false
      },
      tumour: {
        before: ['assets/img/scan-tumour-raw.webp', 1170, 694, 'Raw 3D CT rendering of a lower jaw affected by a tumour'],
        after: ['assets/img/scan-tumour-ai.webp', 1170, 694, 'The same jaw after AI segmentation: bone in green, teeth in yellow, tumour highlighted in orange'],
        lesion: true
      }
    };

    function set(v) {
      v = Math.max(0, Math.min(100, v));
      fig.style.setProperty('--pos', v + '%');
      range.value = Math.round(v);
    }
    function fromPointer(e) {
      var r = stage.getBoundingClientRect();
      set(((e.clientX - r.left) / r.width) * 100);
    }

    var dragging = false;
    stage.addEventListener('pointerdown', function (e) {
      dragging = true;
      stage.setPointerCapture(e.pointerId);
      fromPointer(e);
    });
    stage.addEventListener('pointermove', function (e) { if (dragging) fromPointer(e); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (t) {
      stage.addEventListener(t, function () { dragging = false; });
    });
    range.addEventListener('input', function () { set(+range.value); });
    // Make the stage itself keyboard reachable through the hidden range input.
    stage.addEventListener('click', function () { range.focus({ preventScroll: true }); });

    var tabs = document.querySelectorAll('.tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        if (tab.getAttribute('aria-selected') === 'true') return;
        tabs.forEach(function (t) { t.setAttribute('aria-selected', String(t === tab)); });
        var c = cases[tab.dataset.case];
        stage.classList.add('is-swapping');
        setTimeout(function () {
          [[before, c.before], [after, c.after]].forEach(function (pair) {
            pair[0].src = pair[1][0];
            pair[0].width = pair[1][1];
            pair[0].height = pair[1][2];
            pair[0].alt = pair[1][3];
          });
          stage.style.aspectRatio = c.before[1] + ' / ' + c.before[2];
          lesion.hidden = !c.lesion;
          set(50);
          stage.classList.remove('is-swapping');
        }, reduceMotion.matches ? 0 : 250);
      });
      tab.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        var list = Array.prototype.slice.call(tabs);
        var next = list[(list.indexOf(tab) + (e.key === 'ArrowRight' ? 1 : list.length - 1)) % list.length];
        next.focus();
        next.click();
      });
    });

    // Preload the second case once the slider is close to view.
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          [cases.tumour.before[0], cases.tumour.after[0]].forEach(function (src) { new Image().src = src; });
          io.disconnect();
        }
      }, { rootMargin: '200px' });
      io.observe(stage);
    }
  }

  /* ---------- team cards: tap feedback on touch screens ---------- */
  function initTeamTap() {
    if (window.matchMedia('(hover: hover)').matches) return;
    document.querySelectorAll('.member').forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        var on = !card.classList.contains('is-tapped');
        document.querySelectorAll('.member.is-tapped').forEach(function (c) { c.classList.remove('is-tapped'); });
        card.classList.toggle('is-tapped', on);
      });
    });
  }

  /* ---------- 3D viewer: only if assets/models/jaw.glb exists ---------- */
  function initViewer() {
    var box = document.querySelector('.viewer');
    if (!box || !window.fetch) return;
    var src = box.dataset.src;

    function load() {
      fetch(src, { method: 'HEAD' }).then(function (res) {
        if (!res.ok) return;
        var s = document.createElement('script');
        s.type = 'module';
        s.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';
        document.head.appendChild(s);
        var mv = document.createElement('model-viewer');
        mv.setAttribute('src', src);
        mv.setAttribute('alt', 'Interactive 3D model of an AI-segmented jaw. Drag to rotate, pinch or scroll to zoom.');
        mv.setAttribute('camera-controls', '');
        mv.setAttribute('touch-action', 'pan-y');
        mv.setAttribute('shadow-intensity', '0.6');
        mv.setAttribute('exposure', '1.1');
        mv.setAttribute('loading', 'lazy');
        if (!reduceMotion.matches) {
          mv.setAttribute('auto-rotate', '');
          mv.setAttribute('auto-rotate-delay', '0');
          mv.setAttribute('rotation-per-second', '18deg');
        }
        box.innerHTML = '';
        box.appendChild(mv);
      }).catch(function () {});
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { io.disconnect(); load(); }
      }, { rootMargin: '300px' });
      io.observe(box);
    } else {
      load();
    }
  }

  /* ---------- hero: slowly rotating wireframe jaw (bone + teeth) ---------- */
  function initHeroJaw() {
    var canvas = document.querySelector('.hero-canvas');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var hero = canvas.parentElement;
    var inner = hero.querySelector('.hero-inner');

    var model = buildJaw();
    var w = 0, h = 0, dpr = 1, angle = -0.6, running = false, visible = true, last = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = hero.clientWidth; h = hero.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      var wide = w >= 900;
      var cx, cy, scale, alpha = 1;
      if (wide) {
        cx = w * 0.72; cy = h * 0.5; scale = Math.min(w * 0.145, h * 0.28);
      } else {
        // Narrow screens: sit in the free band between the header and the headline.
        var space = inner.offsetTop - 60;
        cx = w * 0.5; cy = 60 + space * 0.55; scale = Math.min(w * 0.3, space * 0.42);
        if (space < 120) { cy = h * 0.3; scale = w * 0.34; alpha = 0.35; }
      }
      var tilt = 0.32;
      var ca = Math.cos(angle), sa = Math.sin(angle), ct = Math.cos(tilt), st = Math.sin(tilt);

      var P = model.points, n = P.length, sx = new Float32Array(n), sy = new Float32Array(n), dz = new Float32Array(n);
      for (var i = 0; i < n; i++) {
        var p = P[i];
        var x = p[0] * ca + p[2] * sa;
        var z = -p[0] * sa + p[2] * ca;
        var y = p[1] * ct - z * st;
        z = p[1] * st + z * ct;
        var f = 3.4 / (3.4 - z);
        sx[i] = cx + x * f * scale;
        sy[i] = cy - y * f * scale;
        dz[i] = z;
      }

      // Bone mesh in 3 depth buckets: one path per bucket keeps this cheap.
      var buckets = [[], [], []];
      model.edges.forEach(function (e) {
        var d = (dz[e[0]] + dz[e[1]]) / 2;
        buckets[d < -0.35 ? 0 : d < 0.35 ? 1 : 2].push(e);
      });
      var boneAlpha = [0.10, 0.2, 0.34];
      buckets.forEach(function (list, b) {
        ctx.beginPath();
        list.forEach(function (e) { ctx.moveTo(sx[e[0]], sy[e[0]]); ctx.lineTo(sx[e[1]], sy[e[1]]); });
        ctx.strokeStyle = 'rgba(170, 205, 240,' + boneAlpha[b] * alpha + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Teeth: short gold strokes with a bright tip.
      ctx.lineCap = 'round';
      model.teeth.forEach(function (t) {
        var d = dz[t[0]];
        var a = (0.35 + 0.45 * (d + 1.2) / 2.4) * alpha;
        ctx.beginPath();
        ctx.moveTo(sx[t[0]], sy[t[0]]);
        ctx.lineTo(sx[t[1]], sy[t[1]]);
        ctx.strokeStyle = 'rgba(224, 165, 38,' + a + ')';
        ctx.lineWidth = 4;
        ctx.stroke();
      });

      // Vertices as faint dots.
      ctx.fillStyle = 'rgba(220, 235, 255,' + 0.35 * alpha + ')';
      for (var j = 0; j < n; j += 2) {
        if (dz[j] > 0) ctx.fillRect(sx[j] - 0.75, sy[j] - 0.75, 1.5, 1.5);
      }
    }

    function tick(t) {
      if (!running) return;
      var dt = last ? Math.min(t - last, 50) : 16;
      last = t;
      angle += dt * 0.00018;
      draw();
      requestAnimationFrame(tick);
    }
    function start() {
      if (running || reduceMotion.matches || !visible || document.hidden) return;
      running = true; last = 0; requestAnimationFrame(tick);
    }
    function stop() { running = false; }

    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        visible ? start() : stop();
      }).observe(hero);
    }
    reduceMotion.addEventListener && reduceMotion.addEventListener('change', function () {
      reduceMotion.matches ? stop() : start();
    });
    resize();
    start();
  }

  // Procedural mandible: a horseshoe-shaped body rising into two rami, plus a row of teeth.
  function buildJaw() {
    var U = 46, M = 10, points = [], edges = [], teeth = [];
    var bodyEnd = 0.7, thMax = 1.2;

    function centre(u) {
      var a = Math.abs(u), s = u < 0 ? -1 : 1;
      if (a <= bodyEnd) {
        var th = (u / bodyEnd) * thMax;
        return { c: [1.15 * Math.sin(th), -0.06 * Math.cos(th), 0.95 * Math.cos(th) - 0.3], t: [Math.cos(th), 0, -0.82 * Math.sin(th)], r: 0 };
      }
      var k = (a - bodyEnd) / (1 - bodyEnd);
      var e = centre(s * bodyEnd);
      return {
        c: [e.c[0] + s * 0.06 * k, e.c[1] + 0.9 * k - 0.1 * k * k, e.c[2] - 0.32 * k],
        t: e.t, r: k
      };
    }

    for (var i = 0; i < U; i++) {
      var u = -1 + (2 * i) / (U - 1);
      var C = centre(u);
      var tl = Math.hypot(C.t[0], C.t[2]);
      var T = [C.t[0] / tl, 0, C.t[2] / tl];            // along the arch
      var N = [T[2], 0, -T[0]];                          // horizontal, across the bone
      var r = Math.min(1, C.r * 2.2);
      var s = r * r * (3 - 2 * r);                       // smoothstep body -> ramus
      // body: tall in Y; ramus: wide front-to-back
      var A2 = [T[0] * s * (u < 0 ? -1 : 1), (1 - s), T[2] * s * (u < 0 ? -1 : 1)];
      var l2 = Math.hypot(A2[0], A2[1], A2[2]);
      A2 = [A2[0] / l2, A2[1] / l2, A2[2] / l2];
      var rad1 = 0.13 - 0.05 * s, rad2 = 0.27;
      for (var j = 0; j < M; j++) {
        var ph = (j / M) * Math.PI * 2;
        var cp = Math.cos(ph), sp = Math.sin(ph);
        points.push([
          C.c[0] + N[0] * cp * rad1 + A2[0] * sp * rad2,
          C.c[1] + N[1] * cp * rad1 + A2[1] * sp * rad2,
          C.c[2] + N[2] * cp * rad1 + A2[2] * sp * rad2
        ]);
        var idx = i * M + j;
        edges.push([idx, i * M + ((j + 1) % M)]);
        if (i < U - 1) edges.push([idx, idx + M]);
      }
    }

    // 14 teeth along the body, growing out of the top edge
    var count = 14;
    for (var q = 0; q < count; q++) {
      var uu = -0.62 + (1.24 * q) / (count - 1);
      var Cq = centre(uu);
      var base = [Cq.c[0], Cq.c[1] + 0.27, Cq.c[2]];
      var molar = Math.abs(uu) > 0.32;
      var top = [base[0], base[1] + (molar ? 0.16 : 0.22), base[2]];
      var b = points.length;
      points.push(base, top);
      teeth.push([b, b + 1]);
    }
    return { points: points, edges: edges, teeth: teeth };
  }
})();
