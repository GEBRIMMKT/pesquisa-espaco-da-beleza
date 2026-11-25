/* ==========================================================================
   Espaço da Beleza — apresentação interativa (versão enxuta: 14 slides)
   JavaScript puro, sem dependências. Funciona abrindo o index.html direto
   (file://) ou por um servidor local, com ou sem internet.

   Duas trilhas:
   - principal: os 14 slides da apresentação;
   - anexo "Dados e evidências": material de consulta, fora da sequência.
   ========================================================================== */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const pad = n => String(n).padStart(2, '0');
  const store = {
    get(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* sem armazenamento: tudo bem */ } }
  };
  const safePlay = v => { try { const p = v.play(); if (p && p.catch) p.catch(() => {}); } catch (e) {} };

  const CHAPTERS = {
    1: 'Abertura', 2: 'Plano de pesquisa', 3: 'Metodologia',
    4: 'Resultados', 5: 'Conclusões', 6: 'Recomendações e encerramento'
  };

  const intro = $('#intro');
  const deck = $('#deck');
  const stage = $('#stage');
  const viewport = $('#viewport');
  const allSlides = $$('.slide', stage);
  const mainSlides = allSlides.filter(s => !s.hasAttribute('data-ap'));
  const apSlides = allSlides.filter(s => s.hasAttribute('data-ap'));
  const N = mainSlides.length;
  const NA = apSlides.length;
  const ROT = (window.ROTEIRO && window.ROTEIRO.slides) || [];

  let track = 'main';
  let idx = 0;      // posição na trilha principal
  let apIdx = 0;    // posição no anexo
  let mode = 'intro';
  let busy = false;
  let startedAt = null;
  const listOf = t => (t === 'main' ? mainSlides : apSlides);
  const cur = () => (track === 'main' ? mainSlides[idx] : apSlides[apIdx]);

  /* ---------------- movimento reduzido ---------------- */
  const mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  const savedMotion = store.get('eb-motion');
  let reduced = savedMotion ? savedMotion === 'reduced' : !!(mq && mq.matches);
  function applyMotion() {
    const root = document.documentElement;
    root.classList.toggle('reduce-motion', reduced);
    root.classList.toggle('force-motion', !reduced);
    const b = $('#hMotion');
    if (b) {
      b.setAttribute('aria-pressed', String(reduced));
      b.dataset.tip = reduced ? 'Animações reduzidas (clique para ativar)' : 'Reduzir animações';
    }
  }
  applyMotion();

  /* ---------------- montagem dos slides ---------------- */
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function decorate(s, i, isAp) {
    const total = isAp ? NA : N;
    const num = isAp ? 'A' + pad(i + 1) : pad(i + 1);
    const tot = isAp ? 'A' + pad(total) : pad(total);
    if (s.dataset.id !== 'capa') {
      const head = document.createElement('header');
      head.className = 's-head';
      head.setAttribute('aria-hidden', 'true');
      const label = isAp ? '<span class="chap ap">Dados e evidências · ' + num + '</span>'
        : '<span class="chap">' + pad(+s.dataset.chapter) + ' · ' + CHAPTERS[+s.dataset.chapter] + '</span>';
      head.innerHTML = '<span class="brand-mini"><svg><use href="#i-flower"/></svg>Espaço da Beleza — Pesquisa de Mercado</span>' + label;
      s.prepend(head);
    }
    const foot = document.createElement('footer');
    foot.className = 's-foot';
    let more = '';
    if (s.dataset.more) {
      try {
        const items = JSON.parse(s.dataset.more);
        more = '<span class="s-more">' + items.map(m => '<button class="more" type="button" data-goap="' + esc(m[0]) + '"><b>+</b>' + esc(m[1]) + '</button>').join('') + '</span>';
        foot.classList.add('has-more');
      } catch (e) { /* atributo mal formado: ignora */ }
    }
    foot.innerHTML = '<span class="src"></span>' + more + '<span class="pg"><b>' + num + '</b> / ' + tot + '</span>';
    if (s.dataset.src) foot.querySelector('.src').textContent = s.dataset.src;
    s.append(foot);

    s.setAttribute('role', 'group');
    s.setAttribute('aria-roledescription', 'slide');
    s.setAttribute('aria-label', (isAp ? 'Dados e evidências ' + num : (i + 1) + ' de ' + N) + ': ' + s.dataset.title);
    s.setAttribute('aria-hidden', 'true');
    s.inert = true;

    const steps = $$('[data-step]', s);
    s._max = steps.reduce((m, el) => Math.max(m, +el.dataset.step), 0);
    s._step = 0;
    if (s._max) {
      const d = document.createElement('div');
      d.className = 'step-dots';
      d.setAttribute('aria-hidden', 'true');
      d.innerHTML = '<i></i>'.repeat(s._max);
      s.append(d);
    }
  }
  mainSlides.forEach((s, i) => decorate(s, i, false));
  apSlides.forEach((s, i) => decorate(s, i, true));

  /* títulos que entram palavra por palavra */
  function splitWords(el) {
    let i = 0;
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    const walk = node => {
      Array.from(node.childNodes).forEach(ch => {
        if (ch.nodeType === 3) {
          const parts = ch.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach(p => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            w.className = 'w';
            w.setAttribute('aria-hidden', 'true');
            const wi = document.createElement('span');
            wi.className = 'wi';
            wi.style.setProperty('--i', i++);
            wi.textContent = p;
            w.appendChild(wi);
            frag.appendChild(w);
          });
          ch.replaceWith(frag);
        } else if (ch.nodeType === 1 && ch.tagName !== 'BR') {
          walk(ch);
        }
      });
    };
    walk(el);
  }
  $$('[data-split]').forEach(splitWords);

  /* pontos “x de N” */
  $$('.dots[data-of]').forEach(d => {
    const n = +d.dataset.n, of = +d.dataset.of;
    d.setAttribute('role', 'img');
    d.setAttribute('aria-label', n + ' de ' + of);
    d.innerHTML = Array.from({ length: of }, (_, k) => '<i class="' + (k < n ? 'on' : '') + '" style="--k:' + k + '"></i>').join('');
  });

  /* avaliações antigas × recentes (Google) */
  $$('.cells[data-old]').forEach(c => {
    const old = +c.dataset.old, of = +c.dataset.of;
    c.innerHTML = Array.from({ length: of }, (_, k) => '<i class="' + (k >= old ? 'new' : '') + '"></i>').join('');
  });

  /* 29 comentários em quadradinhos */
  $$('.waffle[data-cats]').forEach(w => {
    const counts = w.dataset.cats.split(',').map(Number);
    let k = 0, html = '';
    counts.forEach((n, c) => { for (let j = 0; j < n; j++) html += '<i class="c' + (c + 1) + '" style="--k:' + (k++) + '"></i>'; });
    w.innerHTML = html;
  });

  /* as 13 pessoas do questionário (dados reais das respostas, em ordem de envio) */
  const PEOPLE = [
    { age: '18-24', reg: 'Guará', comp: 'varias' },
    { age: '45-54', reg: 'Outra', comp: 'varias' },
    { age: '35-44', reg: 'Guará', comp: 'varias' },
    { age: '55+', reg: 'Guará', comp: 'varias' },
    { age: '18-24', reg: 'Outra', comp: 'varias' },
    { age: '18-24', reg: 'Vicente Pires', comp: 'algumas' },
    { age: '35-44', reg: 'Guará', comp: 'varias' },
    { age: '18-24', reg: 'Águas Claras', comp: 'varias' },
    { age: '18-24', reg: 'Águas Claras', comp: 'varias' },
    { age: '25-34', reg: 'Guará', comp: 'nao' },
    { age: '25-34', reg: 'Guará', comp: 'algumas' },
    { age: '45-54', reg: 'Plano Piloto', comp: 'varias' },
    { age: '45-54', reg: 'Outra', comp: 'varias' }
  ];
  const SETS = {
    comprou: p => p.comp !== 'nao',
    varias: p => p.comp === 'varias',
    guara: p => p.reg === 'Guará',
    jovem: p => p.age === '18-24',
    mais35: p => ['35-44', '45-54', '55+'].includes(p.age),
    regiao: p => ['Guará', 'Águas Claras', 'Plano Piloto'].includes(p.reg)
  };
  const peopleEl = $('#people');
  if (peopleEl) {
    peopleEl.innerHTML = PEOPLE.map((p, k) =>
      '<div class="person" style="--k:' + k + '"><svg viewBox="0 0 100 200"><circle class="head" cx="50" cy="52" r="30"/>' +
      '<path class="body" d="M12 200v-60c0-24 17-42 38-42s38 18 38 42v60z"/></svg></div>').join('');
    const persons = $$('.person', peopleEl);
    const highlight = key => {
      persons.forEach((el, k) => el.classList.toggle('on', SETS[key](PEOPLE[k])));
      $$('.stat-btn').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.set === key)));
    };
    $$('.stat-btn').forEach(b => b.addEventListener('click', () => highlight(b.dataset.set)));
    highlight('comprou');
    peopleEl._reset = () => highlight('comprou');
  }

  /* barras do gráfico de fatores: clique destaca */
  $$('.fbar').forEach(b => b.addEventListener('click', () => {
    const on = !b.classList.contains('sel');
    $$('.fbar').forEach(x => x.classList.remove('sel'));
    b.classList.toggle('sel', on);
  }));

  /* QR code ilustrativo (não funcional, só desenho) */
  function drawQR(svg) {
    let seed = 11;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    let h = '<rect width="29" height="29" fill="#fff"/>';
    for (let y = 0; y < 29; y++) for (let x = 0; x < 29; x++) {
      const inF = (x < 8 && y < 8) || (x > 20 && y < 8) || (x < 8 && y > 20);
      const inC = x > 10 && x < 18 && y > 10 && y < 18;
      if (!inF && !inC && rnd() > 0.52) h += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="#141212"/>';
    }
    const finder = (x, y) => '<rect x="' + x + '" y="' + y + '" width="7" height="7" fill="#141212"/><rect x="' + (x + 1) + '" y="' + (y + 1) + '" width="5" height="5" fill="#fff"/><rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="3" height="3" fill="#141212"/>';
    h += finder(0, 0) + finder(22, 0) + finder(0, 22);
    h += '<circle cx="14.5" cy="14.5" r="3.3" fill="#CF1446"/>';
    svg.setAttribute('shape-rendering', 'crispEdges');
    svg.innerHTML = h;
  }
  $$('.qr-illu').forEach(drawQR);

  /* ---------------- números que contam ---------------- */
  const fmt = (v, dec) => v.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  function setCount(el, v) { el.textContent = fmt(v, +(el.dataset.dec || 0)); }
  function delayOf(el) {
    const host = el.closest('[data-anim],[data-step]');
    if (!host) return 200;
    const d = parseFloat(getComputedStyle(host).getPropertyValue('--d')) || 0;
    return host.hasAttribute('data-step') ? 250 : d * 42 + 150;
  }
  function runCount(el) {
    const to = parseFloat(el.dataset.to);
    cancelAnimationFrame(el._raf);
    clearTimeout(el._t);
    if (reduced || isNaN(to)) { if (!isNaN(to)) setCount(el, to); return; }
    setCount(el, 0);
    el._t = setTimeout(() => {
      const dur = 1000, t0 = performance.now();
      const tick = now => {
        const p = Math.min(1, (now - t0) / dur);
        setCount(el, to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) el._raf = requestAnimationFrame(tick); else setCount(el, to);
      };
      el._raf = requestAnimationFrame(tick);
    }, delayOf(el));
  }
  function runCounters(scope) {
    $$('.count[data-to]', scope).forEach(el => {
      if (el.closest('.drawer')) return;
      const st = el.closest('[data-step]');
      if (st && !st.classList.contains('is-shown')) return;
      runCount(el);
    });
  }
  function settleCounters(scope) {
    $$('.count[data-to]', scope).forEach(el => {
      cancelAnimationFrame(el._raf); clearTimeout(el._t); setCount(el, parseFloat(el.dataset.to));
    });
  }

  /* ---------------- vídeos ---------------- */
  const allVideos = () => $$('video');
  function pauseVideos(scope) { $$('video', scope).forEach(v => { if (!v.paused) v.pause(); }); }
  function pauseOthers(except) { allVideos().forEach(v => { if (v !== except && !v.paused) v.pause(); }); }
  const fmtTime = t => { t = Math.max(0, Math.floor(t || 0)); return Math.floor(t / 60) + ':' + pad(t % 60); };

  $$('[data-player]').forEach(root => {
    const v = $('video', root);
    const big = $('.pbig', root);
    const cap = $('.pcap', root);
    const cues = root.dataset.captions && window.LEGENDAS ? window.LEGENDAS[root.dataset.captions] : null;
    const clipEnd = parseFloat(root.dataset.clip) || 0;
    let clipOn = clipEnd > 0;
    const ctl = document.createElement('div');
    ctl.className = 'pctl';
    ctl.setAttribute('role', 'group');
    ctl.setAttribute('aria-label', 'Controles do vídeo');
    ctl.innerHTML =
      '<button class="pbtn play" type="button" aria-label="Reproduzir"><svg class="ic-play"><use href="#i-play"/></svg><svg class="ic-pause"><use href="#i-pause"/></svg></button>' +
      '<button class="pbtn restart" type="button" aria-label="Reiniciar o vídeo"><svg><use href="#i-restart"/></svg></button>' +
      '<div class="pprog" role="slider" tabindex="0" aria-label="Posição do vídeo" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div>' +
      '<span class="ptime">0:00 / 0:00</span>' +
      '<button class="pbtn mute" type="button" aria-label="Ligar ou desligar o som"><svg class="ic-vol"><use href="#i-vol"/></svg><svg class="ic-mute"><use href="#i-mute"/></svg></button>' +
      '<input class="pvol" type="range" min="0" max="1" step="0.05" value="0.9" aria-label="Volume">' +
      (cues ? '<button class="pbtn cc" type="button" aria-label="Mostrar ou esconder legendas" aria-pressed="true"><svg><use href="#i-cc"/></svg></button>' : '');
    root.appendChild(ctl);
    let clipCtl = null;
    if (clipEnd) {
      clipCtl = document.createElement('div');
      clipCtl.className = 'pclip';
      clipCtl.setAttribute('role', 'group');
      clipCtl.setAttribute('aria-label', 'Duração do vídeo');
      clipCtl.innerHTML = '<button type="button" data-clip-mode="clip" aria-pressed="true">Trecho de ' + clipEnd + ' s</button>' +
        '<button type="button" data-clip-mode="full" aria-pressed="false">Vídeo completo</button>';
      root.appendChild(clipCtl);
    }

    const playBtn = $('.play', ctl), restartBtn = $('.restart', ctl), muteBtn = $('.mute', ctl);
    const vol = $('.pvol', ctl), prog = $('.pprog', ctl), bar = $('.pprog i', ctl), time = $('.ptime', ctl), ccBtn = $('.cc', ctl);
    v.volume = 0.9;
    if ('startMuted' in root.dataset) v.muted = true;
    v.controls = false;

    const span = () => (clipOn ? clipEnd : (v.duration || 0));
    const sync = () => {
      const playing = !v.paused && !v.ended;
      root.classList.toggle('is-playing', playing);
      root.classList.toggle('is-muted', v.muted || v.volume === 0);
      playBtn.setAttribute('aria-label', playing ? 'Pausar' : 'Reproduzir');
      vol.value = v.muted ? 0 : v.volume;
    };
    const upd = () => {
      const d = span(), t = Math.min(v.currentTime || 0, d || Infinity);
      const pc = d ? (t / d) * 100 : 0;
      bar.style.width = pc + '%';
      prog.setAttribute('aria-valuenow', String(Math.round(pc)));
      time.textContent = fmtTime(t) + ' / ' + fmtTime(d);
      if (clipOn && v.currentTime >= clipEnd && !v.paused) v.pause();
      if (cues && cap) {
        const c = (v.paused && v.currentTime === 0) ? null : cues.find(q => v.currentTime >= q[0] && v.currentTime < q[1]);
        const txt = c ? c[2] : '';
        if (cap._txt !== txt) { cap._txt = txt; cap.innerHTML = txt ? '<span></span>' : ''; if (txt) cap.firstChild.textContent = txt; }
      }
    };
    const toggle = () => {
      if (v.paused || v.ended) {
        if (clipOn && v.currentTime >= clipEnd - 0.15) v.currentTime = 0;
        safePlay(v);
      } else v.pause();
    };

    v.addEventListener('play', () => { pauseOthers(v); sync(); });
    ['pause', 'ended', 'volumechange'].forEach(ev => v.addEventListener(ev, sync));
    ['timeupdate', 'loadedmetadata', 'seeked'].forEach(ev => v.addEventListener(ev, upd));
    playBtn.addEventListener('click', toggle);
    big.addEventListener('click', toggle);
    v.addEventListener('click', toggle);
    restartBtn.addEventListener('click', () => { v.currentTime = 0; upd(); safePlay(v); });
    muteBtn.addEventListener('click', () => { v.muted = !v.muted; if (!v.muted && v.volume === 0) v.volume = 0.8; });
    vol.addEventListener('input', () => { v.volume = +vol.value; v.muted = v.volume === 0; });
    const seek = clientX => {
      const r = prog.getBoundingClientRect();
      const f = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
      if (span()) { v.currentTime = f * span(); upd(); }
    };
    prog.addEventListener('click', e => seek(e.clientX));
    prog.addEventListener('keydown', e => {
      if (!span()) return;
      if (e.key === 'ArrowRight') { v.currentTime = Math.min(span(), v.currentTime + 3); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { v.currentTime = Math.max(0, v.currentTime - 3); e.preventDefault(); }
    });
    if (ccBtn) ccBtn.addEventListener('click', () => {
      const on = ccBtn.getAttribute('aria-pressed') !== 'true';
      ccBtn.setAttribute('aria-pressed', String(on));
      cap.classList.toggle('off', !on);
    });
    if (clipCtl) $$('button', clipCtl).forEach(b => b.addEventListener('click', () => {
      clipOn = b.dataset.clipMode === 'clip';
      $$('button', clipCtl).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      if (clipOn && v.currentTime > clipEnd) v.currentTime = 0;
      upd();
    }));
    sync(); upd();
  });

  /* vídeos de fundo (sem som) */
  $$('.amb').forEach(fig => {
    const v = $('video', fig), b = $('.amb-toggle', fig);
    const sync = () => fig.classList.toggle('amb-paused', v.paused);
    v.muted = true;
    v.addEventListener('play', sync);
    v.addEventListener('pause', sync);
    b.addEventListener('click', () => {
      if (v.paused) { fig._userPaused = false; safePlay(v); } else { fig._userPaused = true; v.pause(); }
    });
    sync();
  });
  function playAmbient(s) {
    $$('.amb', s).forEach(fig => {
      const v = $('video', fig);
      if (!reduced && !fig._userPaused) safePlay(v);
    });
  }

  /* ---------------- gavetas (área complementar dentro do slide) ---------------- */
  function openDrawer(dr) {
    if (!dr) return;
    const s = dr.closest('.slide');
    $$('.drawer.open', s).forEach(d => { if (d !== dr) closeDrawer(d); });
    dr.classList.add('open');
    dr.setAttribute('aria-hidden', 'false');
    s.classList.add('dr-open');
    setTimeout(() => { const x = $('.dr-x', dr); if (x) x.focus({ preventScroll: true }); }, 60);
  }
  function closeDrawer(dr) {
    dr.classList.remove('open');
    dr.setAttribute('aria-hidden', 'true');
    pauseVideos(dr);
    const s = dr.closest('.slide');
    if (s && !$('.drawer.open', s)) s.classList.remove('dr-open');
    if (dr.contains(document.activeElement)) deck.focus({ preventScroll: true });
  }
  const closeDrawers = s => $$('.drawer.open', s).forEach(closeDrawer);
  const openDrawerIn = s => $('.drawer.open', s);

  /* recomendações: cada cartão abre a proposta completa (copiada do anexo) */
  $$('[data-rec]').forEach(btn => btn.addEventListener('click', () => {
    const src = document.querySelector(btn.dataset.rec);
    const dr = $('#drRec');
    if (!src || !dr) return;
    const body = $('.dr-body', dr);
    const clone = src.cloneNode(true);
    $$('[id]', clone).forEach(el => el.removeAttribute('id'));
    body.innerHTML = '';
    body.appendChild(clone);
    $$('.qr-illu', clone).forEach(drawQR);
    $('.dr-k', dr).textContent = (btn.dataset.recK || '') + ' · proposta ilustrativa';
    openDrawer(dr);
  }));

  /* ---------------- passos dentro do slide ---------------- */
  function setStep(s, k) {
    s._step = k;
    s.classList.toggle('stepped', k > 0);
    $$('[data-step]', s).forEach(el => {
      const show = +el.dataset.step <= k;
      const was = el.classList.contains('is-shown');
      el.classList.toggle('is-shown', show);
      if (show && !was && s.classList.contains('is-in')) runCounters(el);
    });
    $$('.step-dots i', s).forEach((d, i) => d.classList.toggle('on', i < k));
  }

  /* ---------------- navegação ---------------- */
  function enter(s, dir, at) {
    clearTimeout(s._outT);
    s.style.setProperty('--from', (reduced ? 0 : dir * 36) + 'px');
    s.classList.remove('is-leaving', 'is-in');
    s.classList.add('is-active');
    s.removeAttribute('aria-hidden');
    s.inert = false;
    setStep(s, at === 'end' ? s._max : 0);
    if (s.dataset.id === 'ap-perfil' && peopleEl && peopleEl._reset) peopleEl._reset();
    void s.offsetWidth;
    let done = false;
    const kick = () => {
      if (done || !s.classList.contains('is-active')) return;
      done = true;
      s.classList.add('is-in');
      runCounters(s);
      playAmbient(s);
    };
    requestAnimationFrame(kick);
    setTimeout(kick, 50);
  }
  function leave(s, dir) {
    s.style.setProperty('--to', (reduced ? 0 : -dir * 36) + 'px');
    s.classList.remove('is-active');
    s.classList.add('is-leaving');
    s.setAttribute('aria-hidden', 'true');
    s.inert = true;
    closeDrawers(s);
    pauseVideos(s);
    clearTimeout(s._outT);
    s._outT = setTimeout(() => {
      s.classList.remove('is-leaving', 'is-in');
      settleCounters(s);
    }, 520);
  }

  const wipe = $('#wipe');
  function show(toTrack, n, opts) {
    opts = opts || {};
    const arr = listOf(toTrack);
    n = Math.max(0, Math.min(arr.length - 1, n));
    if (busy) return;
    const from = cur();
    const nxt = arr[n];
    if (nxt === from && !opts.force) return;
    const fromI = track === 'main' ? idx : apIdx;
    const same = toTrack === track;
    const dir = same ? (n >= fromI ? 1 : -1) : (toTrack === 'ap' ? 1 : -1);
    const crosses = same && toTrack === 'main' && from !== nxt && from.dataset.chapter !== nxt.dataset.chapter;
    const swap = () => {
      if (from && from !== nxt) leave(from, dir);
      track = toTrack;
      if (track === 'main') idx = n; else apIdx = n;
      enter(nxt, dir, opts.atEnd ? 'end' : 'start');
      updateUI();
    };
    if (crosses && !reduced && !opts.instant) {
      busy = true;
      wipe.classList.remove('run'); void wipe.offsetWidth; wipe.classList.add('run');
      setTimeout(() => { swap(); busy = false; }, 300);
      setTimeout(() => wipe.classList.remove('run'), 720);
    } else {
      swap();
    }
  }
  const go = (n, opts) => show(track, n, opts);
  function openAp(id) {
    const i = apSlides.findIndex(s => s.dataset.id === id);
    if (i < 0) return;
    closePanel('chapters');
    if (mode !== 'deck') startDeck(idx, false);
    show('ap', i, { instant: true });
  }
  function backToMain() { if (track === 'ap') show('main', idx, { instant: true }); }
  function next() {
    if (busy) return;
    const s = cur();
    if (openDrawerIn(s)) { closeDrawers(s); return; }
    if (s._step < s._max) { setStep(s, s._step + 1); updateUI(); return; }
    const arr = listOf(track), i = track === 'main' ? idx : apIdx;
    if (i < arr.length - 1) go(i + 1);
  }
  function prev() {
    if (busy) return;
    const s = cur();
    if (openDrawerIn(s)) { closeDrawers(s); return; }
    if (s._step > 0) { setStep(s, s._step - 1); updateUI(); return; }
    const i = track === 'main' ? idx : apIdx;
    if (i > 0) go(i - 1, { atEnd: true });
  }

  /* ---------------- interface ---------------- */
  const hCount = $('#hCount'), progressBar = $('#progressBar'), apBar = $('#apBar');
  function updateUI() {
    const inAp = track === 'ap';
    hCount.textContent = inAp ? 'A' + pad(apIdx + 1) + ' / A' + pad(NA) : pad(idx + 1) + ' / ' + pad(N);
    progressBar.style.width = ((idx + 1) / N) * 100 + '%';
    progressBar.parentElement.style.opacity = inAp ? '.35' : '1';
    const arr = listOf(track), i = inAp ? apIdx : idx;
    $('#hPrev').disabled = i === 0 && cur()._step === 0;
    $('#hNext').disabled = i === arr.length - 1 && cur()._step >= cur()._max;
    apBar.hidden = !inAp;
    if (inAp) $('#apBack b').textContent = pad(idx + 1);
    store.set('eb-slide', String(idx));
    try { history.replaceState(null, '', '#' + (inAp ? 'a' + (apIdx + 1) : idx + 1)); } catch (e) {}
    $$('#chapList button[data-i]').forEach(b => {
      const isCur = !b.dataset.link && (b.dataset.t === track) && +b.dataset.i === (inAp ? apIdx : idx);
      b.classList.toggle('cur', isCur);
      if (isCur) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
    if ($('#notes').classList.contains('open')) renderNotes();
    updatePresenter();
  }

  function fit() {
    const sc = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stage.style.transform = 'translate(-50%, -50%) scale(' + sc + ')';
  }
  window.addEventListener('resize', fit);
  /* o palco nunca rola: se o foco tentar rolar a área (ex.: clique num botão), volta para o lugar */
  document.addEventListener('scroll', e => {
    const t = e.target;
    if (t === viewport || t === stage || (t.classList && (t.classList.contains('slide') || t.classList.contains('s-body')))) { t.scrollLeft = 0; t.scrollTop = 0; }
  }, true);

  /* tela cheia */
  const isFS = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
  function enterFS() {
    const el = document.documentElement;
    const rq = el.requestFullscreen || el.webkitRequestFullscreen;
    if (!rq) { toast('Tela cheia não disponível neste navegador. A apresentação segue normalmente.'); return; }
    try {
      const p = rq.call(el);
      if (p && p.catch) p.catch(() => toast('O navegador não permitiu a tela cheia. Use o botão ⛶ ou a tecla F.'));
    } catch (e) { /* segue sem tela cheia */ }
  }
  function exitFS() {
    const ex = document.exitFullscreen || document.webkitExitFullscreen;
    if (isFS() && ex) { try { const p = ex.call(document); if (p && p.catch) p.catch(() => {}); } catch (e) {} }
  }
  function toggleFS() { if (isFS()) exitFS(); else enterFS(); }
  const onFS = () => {
    const b = $('#hFs');
    b.innerHTML = '<svg><use href="#' + (isFS() ? 'i-fsx' : 'i-fs') + '"/></svg>';
    b.dataset.tip = isFS() ? 'Sair da tela cheia (F)' : 'Tela cheia (F)';
    fit();
  };
  document.addEventListener('fullscreenchange', onFS);
  document.addEventListener('webkitfullscreenchange', onFS);

  /* aviso rápido */
  let toastT;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove('show'), 3200);
  }

  /* controles somem quando não usados */
  let idleT, hudHover = false;
  const hud = $('#hud');
  function wake() {
    deck.classList.remove('idle');
    clearTimeout(idleT);
    idleT = setTimeout(() => {
      if (!hudHover && !anyPanelOpen() && !hud.contains(document.activeElement)) deck.classList.add('idle');
    }, 2400);
  }
  deck.addEventListener('mousemove', wake);
  deck.addEventListener('pointerdown', wake);
  hud.addEventListener('mouseenter', () => { hudHover = true; wake(); });
  hud.addEventListener('mouseleave', () => { hudHover = false; wake(); });
  hud.addEventListener('focusin', wake);

  /* ---------------- painéis ---------------- */
  const anyPanelOpen = () => $$('.panel.open').length > 0;
  function buildChapters() {
    const list = $('#chapList');
    if (list.childElementCount) return;
    let html = '', last = null;
    mainSlides.forEach((s, i) => {
      const ch = s.dataset.chapter;
      if (ch !== last) {
        if (last !== null) html += '</ul></li>';
        html += '<li><span class="ch-name">' + pad(+ch) + ' · ' + CHAPTERS[ch] + '</span><ul>';
        last = ch;
      }
      html += '<li><button type="button" data-t="main" data-i="' + i + '"><span>' + pad(i + 1) + '</span>' + esc(s.dataset.title) + '</button></li>';
    });
    html += '</ul></li>';
    html += '<li class="ap-sep" id="apList"><span class="ch-name">+ Dados e evidências da pesquisa</span><ul>';
    const googleI = mainSlides.findIndex(s => s.dataset.id === 'google');
    apSlides.forEach((s, i) => {
      html += '<li><button type="button" class="ap-item" data-t="ap" data-i="' + i + '"><span>A' + pad(i + 1) + '</span>' + esc(s.dataset.title) + '</button></li>';
      if (s.dataset.id === 'ap-comentarios' && googleI >= 0) {
        html += '<li><button type="button" class="ap-item" data-t="main" data-i="' + googleI + '" data-link="1"><span>' + pad(googleI + 1) + '</span>Avaliações do Google (é o slide ' + pad(googleI + 1) + ')</button></li>';
      }
    });
    html += '</ul></li>';
    list.innerHTML = html;
    $$('button', list).forEach(b => b.addEventListener('click', () => {
      closePanel('chapters');
      show(b.dataset.t, +b.dataset.i, { instant: true });
    }));
  }
  function openPanel(id, toAp) {
    const p = $('#' + id);
    p.classList.add('open');
    p.setAttribute('aria-hidden', 'false');
    if (id === 'chapters') {
      buildChapters(); updateUI();
      $('#hMenu').setAttribute('aria-expanded', 'true');
      setTimeout(() => {
        if (toAp) { const a = $('#apList'); a.scrollIntoView({ block: 'start' }); const b = $('button', a); if (b) b.focus({ preventScroll: true }); }
        else { const c = $('.cur', p) || $('button', p); if (c) c.focus(); }
      }, 60);
    }
    if (id === 'notes') { $('#hNotes').setAttribute('aria-pressed', 'true'); renderNotes(); }
    wake();
  }
  function closePanel(id) {
    const p = $('#' + id);
    if (!p.classList.contains('open')) return;
    p.classList.remove('open');
    p.setAttribute('aria-hidden', 'true');
    if (id === 'chapters') $('#hMenu').setAttribute('aria-expanded', 'false');
    if (id === 'notes') $('#hNotes').setAttribute('aria-pressed', 'false');
    if (p.contains(document.activeElement)) document.activeElement.blur();
    deck.focus({ preventScroll: true });
  }
  function togglePanel(id, toAp) { if ($('#' + id).classList.contains('open')) closePanel(id); else openPanel(id, toAp); }

  /* notas das apresentadoras */
  function notesHTML() {
    const s = cur();
    if (track === 'ap') {
      return '<span class="n-who">Material de consulta · A' + pad(apIdx + 1) + '</span>' +
        '<h3>' + esc(s.dataset.title) + '</h3><p class="n-obj">Fora da sequência principal. Use para responder perguntas.</p>' +
        '<p class="n-next"><b>Para voltar:</b> botão “Voltar ao slide ' + pad(idx + 1) + '” no topo, ou <b>Esc</b>.</p>';
    }
    const r = ROT.find(x => x.id === s.dataset.id);
    const nextTitle = idx < N - 1 ? mainSlides[idx + 1].dataset.title : '—';
    if (!r) return '<p>Sem notas para este slide.</p>';
    return '<span class="n-who">' + esc(r.quem) + ' · slide ' + pad(idx + 1) + (r.tempo ? ' · ' + esc(r.tempo) : '') + '</span>' +
      '<h3>' + esc(r.titulo) + '</h3><p class="n-obj">' + esc(r.objetivo) + '</p>' +
      '<h4>Sugestão de fala</h4><p>' + esc(r.fala) + '</p>' +
      '<h4>Não esquecer</h4><ul>' + r.lembrar.map(l => '<li>' + esc(l) + '</li>').join('') + '</ul>' +
      '<h4>Transição</h4><p>' + esc(r.transicao) + '</p>' +
      '<p class="n-next"><b>Próximo slide:</b> ' + esc(nextTitle) + '</p>';
  }
  function renderNotes() { $('#notesBody').innerHTML = notesHTML(); }

  /* janela da apresentadora (opcional, para usar em outra tela) */
  let pw = null, pwTimer = null;
  function openPresenter() {
    try { pw = window.open('', 'eb-apresentadora', 'width=760,height=920'); } catch (e) { pw = null; }
    if (!pw) { toast('O navegador bloqueou a janela. Use o painel de notas (tecla N).'); return; }
    const d = pw.document;
    d.open();
    d.write('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Notas — Espaço da Beleza</title><style>' +
      'body{margin:0;font-family:Manrope,"Helvetica Neue",Arial,sans-serif;background:#F5F1EB;color:#141212}' +
      'header{position:sticky;top:0;display:flex;gap:10px;align-items:center;justify-content:space-between;padding:14px 20px;background:#141212;color:#F5F1EB}' +
      'header b{font-size:22px;letter-spacing:.04em}#pwTime{font-variant-numeric:tabular-nums;font-weight:800;font-size:22px;color:#FF6A88}' +
      'button{font:inherit;font-weight:800;font-size:15px;padding:10px 16px;border-radius:999px;border:0;background:#F5F1EB;color:#141212;cursor:pointer}button:hover{background:#CF1446;color:#fff}' +
      'main{padding:20px 26px 40px}.n-who{display:inline-block;font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;background:#141212;color:#F5F1EB;padding:7px 12px;border-radius:999px}' +
      'h3{font-size:30px;margin:14px 0 4px;letter-spacing:-.02em}.n-obj{color:#5F5852;margin:0 0 14px}h4{margin:18px 0 6px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#CF1446}' +
      'p,li{font-size:20px;line-height:1.55}.n-next{background:#EAE3DA;padding:12px 16px;border-radius:12px;font-size:17px}.step{font-size:15px;color:#F5F1EB;opacity:.8}' +
      '</style></head><body><header><button id="pwPrev">← Anterior</button><div><b id="pwNum"></b> <span class="step" id="pwStep"></span></div><span id="pwTime">00:00</span><button id="pwNext">Próximo →</button></header><main id="pwBody"></main></body></html>');
    d.close();
    d.getElementById('pwPrev').addEventListener('click', () => prev());
    d.getElementById('pwNext').addEventListener('click', () => next());
    d.addEventListener('keydown', e => {
      if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); next(); }
      if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); prev(); }
    });
    clearInterval(pwTimer);
    pwTimer = setInterval(() => {
      if (!pw || pw.closed) { clearInterval(pwTimer); return; }
      const el = pw.document.getElementById('pwTime');
      if (el && startedAt) { const s = Math.floor((Date.now() - startedAt) / 1000); el.textContent = pad(Math.floor(s / 60)) + ':' + pad(s % 60); }
    }, 1000);
    updatePresenter();
  }
  function updatePresenter() {
    if (!pw || pw.closed) return;
    try {
      const d = pw.document, s = cur();
      d.getElementById('pwNum').textContent = track === 'ap' ? 'A' + pad(apIdx + 1) + ' (consulta)' : pad(idx + 1) + ' / ' + pad(N);
      d.getElementById('pwStep').textContent = s._max ? '· etapa ' + s._step + ' de ' + s._max : '';
      d.getElementById('pwBody').innerHTML = notesHTML();
    } catch (e) { /* janela fechada */ }
  }

  /* ---------------- modais ---------------- */
  let lastFocus = null;
  const openModalEl = () => $('.modal.open');
  function openModal(id) {
    lastFocus = document.activeElement;
    const m = $('#' + id);
    m.classList.add('open');
    m.setAttribute('aria-hidden', 'false');
    setTimeout(() => { const x = $('.xbtn', m); if (x) x.focus(); }, 40);
  }
  function closeModal(id) {
    const m = $('#' + id);
    m.classList.remove('open');
    m.setAttribute('aria-hidden', 'true');
    if (lastFocus && document.contains(lastFocus) && lastFocus.offsetParent !== null) lastFocus.focus({ preventScroll: true });
    else if (mode === 'deck') deck.focus({ preventScroll: true });
  }
  function trapTab(e, m) {
    const f = $$('button, a[href], input, [tabindex]:not([tabindex="-1"])', m).filter(x => x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  $('#lightbox').addEventListener('click', e => { if (e.target.id === 'lightbox' || e.target.classList.contains('lb-fig')) closeModal('lightbox'); });
  $$('.modal').forEach(m => m.addEventListener('click', e => { if (e.target === m) closeModal(m.id); }));

  document.addEventListener('click', e => {
    const ev = e.target.closest('.evidence');
    if (ev) {
      const img = $('#lbImg');
      img.src = ev.dataset.full;
      img.alt = (ev.querySelector('img') || {}).alt || '';
      $('#lbCap').textContent = ev.dataset.caption || '';
      openModal('lightbox');
      return;
    }
    const o = e.target.closest('[data-open]');
    if (o) { e.preventDefault(); openModal(o.dataset.open); return; }
    const c = e.target.closest('[data-close]');
    if (c) {
      const id = c.dataset.close;
      if ($('#' + id).classList.contains('modal')) closeModal(id); else closePanel(id);
      return;
    }
    const ga = e.target.closest('[data-goap]');
    if (ga) { openAp(ga.dataset.goap); return; }
    const dOpen = e.target.closest('[data-drawer]');
    if (dOpen) { openDrawer($('#' + dOpen.dataset.drawer)); return; }
    const dx = e.target.closest('.dr-x');
    if (dx) { closeDrawer(dx.closest('.drawer')); return; }
    if (e.target.classList && e.target.classList.contains('s-body') && e.target.closest('.slide.dr-open')) { closeDrawers(e.target.closest('.slide')); return; }
    const a = e.target.closest('[data-action="restart"]');
    if (a) { restart(); return; }
    /* depois de um clique com o mouse, tira o foco do botão para o espaço voltar a avançar */
    const b = e.target.closest('button');
    if (b && e.detail > 0 && mode === 'deck' && !b.closest('.modal, .panel')) b.blur();
  });

  /* ---------------- modo apresentação ---------------- */
  deck.setAttribute('tabindex', '-1');
  function restart() {
    if (track === 'main' && idx === 0) { setStep(cur(), 0); return; }
    show('main', 0, { instant: true });
    toast('Apresentação reiniciada');
  }
  function startDeck(at, fullscreen, apAt) {
    mode = 'deck';
    intro.hidden = true;
    deck.hidden = false;
    fit();
    allSlides.forEach(s => { clearTimeout(s._outT); s.classList.remove('is-active', 'is-leaving', 'is-in', 'dr-open'); s.setAttribute('aria-hidden', 'true'); s.inert = true; });
    idx = Math.max(0, Math.min(N - 1, at || 0));
    if (typeof apAt === 'number') { track = 'ap'; apIdx = Math.max(0, Math.min(NA - 1, apAt)); }
    else track = 'main';
    enter(cur(), 1, 'start');
    updateUI();
    if (!startedAt) startedAt = Date.now();
    if (fullscreen) enterFS();
    deck.focus({ preventScroll: true });
    wake();
  }
  function exitDeck() {
    pauseVideos(document);
    exitFS();
    ['chapters', 'notes'].forEach(closePanel);
    allSlides.forEach(closeDrawers);
    $('#blackout').classList.remove('on');
    mode = 'intro';
    track = 'main';
    deck.hidden = true;
    intro.hidden = false;
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    updateResume();
    $('#btnStart').focus({ preventScroll: true });
  }
  function updateResume() {
    const last = +(store.get('eb-slide') || 0);
    const r = $('#btnResume');
    if (last > 0 && last < N) { r.hidden = false; $('span', r).textContent = pad(last + 1); r.dataset.at = String(last); }
    else r.hidden = true;
  }

  $('#btnStart').addEventListener('click', () => startDeck(0, true));
  $('#btnResume').addEventListener('click', e => startDeck(+e.currentTarget.dataset.at || 0, true));
  const btnDados = $('#btnDados');
  if (btnDados) btnDados.addEventListener('click', () => { startDeck(0, false); openPanel('chapters', true); });
  $('#apBack').addEventListener('click', backToMain);
  $('#hPrev').addEventListener('click', prev);
  $('#hNext').addEventListener('click', next);
  $('#hMenu').addEventListener('click', () => togglePanel('chapters'));
  $('#hNotes').addEventListener('click', () => togglePanel('notes'));
  $('#hFs').addEventListener('click', toggleFS);
  $('#hRestart').addEventListener('click', restart);
  $('#hExit').addEventListener('click', exitDeck);
  $('#btnPresenter').addEventListener('click', openPresenter);
  $('#hMotion').addEventListener('click', () => {
    reduced = !reduced;
    store.set('eb-motion', reduced ? 'reduced' : 'full');
    applyMotion();
    if (reduced) settleCounters(cur());
    toast(reduced ? 'Animações reduzidas' : 'Animações ativadas');
  });

  const isInteractive = t => !!(t && t.closest && t.closest('button, a[href], input, select, textarea, [role="slider"], video'));

  document.addEventListener('keydown', e => {
    const m = openModalEl();
    if (m) {
      if (e.key === 'Escape') { e.preventDefault(); closeModal(m.id); }
      else if (e.key === 'Tab') trapTab(e, m);
      return;
    }
    if (mode !== 'deck') return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target;
    const k = e.key;
    const inSlider = t && t.matches && (t.matches('input[type="range"]') || t.getAttribute('role') === 'slider');
    if (k === 'Escape') {
      e.preventDefault();
      const s = cur();
      if (openDrawerIn(s)) { closeDrawers(s); return; }
      if ($('#chapters').classList.contains('open')) { closePanel('chapters'); return; }
      if ($('#notes').classList.contains('open')) { closePanel('notes'); return; }
      if ($('#blackout').classList.contains('on')) { $('#blackout').classList.remove('on'); return; }
      if (track === 'ap') { backToMain(); return; }
      if (isFS()) { exitFS(); return; }
      exitDeck();
      return;
    }
    if (inSlider && /^(Arrow|Home|End|Page)/.test(k)) return;
    switch (k) {
      case 'ArrowRight': case 'ArrowDown': case 'PageDown':
        e.preventDefault(); next(); break;
      case 'ArrowLeft': case 'ArrowUp': case 'PageUp':
        e.preventDefault(); prev(); break;
      case ' ': case 'Spacebar': case 'Enter':
        if (isInteractive(t)) return;
        e.preventDefault(); if (e.shiftKey) prev(); else next(); break;
      case 'Home': e.preventDefault(); go(0, { instant: true }); break;
      case 'End': e.preventDefault(); go(listOf(track).length - 1, { atEnd: true, instant: true }); break;
      case 'f': case 'F': e.preventDefault(); toggleFS(); break;
      case 'm': case 'M': e.preventDefault(); togglePanel('chapters'); break;
      case 'd': case 'D': e.preventDefault(); togglePanel('chapters', true); break;
      case 'n': case 'N': e.preventDefault(); togglePanel('notes'); break;
      case 'b': case 'B': case '.':
        e.preventDefault(); $('#blackout').classList.toggle('on'); break;
      default: break;
    }
  });

  /* toque: deslizar para os lados */
  let sx = 0, sy = 0, st = 0, tracking = false;
  viewport.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse') return;
    if (e.target.closest('button, a, input, .pctl, video, .evidence, .drawer')) return;
    tracking = true; sx = e.clientX; sy = e.clientY; st = Date.now();
  });
  viewport.addEventListener('pointerup', e => {
    if (!tracking) return;
    tracking = false;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3 && Date.now() - st < 900) { if (dx < 0) next(); else prev(); }
  });
  viewport.addEventListener('pointercancel', () => { tracking = false; });
  $('#blackout').addEventListener('click', () => $('#blackout').classList.remove('on'));

  /* início: #7 abre direto no slide 7; #a3 abre o item A03 dos dados (útil para ensaiar) */
  updateResume();
  const hash = (location.hash || '').replace('#', '');
  const hm = hash.match(/^a(\d+)$/i);
  const hn = parseInt(hash, 10);
  if (hm && +hm[1] >= 1 && +hm[1] <= NA) startDeck(0, false, +hm[1] - 1);
  else if (hn >= 1 && hn <= N) startDeck(hn - 1, false);

  /* depuração leve para os testes */
  window.__eb = {
    go: i => show('main', i, { instant: true }), ap: i => show('ap', i, { instant: true }), next, prev,
    get idx() { return idx; }, get track() { return track; }, N, NA
  };
})();
