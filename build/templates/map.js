/* The Chronicle — Map of Time (Phase 4). Lazy-loaded canvas renderer.
   Vanilla JS, no framework. Data: Seshat Cliopatria (CC BY 4.0) + Natural Earth.
   Loaded only when the map view opens; never part of the authoring master. */
(function () {
  'use strict';

  var ERAS = [
    { file: 'era-1', label: 'I · First Cradles', from: -3400, to: -539, preset: -2500 },
    { file: 'era-2', label: 'II · Classical', from: -539, to: 500, preset: -450 },
    { file: 'era-3', label: 'III · Medieval', from: 500, to: 1450, preset: 1200 },
    { file: 'era-4', label: 'IV · Early Modern', from: 1450, to: 1800, preset: 1700 },
    { file: 'era-5', label: 'V · Modern', from: 1800, to: 2024, preset: 1914 },
  ];

  var cfg = null;          // { version, root, show, isChapter }
  var built = false;
  var eraCache = {};       // file -> decoded payload
  var basemap = null;      // [{coords, bbox}]
  var links = null;        // curated polity->chapter links
  var state = {
    era: null, year: -2500, playing: null,
    k: 4, cx: 30, cy: 25,  // px-per-degree, center lon/lat
    selected: null,
  };
  var canvas, ctx, wrap, slider, yearLabel, playBtn, pop, loadEl, chipsEl;
  var scene = null;        // offscreen bitmap of the last full draw
  var sceneT = null;       // {k, cx, cy} of that draw
  var raf = 0, gesture = false;

  /* ---------- decoding ---------- */
  function decodeRings(rings) {
    var out = [], minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
    for (var r = 0; r < rings.length; r++) {
      var d = rings[r], n = d.length / 2, arr = new Float32Array(n * 2);
      var x = 0, y = 0;
      for (var i = 0; i < n; i++) {
        x += d[i * 2]; y += d[i * 2 + 1];
        var lon = x / 100, lat = y / 100;
        arr[i * 2] = lon; arr[i * 2 + 1] = lat;
        if (lon < minX) minX = lon; if (lon > maxX) maxX = lon;
        if (lat < minY) minY = lat; if (lat > maxY) maxY = lat;
      }
      out.push(arr);
    }
    return { rings: out, bbox: [minX, minY, maxX, maxY] };
  }
  function toPath(shape) {
    if (shape.path) return shape.path;
    var p = new Path2D();
    for (var r = 0; r < shape.rings.length; r++) {
      var a = shape.rings[r];
      p.moveTo(a[0], a[1]);
      for (var i = 1; i < a.length / 2; i++) p.lineTo(a[i * 2], a[i * 2 + 1]);
      p.closePath();
    }
    shape.path = p;
    return p;
  }
  function decodeEra(raw) {
    var pol = [];
    for (var i = 0; i < raw.polities.length; i++) {
      var p = raw.polities[i];
      var s = decodeRings(p.rings);
      pol.push({ n: p.n, f: p.f, t: p.t, w: p.w, rings: s.rings, bbox: s.bbox, path: null });
    }
    return { window: raw.window, years: raw.years, polities: pol };
  }

  /* ---------- data loading ---------- */
  function get(url) {
    return fetch(url + '?v=' + cfg.version).then(function (r) {
      if (!r.ok) throw new Error(url);
      return r.json();
    });
  }
  function loadEra(era) {
    if (eraCache[era.file]) return Promise.resolve(eraCache[era.file]);
    loading(true);
    return get('map/' + era.file + '.json').then(function (raw) {
      eraCache[era.file] = decodeEra(raw);
      return eraCache[era.file];
    });
  }
  function loadCommon() {
    var jobs = [];
    if (!basemap) jobs.push(get('map/basemap.json').then(function (b) {
      basemap = decodeRings(b.rings);
    }));
    if (!links) jobs.push(get('map/map-links.json').then(function (j) {
      links = j.links || [];
    }).catch(function () { links = []; }));
    return Promise.all(jobs);
  }
  function loading(on) { if (loadEl) loadEl.classList.toggle('show', !!on); }

  /* ---------- theme colors (re-read on open so themes apply) ---------- */
  var C = {};
  function readTheme() {
    var cs = getComputedStyle(document.body);
    function v(name, fb) { var x = cs.getPropertyValue(name).trim(); return x || fb; }
    C.paper = v('--paper', '#f5eddd');
    C.sand = v('--sand', '#ece2cf');
    C.sandDeep = v('--sand-deep', '#ddceb2');
    C.ink = v('--ink', '#241f1a');
    C.inkSoft = v('--ink-soft', '#4a423a');
    C.gold = v('--gold', '#bd9433');
  }
  function polColor(name, alpha) {
    var h = 0;
    for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    return 'hsla(' + (h % 360) + ',42%,52%,' + alpha + ')';
  }

  /* ---------- projection (equirectangular, pre-quantized degrees) ---------- */
  function xToPx(lon) { return (lon - state.cx) * state.k + canvas.width / 2; }
  function yToPx(lat) { return (state.cy - lat) * state.k + canvas.height / 2; }
  function pxToLon(px) { return (px - canvas.width / 2) / state.k + state.cx; }
  function pxToLat(py) { return state.cy - (py - canvas.height / 2) / state.k; }

  function visiblePolities() {
    var era = state.era && eraCache[state.era.file];
    if (!era) return [];
    var out = [];
    for (var i = 0; i < era.polities.length; i++) {
      var p = era.polities[i];
      if (p.f <= state.year && state.year <= p.t) out.push(p);
    }
    // big shapes first so small polities render (and hit-test) on top
    out.sort(function (a, b) {
      var aa = (a.bbox[2] - a.bbox[0]) * (a.bbox[3] - a.bbox[1]);
      var bb = (b.bbox[2] - b.bbox[0]) * (b.bbox[3] - b.bbox[1]);
      return bb - aa;
    });
    return out;
  }

  function fullDraw() {
    if (!ctx || !canvas.width || !canvas.height) return;
    var w = canvas.width, h = canvas.height;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = C.paper;
    ctx.fillRect(0, 0, w, h);
    // degree-space transform: x' = (lon-cx)*k + w/2 ; y' = (cy-lat)*k + h/2
    ctx.setTransform(state.k, 0, 0, -state.k, w / 2 - state.cx * state.k, h / 2 + state.cy * state.k);
    // land
    if (basemap) {
      ctx.fillStyle = C.sand;
      ctx.strokeStyle = C.sandDeep;
      ctx.lineWidth = 1 / state.k;
      var lp = toPath(basemap);
      ctx.fill(lp, 'evenodd');
      ctx.stroke(lp);
    }
    // polities
    var vis = visiblePolities();
    for (var i = 0; i < vis.length; i++) {
      var p = vis[i];
      var path = toPath(p);
      ctx.fillStyle = polColor(p.n, 0.55);
      ctx.fill(path, 'evenodd');
      ctx.strokeStyle = (state.selected === p) ? C.gold : C.inkSoft;
      ctx.lineWidth = (state.selected === p ? 2.5 : 0.8) / state.k;
      ctx.stroke(path);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // snapshot for cheap pan blits
    if (!scene || scene.width !== w || scene.height !== h) {
      scene = document.createElement('canvas');
      scene.width = w; scene.height = h;
    }
    scene.getContext('2d').clearRect(0, 0, w, h);
    scene.getContext('2d').drawImage(canvas, 0, 0);
    sceneT = { k: state.k, cx: state.cx, cy: state.cy };
  }
  function blitDraw() {
    if (!scene || !sceneT || !scene.width || !canvas.width) { fullDraw(); return; }
    var w = canvas.width, h = canvas.height;
    var s = state.k / sceneT.k;
    var dx = (sceneT.cx - state.cx) * state.k + (w / 2) * (1 - s);
    var dy = (state.cy - sceneT.cy) * state.k + (h / 2) * (1 - s);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = C.paper;
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(scene, dx, dy, w * s, h * s);
  }
  function requestDraw(cheap) {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = 0;
      if (cheap && gesture) blitDraw(); else fullDraw();
    });
  }

  /* ---------- year / slider ---------- */
  function fmtYear(y) { return y < 0 ? (-y) + ' BCE' : y + ' CE'; }
  function setYearIndex(idx, redraw) {
    var era = eraCache[state.era.file];
    if (!era) return;
    idx = Math.max(0, Math.min(era.years.length - 1, idx));
    state.year = era.years[idx];
    slider.value = idx;
    yearLabel.textContent = fmtYear(state.year);
    hidePop();
    if (redraw !== false) { requestDraw(false); }
  }
  function stopPlay() {
    if (state.playing) { clearInterval(state.playing); state.playing = null; playBtn.textContent = '▶'; }
  }
  function togglePlay() {
    if (state.playing) { stopPlay(); return; }
    var era = eraCache[state.era.file];
    if (!era) return;
    playBtn.textContent = '❚❚';
    state.playing = setInterval(function () {
      var idx = parseInt(slider.value, 10) + 1;
      if (idx >= era.years.length) { stopPlay(); return; }
      setYearIndex(idx);
    }, 650);
  }

  /* ---------- era switching ---------- */
  function fitVisible() {
    var vis = visiblePolities();
    var minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
    for (var i = 0; i < vis.length; i++) {
      var b = vis[i].bbox;
      if (b[0] < minX) minX = b[0]; if (b[2] > maxX) maxX = b[2];
      if (b[1] < minY) minY = b[1]; if (b[3] > maxY) maxY = b[3];
    }
    if (minX > maxX) { minX = -20; maxX = 120; minY = -10; maxY = 55; }
    var padX = Math.max(4, (maxX - minX) * 0.15), padY = Math.max(4, (maxY - minY) * 0.15);
    minX -= padX; maxX += padX; minY -= padY; maxY += padY;
    state.cx = (minX + maxX) / 2; state.cy = (minY + maxY) / 2;
    state.k = Math.min(canvas.width / (maxX - minX), canvas.height / (maxY - minY));
    state.k = Math.max(canvas.width / 400, Math.min(80 * dpr(), state.k));
  }
  function setEra(era, presetYear, fit) {
    state.era = era;
    stopPlay();
    hidePop();
    var chips = chipsEl.querySelectorAll('button');
    for (var i = 0; i < chips.length; i++) {
      chips[i].classList.toggle('on', chips[i].getAttribute('data-era') === era.file);
    }
    loadEra(era).then(function (data) {
      loading(false);
      slider.max = data.years.length - 1;
      var y = presetYear != null ? presetYear : data.years[0];
      var idx = 0;
      for (var i = 0; i < data.years.length; i++) if (data.years[i] <= y) idx = i;
      setYearIndex(idx, false);
      if (fit !== false) fitVisible();
      requestDraw(false);
    }).catch(function () {
      loading(false);
      loadEl.textContent = 'could not load map data — check your connection';
      loadEl.classList.add('show');
    });
  }

  /* ---------- tap → popover ---------- */
  function hitTest(lon, lat) {
    var vis = visiblePolities(); // big → small; last hit wins (smallest on top)
    var hit = null;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    for (var i = 0; i < vis.length; i++) {
      var p = vis[i], b = p.bbox;
      if (lon < b[0] || lon > b[2] || lat < b[1] || lat > b[3]) continue;
      if (ctx.isPointInPath(toPath(p), lon, lat, 'evenodd')) hit = p;
    }
    return hit;
  }
  function linkFor(p) {
    if (!links) return null;
    for (var i = 0; i < links.length; i++) {
      var l = links[i];
      if (l.name !== p.n) continue;
      if (l.from != null && state.year < l.from) continue;
      if (l.to != null && state.year > l.to) continue;
      if (!cfg.isChapter(l.slug)) continue; // chapter not written yet
      return l.slug;
    }
    return null;
  }
  function showPop(p, px, py) {
    state.selected = p;
    requestDraw(false);
    var dates = fmtYear(p.f) + ' – ' + fmtYear(p.t);
    var slug = linkFor(p);
    var html = '<b>' + p.n + '</b><span>' + dates + '</span>';
    if (slug) html += '<button data-mapread="' + slug + '">Read its chapter →</button>';
    pop.innerHTML = html;
    pop.classList.add('show');
    var r = wrap.getBoundingClientRect();
    var pw = pop.offsetWidth, ph = pop.offsetHeight;
    var x = Math.max(8, Math.min(r.width - pw - 8, px - pw / 2));
    var y = py - ph - 14; if (y < 8) y = py + 18;
    pop.style.left = x + 'px'; pop.style.top = y + 'px';
  }
  function hidePop() {
    if (state.selected) { state.selected = null; requestDraw(false); }
    if (pop) { pop.classList.remove('show'); }
  }

  /* ---------- gestures ---------- */
  var pointers = {}, pCount = 0, downAt = null, moved = false, pinch = null;
  function onDown(e) {
    wrap.setPointerCapture && wrap.setPointerCapture(e.pointerId);
    pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
    pCount++;
    gesture = true;
    if (pCount === 1) { downAt = { x: e.clientX, y: e.clientY, t: Date.now() }; moved = false; }
    if (pCount === 2) {
      var ids = Object.keys(pointers);
      var a = pointers[ids[0]], b = pointers[ids[1]];
      pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), k: state.k };
    }
  }
  function onMove(e) {
    var pt = pointers[e.pointerId];
    if (!pt) return;
    var dx = e.clientX - pt.x, dy = e.clientY - pt.y;
    pt.x = e.clientX; pt.y = e.clientY;
    if (pCount === 1) {
      if (Math.abs(e.clientX - downAt.x) + Math.abs(e.clientY - downAt.y) > 8) moved = true;
      if (moved) {
        state.cx -= dx * dpr() / state.k;
        state.cy += dy * dpr() / state.k;
        clampView();
        requestDraw(true);
      }
    } else if (pCount === 2 && pinch) {
      var ids = Object.keys(pointers);
      var a = pointers[ids[0]], b = pointers[ids[1]];
      var d = Math.hypot(a.x - b.x, a.y - b.y);
      state.k = Math.max(minK(), Math.min(80 * dpr(), pinch.k * d / pinch.d));
      clampView();
      requestDraw(true);
    }
  }
  function onUp(e) {
    if (pointers[e.pointerId]) { delete pointers[e.pointerId]; pCount--; }
    if (pCount <= 0) {
      pCount = 0; pinch = null; gesture = false;
      if (downAt && !moved && Date.now() - downAt.t < 400) {
        var r = canvas.getBoundingClientRect();
        var px = (e.clientX - r.left) * dpr(), py = (e.clientY - r.top) * dpr();
        var p = hitTest(pxToLon(px), pxToLat(py));
        if (p) showPop(p, (e.clientX - r.left), (e.clientY - r.top)); else hidePop();
      }
      downAt = null;
      requestDraw(false);
    }
  }
  function onWheel(e) {
    e.preventDefault();
    var f = e.deltaY < 0 ? 1.18 : 1 / 1.18;
    state.k = Math.max(minK(), Math.min(80 * dpr(), state.k * f));
    clampView();
    requestDraw(false);
  }
  function minK() { return canvas.width / 420; }
  function clampView() {
    state.cx = Math.max(-180, Math.min(180, state.cx));
    state.cy = Math.max(-75, Math.min(85, state.cy));
  }
  function dpr() { return Math.min(2, window.devicePixelRatio || 1); }

  /* ---------- DOM ---------- */
  function buildDom() {
    var root = cfg.root;
    root.innerHTML =
      '<div id="map-wrap">' +
      '<canvas id="map-canvas"></canvas>' +
      '<div id="map-chips"></div>' +
      '<div id="map-controls">' +
      '<button id="map-play" aria-label="Play">▶</button>' +
      '<input id="map-slider" type="range" min="0" max="1" value="0">' +
      '<span id="map-year"></span>' +
      '</div>' +
      '<div id="map-pop"></div>' +
      '<div id="map-attrib">Borders: Seshat Cliopatria (CC BY 4.0) · Land: Natural Earth · ' +
      '<a href="#" data-goto="about">all credits</a></div>' +
      '<div id="map-loading">loading the map…</div>' +
      '</div>';
    var style = document.createElement('style');
    style.textContent =
      '#map-wrap{position:fixed;left:0;right:0;bottom:0;top:52px;overflow:hidden;background:var(--paper);}' +
      '#map-canvas{position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:grab;}' +
      '#map-chips{position:absolute;top:10px;left:0;right:0;display:flex;gap:8px;overflow-x:auto;padding:0 12px 6px;scrollbar-width:none;}' +
      '#map-chips button{flex:0 0 auto;border:1px solid var(--sand-deep);background:var(--sand);color:var(--ink-soft);' +
      'border-radius:16px;padding:6px 13px;font-family:"Barlow Condensed",sans-serif;font-size:13.5px;letter-spacing:.04em;cursor:pointer;}' +
      '#map-chips button.on{background:var(--clay);border-color:var(--clay-deep);color:#fff;}' +
      '#map-controls{position:absolute;left:12px;right:12px;bottom:42px;display:flex;align-items:center;gap:10px;' +
      'background:var(--topbar-bg,rgba(245,237,221,.94));border:1px solid var(--sand-deep);border-radius:14px;padding:8px 14px;box-shadow:0 4px 16px var(--shadow);}' +
      '#map-play{border:none;background:var(--clay);color:#fff;width:34px;height:34px;border-radius:50%;font-size:13px;cursor:pointer;flex:0 0 auto;}' +
      '#map-slider{flex:1;accent-color:var(--clay);min-width:0;}' +
      '#map-year{font-family:"Barlow Condensed",sans-serif;font-size:15px;color:var(--ink);min-width:64px;text-align:right;letter-spacing:.04em;}' +
      '#map-pop{position:absolute;display:none;flex-direction:column;gap:4px;max-width:240px;background:var(--topbar-bg,rgba(245,237,221,.97));' +
      'border:1px solid var(--sand-deep);border-radius:10px;padding:10px 12px;box-shadow:0 6px 20px var(--shadow);z-index:5;}' +
      '#map-pop.show{display:flex;}' +
      '#map-pop b{font-family:"Barlow Condensed",sans-serif;font-size:16px;color:var(--ink);letter-spacing:.02em;}' +
      '#map-pop span{font-size:12.5px;color:var(--ink-soft);}' +
      '#map-pop button{margin-top:5px;border:1px solid var(--clay-deep);background:var(--clay);color:#fff;border-radius:8px;' +
      'padding:7px 10px;font-family:"Barlow Condensed",sans-serif;font-size:13.5px;cursor:pointer;}' +
      '#map-attrib{position:absolute;left:0;right:0;bottom:0;padding:5px 12px 7px;font-size:10.5px;color:var(--ink-soft);' +
      'background:var(--topbar-bg,rgba(245,237,221,.9));text-align:center;}' +
      '#map-attrib a{color:var(--clay-deep);}' +
      '#map-loading{position:absolute;left:50%;top:46%;transform:translate(-50%,-50%);background:var(--topbar-bg,rgba(245,237,221,.96));' +
      'border:1px solid var(--sand-deep);border-radius:20px;padding:8px 18px;font-family:"Barlow Condensed",sans-serif;' +
      'font-size:14px;color:var(--ink-soft);opacity:0;pointer-events:none;transition:opacity .2s;}' +
      '#map-loading.show{opacity:1;}';
    document.head.appendChild(style);

    wrap = root.querySelector('#map-wrap');
    canvas = root.querySelector('#map-canvas');
    ctx = canvas.getContext('2d');
    slider = root.querySelector('#map-slider');
    yearLabel = root.querySelector('#map-year');
    playBtn = root.querySelector('#map-play');
    pop = root.querySelector('#map-pop');
    loadEl = root.querySelector('#map-loading');
    chipsEl = root.querySelector('#map-chips');

    ERAS.forEach(function (era) {
      var b = document.createElement('button');
      b.textContent = era.label;
      b.setAttribute('data-era', era.file);
      b.addEventListener('click', function () { setEra(era, era.preset, true); });
      chipsEl.appendChild(b);
    });

    slider.addEventListener('input', function () { stopPlay(); setYearIndex(parseInt(slider.value, 10)); });
    playBtn.addEventListener('click', togglePlay);
    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    pop.addEventListener('click', function (e) {
      var b = e.target.closest('[data-mapread]');
      if (b) { hidePop(); cfg.show(b.getAttribute('data-mapread')); }
    });

    function resize() {
      var r = wrap.getBoundingClientRect();
      canvas.width = Math.round(r.width * dpr());
      canvas.height = Math.round(r.height * dpr());
      scene = null;
      requestDraw(false);
    }
    new ResizeObserver(resize).observe(wrap);
    resize();
  }

  /* ---------- public API ---------- */
  window.ChronicleMap = {
    open: function (config) {
      cfg = cfg || config;
      readTheme();
      if (!built) {
        built = true;
        buildDom();
        loading(true);
        loadCommon().then(function () {
          setEra(ERAS[0], ERAS[0].preset, true);
        }).catch(function () {
          loading(false);
          loadEl.textContent = 'could not load map data — check your connection';
          loadEl.classList.add('show');
        });
      } else {
        requestDraw(false);
      }
    },
    close: function () { stopPlay(); hidePop(); },
    /* screen position (CSS px, canvas-relative) of a lon/lat — used by tests
       and available for future "see this on the map" affordances */
    project: function (lon, lat) {
      return [xToPx(lon) / dpr(), yToPx(lat) / dpr()];
    },
    setYear: function (y) {
      var era = eraCache[state.era && state.era.file];
      if (!era) return;
      var idx = 0;
      for (var i = 0; i < era.years.length; i++) if (era.years[i] <= y) idx = i;
      stopPlay(); setYearIndex(idx);
    },
  };
})();
