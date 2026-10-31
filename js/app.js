/* ============================================================
   NORTHSTAR ADVISORY — Brand Guidelines Site
   app.js v2.0 — Enhanced with Real SVG Assets & Mobile Optimization
   ============================================================ */

(function () {
  'use strict';

  const DATA = window.NORTHSTAR_DATA;

  /* ============================================================
     UTILITY HELPERS
  ============================================================ */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return [...(ctx || document).querySelectorAll(sel)]; }

  function copyText(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }

  function showToast(msg) {
    let toast = $('#toast-msg');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-msg';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.style.cssText = `
        position:fixed;bottom:32px;left:50%;transform:translateX(-50%) translateY(60px);
        background:var(--blue);color:#fff;padding:12px 24px;border-radius:6px;
        font-family:var(--font-body);font-size:14px;font-weight:600;z-index:99999;
        box-shadow:0 8px 24px rgba(0,0,0,0.5), 0 0 20px rgba(45,107,255,0.4);
        transition:transform 0.3s cubic-bezier(0.22,1,0.36,1),opacity 0.3s;
        opacity:0;pointer-events:none;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.transform = 'translateX(-50%) translateY(0)';
    toast.style.opacity = '1';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(60px)';
      toast.style.opacity = '0';
    }, 2400);
  }

  /* ============================================================
     SCROLL PROGRESS BAR
  ============================================================ */
  const progressBar = $('#scroll-progress');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (scrollTop / docH) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ============================================================
     THEME TOGGLE
  ============================================================ */
  const themeToggle = $('#theme-toggle');
  let isDark = true;

  function applyTheme(dark) {
    isDark = dark;
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    if (themeToggle) themeToggle.textContent = dark ? '☀️' : '🌙';
    updatePlayground();
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => applyTheme(!isDark));
  }

  /* ============================================================
     MOBILE NAVIGATION DRAWER
  ============================================================ */
  const mobileToggle = $('#mobile-toggle');
  const mobileDrawer = $('#mobile-drawer');
  const mobileClose = $('#mobile-close');
  const mobileBackdrop = $('#mobile-backdrop');
  const mLinks = $$('.m-link');
  const mCmdOpen = $('#m-cmd-open');
  const mThemeToggle = $('#m-theme-toggle');

  function openMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (mobileBackdrop) mobileBackdrop.classList.add('open');
    if (mobileToggle) {
      mobileToggle.classList.add('active');
      mobileToggle.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (mobileBackdrop) mobileBackdrop.classList.remove('open');
    if (mobileToggle) {
      mobileToggle.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      if (mobileDrawer && mobileDrawer.classList.contains('open')) closeMobileDrawer();
      else openMobileDrawer();
    });
  }

  if (mobileClose) mobileClose.addEventListener('click', closeMobileDrawer);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileDrawer);
  mLinks.forEach(l => l.addEventListener('click', closeMobileDrawer));

  if (mCmdOpen) {
    mCmdOpen.addEventListener('click', () => {
      closeMobileDrawer();
      openCmdPalette();
    });
  }

  if (mThemeToggle) {
    mThemeToggle.addEventListener('click', () => {
      applyTheme(!isDark);
      closeMobileDrawer();
    });
  }

  /* ============================================================
     NAV SCROLLSPY
  ============================================================ */
  const navLinks = $$('#nav .nav-links a');
  const sections = $$('section[id]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => {
          const href = a.getAttribute('href');
          const active = href === '#' + id;
          a.classList.toggle('active', active);
          if (active) a.setAttribute('aria-current', 'section');
          else a.removeAttribute('aria-current');
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(s => observer.observe(s));

  /* ============================================================
     POPULATE — VALUES GRID
  ============================================================ */
  const valuesGrid = $('#values-grid');
  if (valuesGrid && DATA.core_values) {
    valuesGrid.innerHTML = DATA.core_values.map((v, i) => `
      <div class="value-card card" tabindex="0">
        <div class="value-num">${String(i + 1).padStart(2, '0')}</div>
        <h4 class="value-title">${v.title}</h4>
        <p class="value-desc">${v.desc}</p>
      </div>
    `).join('');
  }

  /* ============================================================
     POPULATE — PILLARS GRID
  ============================================================ */
  const pillarsGrid = $('#pillars-grid');
  if (pillarsGrid && DATA.pillars) {
    const icons = ['◆', '◇', '▲', '○'];
    pillarsGrid.innerHTML = DATA.pillars.map((p, i) => `
      <div class="pillar-card card" tabindex="0">
        <div class="pillar-icon" aria-hidden="true">${icons[i] || '◆'}</div>
        <h4 class="pillar-name">${p.name}</h4>
        <p class="pillar-statement">${p.statement}</p>
      </div>
    `).join('');
  }

  /* ============================================================
     POPULATE — TONE OF VOICE SLIDERS
  ============================================================ */
  const tovContainer = $('#tov-sliders');
  const tovData = [
    { left: 'Formal', right: 'Conversational', pos: 35 },
    { left: 'Reserved', right: 'Enthusiastic', pos: 25 },
    { left: 'Corporate', right: 'Human', pos: 55 },
    { left: 'Complex', right: 'Simple', pos: 80 },
    { left: 'Cautious', right: 'Confident', pos: 75 },
  ];

  if (tovContainer) {
    tovContainer.innerHTML = tovData.map(t => `
      <div class="tov-row">
        <span class="tov-label">${t.left}</span>
        <div class="tov-track" role="img" aria-label="${t.left} to ${t.right}: brand position at ${t.pos}%">
          <div class="tov-fill" style="width:${t.pos}%;"></div>
          <div class="tov-marker" style="left:${t.pos}%;"></div>
        </div>
        <span class="tov-label">${t.right}</span>
      </div>
    `).join('');
  }

  /* ============================================================
     LOGO PLAYGROUND — POWERED BY GENUINE SVG ASSETS
  ============================================================ */
  const logoImg = $('#playground-logo');
  const playgroundStage = $('#playground-stage');
  const clearspaceBox = $('#clearspace-box');
  const scaleSlider = $('#logo-scale');
  const scaleVal = $('#scale-val');
  const clearspaceToggle = $('#clearspace-toggle');
  const logoDownload = $('#logo-download');

  let currentLogoType = 'primary-logo';
  let currentGround = 'navy';

  const groundColors = {
    navy: '#0B1F3A',
    ivory: '#F5F1E8',
    white: '#FFFFFF',
    blue: '#2D6BFF'
  };

  const logoModels = {
    'primary-logo': {
      navy: 'assets/logos/primary-logo.svg',
      ivory: 'assets/logos/full-logo-ivory.svg',
      white: 'assets/logos/full-logo-white.svg',
      blue: 'assets/logos/primary-logo.svg',
      default: 'assets/logos/primary-logo.svg',
      downloadName: 'Northstar_Advisory_Primary_Logo.svg'
    },
    'primary-mark': {
      navy: 'assets/logos/primary-logomark.svg',
      ivory: 'assets/logos/logomark-ivory.svg',
      white: 'assets/logos/logomark-white.svg',
      blue: 'assets/logos/primary-logomark.svg',
      default: 'assets/logos/primary-logomark.svg',
      downloadName: 'Northstar_Advisory_Primary_Logomark.svg'
    },
    'ivory-logo': {
      navy: 'assets/logos/full-logo-ivory.svg',
      ivory: 'assets/logos/full-logo-ivory.svg',
      white: 'assets/logos/full-logo-ivory.svg',
      blue: 'assets/logos/full-logo-ivory.svg',
      default: 'assets/logos/full-logo-ivory.svg',
      downloadName: 'Northstar_Advisory_Full_Logo_Ivory.svg'
    },
    'navy-blue-logo': {
      navy: 'assets/logos/full-logo-navy-blue.svg',
      ivory: 'assets/logos/full-logo-navy-blue.svg',
      white: 'assets/logos/full-logo-navy-blue.svg',
      blue: 'assets/logos/full-logo-navy-blue.svg',
      default: 'assets/logos/full-logo-navy-blue.svg',
      downloadName: 'Northstar_Advisory_Full_Logo_Navy_Blue.svg'
    },
    'navy-white-logo': {
      navy: 'assets/logos/full-logo-navy-white.svg',
      ivory: 'assets/logos/full-logo-navy-white.svg',
      white: 'assets/logos/full-logo-navy-white.svg',
      blue: 'assets/logos/full-logo-navy-white.svg',
      default: 'assets/logos/full-logo-navy-white.svg',
      downloadName: 'Northstar_Advisory_Full_Logo_Minimal_White.svg'
    },
    'stacked-logo': {
      navy: 'assets/logos/logo-stacked-navy-blue.svg',
      ivory: 'assets/logos/logo-stacked-light.svg',
      white: 'assets/logos/logo-stacked-white.svg',
      blue: 'assets/logos/logo-stacked-navy-white.svg',
      default: 'assets/logos/logo-stacked-navy-blue.svg',
      downloadName: 'Northstar_Advisory_Corporate_Stacked.svg'
    }
  };

  function updatePlayground() {
    if (!logoImg) return;
    const model = logoModels[currentLogoType] || logoModels['primary-logo'];
    const src = model[currentGround] || model.default;

    logoImg.src = src;
    logoImg.alt = `Northstar Advisory ${currentLogoType} on ${currentGround}`;

    if (playgroundStage) {
      playgroundStage.style.backgroundColor = groundColors[currentGround] || '#0B1F3A';
    }

    const size = scaleSlider ? parseInt(scaleSlider.value) : 260;
    logoImg.style.width = size + 'px';
    logoImg.style.maxWidth = '90%';
    logoImg.style.height = 'auto';

    // Clear space overlay
    if (clearspaceBox && clearspaceToggle) {
      if (clearspaceToggle.checked) {
        const markH = Math.max(size * 0.28, 24);
        clearspaceBox.style.padding = markH + 'px';
        clearspaceBox.style.border = '1.5px dashed rgba(45,107,255,0.7)';
        clearspaceBox.style.display = 'inline-block';
      } else {
        clearspaceBox.style.display = 'none';
      }
    }

    if (logoDownload) {
      logoDownload.dataset.src = src;
      logoDownload.dataset.filename = model.downloadName || 'Northstar_Advisory_Logo.svg';
    }
  }

  // Logo type tabs
  $$('#logo-type-tabs .radio-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('#logo-type-tabs .radio-tab').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      currentLogoType = btn.dataset.type;
      updatePlayground();
    });
  });

  // Ground tabs
  $$('#logo-ground-tabs .radio-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('#logo-ground-tabs .radio-tab').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      currentGround = btn.dataset.ground;
      updatePlayground();
    });
  });

  // Scale slider
  if (scaleSlider) {
    scaleSlider.addEventListener('input', () => {
      if (scaleVal) scaleVal.textContent = scaleSlider.value;
      updatePlayground();
    });
  }

  if (clearspaceToggle) {
    clearspaceToggle.addEventListener('change', updatePlayground);
  }

  // Download SVG
  if (logoDownload) {
    logoDownload.addEventListener('click', () => {
      const src = logoDownload.dataset.src || (logoImg ? logoImg.src : '');
      const filename = logoDownload.dataset.filename || 'Northstar_Advisory_Logo.svg';
      if (!src) return;
      const a = document.createElement('a');
      a.href = src;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('Downloaded ' + filename);
    });
  }

  updatePlayground();

  /* ============================================================
     COLOUR SWATCHES
  ============================================================ */
  const swatchGrid = $('#color-swatch-grid');
  if (swatchGrid && DATA.colors) {
    swatchGrid.innerHTML = DATA.colors.core.map(c => `
      <div class="color-swatch-card" role="button" tabindex="0"
           data-hex="${c.hex}" aria-label="Copy ${c.name} hex: ${c.hex}">
        <div class="swatch-block" style="background:${c.hex};" aria-hidden="true"></div>
        <div class="swatch-info">
          <div class="swatch-name">${c.name}</div>
          <div class="swatch-hex">${c.hex}</div>
          <div class="swatch-detail">RGB ${c.rgb}</div>
          <div class="swatch-detail">CMYK ${c.cmyk}</div>
          <div class="swatch-detail">Pantone ${c.pantone}</div>
          <div class="swatch-role">${c.role}</div>
        </div>
        <div class="swatch-copy-hint" aria-hidden="true">Click to copy hex</div>
      </div>
    `).join('');

    swatchGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.color-swatch-card');
      if (!card) return;
      copyText(card.dataset.hex);
      showToast('Copied ' + card.dataset.hex);
    });
    swatchGrid.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const card = e.target.closest('.color-swatch-card');
        if (card) { copyText(card.dataset.hex); showToast('Copied ' + card.dataset.hex); }
      }
    });
  }

  // Extended swatches
  const extSwatches = $('#extended-swatches');
  if (extSwatches && DATA.colors) {
    extSwatches.innerHTML = DATA.colors.extended.map(c => `
      <div class="ext-swatch" role="button" tabindex="0"
           data-hex="${c.hex}" aria-label="Copy ${c.name}: ${c.hex}"
           title="${c.name} — ${c.hex}">
        <div class="ext-swatch-block" style="background:${c.hex};"></div>
        <div class="ext-swatch-name">${c.name}</div>
        <div class="ext-swatch-hex">${c.hex}</div>
      </div>
    `).join('');

    extSwatches.addEventListener('click', (e) => {
      const el = e.target.closest('.ext-swatch');
      if (!el) return;
      copyText(el.dataset.hex); showToast('Copied ' + el.dataset.hex);
    });
  }

  // Contrast matrix
  const contrastMatrix = $('#contrast-matrix');
  const pairs = [
    { fg: '#F5F1E8', bg: '#0B1F3A', fgN: 'Ivory', bgN: 'Navy', ratio: '13.2:1', pass: 'AAA' },
    { fg: '#0B1F3A', bg: '#F5F1E8', fgN: 'Navy', bgN: 'Ivory', ratio: '13.2:1', pass: 'AAA' },
    { fg: '#F5F1E8', bg: '#2D6BFF', fgN: 'Ivory', bgN: 'Blue', ratio: '3.1:1', pass: 'A (large)' },
    { fg: '#2D6BFF', bg: '#0B1F3A', fgN: 'Blue', bgN: 'Navy', ratio: '4.8:1', pass: 'AA' },
    { fg: '#FFFFFF', bg: '#0B1F3A', fgN: 'White', bgN: 'Navy', ratio: '14.7:1', pass: 'AAA' },
    { fg: '#FFFFFF', bg: '#2D6BFF', fgN: 'White', bgN: 'Blue', ratio: '3.5:1', pass: 'A (large)' },
  ];

  if (contrastMatrix) {
    contrastMatrix.innerHTML = `<div class="contrast-grid">${pairs.map(p => `
      <div class="contrast-pair" style="background:${p.bg};border:1px solid rgba(255,255,255,0.08);">
        <div class="contrast-sample" style="color:${p.fg};font-family:var(--font-display);font-weight:700;font-size:18px;">${p.fgN}</div>
        <div class="contrast-sample" style="color:${p.fg};font-size:13px;opacity:0.7;">on ${p.bgN}</div>
        <div class="contrast-badge ${p.pass.startsWith('AAA') ? 'badge-aaa' : p.pass.startsWith('AA') ? 'badge-aa' : 'badge-a'}">${p.pass}</div>
        <div class="contrast-ratio" style="color:${p.fg};opacity:0.6;font-size:12px;">${p.ratio}</div>
      </div>
    `).join('')}</div>`;
  }

  /* ============================================================
     TYPOGRAPHY HIERARCHY
  ============================================================ */
  const typeHierarchy = $('#type-hierarchy');
  if (typeHierarchy && DATA.typography) {
    typeHierarchy.innerHTML = DATA.typography.hierarchy.map(h => `
      <div class="type-hierarchy-row">
        <div class="th-level">${h.level}</div>
        <div class="th-sample" style="
          font-family:${h.font.includes('Manrope') ? "'Manrope', sans-serif" : "'DM Sans', sans-serif"};
          font-weight:${h.font.includes('Bold') ? 700 : h.font.includes('Semi') ? 600 : h.font.includes('Medium') ? 500 : h.font.includes('Light') ? 300 : 400};
          font-size:clamp(15px, ${h.size.split('–')[0].trim()}, ${h.size.split('–')[1] || h.size.split('–')[0].trim()});
          line-height:${h.lh};
          letter-spacing:${h.tracking || '0'};
        ">The direction of clarity.</div>
        <div class="th-spec">
          <span><strong>${h.font}</strong></span>
          <span>${h.size}</span>
          <span>LH ${h.lh}</span>
          ${h.tracking ? `<span>+${h.tracking} tracking</span>` : ''}
        </div>
      </div>
    `).join('');
  }

  /* ============================================================
     TYPOGRAPHY STUDIO
  ============================================================ */
  const studioFont = $('#studio-font');
  const studioWeight = $('#studio-weight');
  const studioSize = $('#studio-size');
  const studioTracking = $('#studio-tracking');
  const studioSizeVal = $('#studio-size-val');
  const studioTrackingVal = $('#studio-tracking-val');
  const studioPreviewInner = $('#studio-preview-inner');
  const studioPreview = $('#studio-preview');

  const studioBgColors = { navy: '#0B1F3A', ivory: '#F5F1E8', blue: '#2D6BFF' };
  const studioBgText = { navy: '#F5F1E8', ivory: '#0B1F3A', blue: '#F5F1E8' };
  let studioBg = 'navy';

  function updateStudio() {
    if (!studioPreviewInner) return;
    const font = studioFont ? studioFont.value : "'Manrope', sans-serif";
    const weight = studioWeight ? studioWeight.value : '700';
    const size = studioSize ? studioSize.value : '32';
    const tracking = studioTracking ? (parseInt(studioTracking.value) / 100).toFixed(2) : '0';

    studioPreviewInner.style.fontFamily = font;
    studioPreviewInner.style.fontWeight = weight;
    studioPreviewInner.style.fontSize = size + 'px';
    studioPreviewInner.style.letterSpacing = tracking + 'em';
    studioPreviewInner.style.lineHeight = '1.2';

    if (studioPreview) {
      studioPreview.style.background = studioBgColors[studioBg] || '#0B1F3A';
      studioPreviewInner.style.color = studioBgText[studioBg] || '#F5F1E8';
    }

    if (studioSizeVal) studioSizeVal.textContent = size;
    if (studioTrackingVal) studioTrackingVal.textContent = (parseInt(studioTracking ? studioTracking.value : 0) / 100).toFixed(2);
  }

  [studioFont, studioWeight, studioSize, studioTracking].forEach(el => {
    if (el) el.addEventListener('input', updateStudio);
  });

  $$('#studio-bg-tabs .radio-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('#studio-bg-tabs .radio-tab').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      studioBg = btn.dataset.bg;
      updateStudio();
    });
  });

  updateStudio();

  /* ============================================================
     PHOTO GALLERY + LIGHTBOX
  ============================================================ */
  const galleryGrid = $('#gallery-grid');
  const lightbox = $('#lightbox');
  const lbImg = $('#lb-img');
  const lbCaption = $('#lb-caption');
  const lbClose = $('#lb-close');
  const lbPrev = $('#lb-prev');
  const lbNext = $('#lb-next');
  let lbItems = [];
  let lbCurrent = 0;

  function openLightbox(index) {
    lbCurrent = index;
    const item = lbItems[index];
    if (!item || !lightbox) return;
    lbImg.src = item.dataset.src;
    lbImg.alt = item.querySelector('img').alt;
    if (lbCaption) lbCaption.textContent = item.dataset.caption || '';
    lightbox.hidden = false;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
    if (lbItems[lbCurrent]) {
      lbItems[lbCurrent].querySelector('img').focus();
    }
  }

  function lbNavigate(dir) {
    lbCurrent = (lbCurrent + dir + lbItems.length) % lbItems.length;
    openLightbox(lbCurrent);
  }

  if (galleryGrid) {
    lbItems = $$('.gallery-item', galleryGrid);

    galleryGrid.addEventListener('click', (e) => {
      const item = e.target.closest('.gallery-item');
      if (!item) return;
      const idx = lbItems.indexOf(item);
      openLightbox(idx);
    });
  }

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev) lbPrev.addEventListener('click', () => lbNavigate(-1));
  if (lbNext) lbNext.addEventListener('click', () => lbNavigate(1));

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Gallery filter
  $$('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      $$('.gallery-item').forEach(item => {
        const cat = item.dataset.cat;
        item.style.display = (filter === 'all' || cat === filter) ? '' : 'none';
      });
      lbItems = $$('.gallery-item', galleryGrid).filter(el => el.style.display !== 'none');
    });
  });

  /* ============================================================
     BRAND VOICE — WORD LISTS + COPY ANALYZER
  ============================================================ */
  const approvedWords = $('#approved-words');
  const bannedWords = $('#banned-words');

  if (approvedWords && DATA.voice) {
    approvedWords.innerHTML = DATA.voice.approved.map(w =>
      `<span class="word-tag approved-tag" tabindex="0">${w}</span>`
    ).join('');
  }

  if (bannedWords && DATA.voice) {
    bannedWords.innerHTML = DATA.voice.banned.map(w =>
      `<span class="word-tag banned-tag" tabindex="0">${w}</span>`
    ).join('');
  }

  const copyInput = $('#copy-input');
  const scoreNum = $('#score-num');
  const analyzerScore = $('#analyzer-score');
  const analyzerResults = $('#analyzer-results');
  const clearCopy = $('#clear-copy');

  function analyzeCopy() {
    if (!copyInput || !DATA.voice) return;
    const text = copyInput.value.toLowerCase();

    if (!text.trim()) {
      if (analyzerResults) analyzerResults.innerHTML = '<div class="results-empty">Start typing to analyze voice compliance…</div>';
      if (scoreNum) scoreNum.textContent = '100';
      if (analyzerScore) analyzerScore.dataset.score = 'good';
      return;
    }

    const foundBanned = DATA.voice.banned.filter(bw => {
      const re = new RegExp('\\b' + bw.replace(/-/g, '[-\\s]') + '\\b', 'gi');
      return re.test(text);
    });

    const foundApproved = DATA.voice.approved.filter(aw => {
      const re = new RegExp('\\b' + aw + '\\b', 'gi');
      return re.test(text);
    });

    let score = 100;
    score -= foundBanned.length * 18;
    score = Math.max(0, score);
    if (foundApproved.length > 0) score = Math.min(100, score + foundApproved.length * 4);

    if (scoreNum) scoreNum.textContent = score;
    if (analyzerScore) {
      analyzerScore.dataset.score = score >= 80 ? 'good' : score >= 50 ? 'medium' : 'poor';
      analyzerScore.style.color = score >= 80 ? '#4ade80' : score >= 50 ? '#facc15' : '#f87171';
    }

    let html = '';
    if (foundBanned.length > 0) {
      html += `<div class="result-group"><div class="result-label result-bad">✕ Banned buzzwords found (−${foundBanned.length * 18} pts)</div>`;
      html += foundBanned.map(w => `<span class="word-tag banned-tag">${w}</span>`).join('') + '</div>';
    }
    if (foundApproved.length > 0) {
      html += `<div class="result-group"><div class="result-label result-good">✓ On-brand vocabulary (+${foundApproved.length * 4} pts)</div>`;
      html += foundApproved.map(w => `<span class="word-tag approved-tag">${w}</span>`).join('') + '</div>';
    }
    if (foundBanned.length === 0 && foundApproved.length === 0) {
      html = '<div class="results-empty">No banned words detected. Score: ' + score + '</div>';
    }

    if (analyzerResults) analyzerResults.innerHTML = html;
  }

  if (copyInput) copyInput.addEventListener('input', analyzeCopy);
  if (clearCopy) {
    clearCopy.addEventListener('click', () => {
      if (copyInput) copyInput.value = '';
      analyzeCopy();
    });
  }

  /* ============================================================
     SOCIAL POST GENERATOR
  ============================================================ */
  const socialHeadline = $('#social-headline');
  const socialSub = $('#social-sub');
  const socialPreviewHeadline = $('#social-preview-headline');
  const socialPreviewSub = $('#social-preview-sub');
  const socialPostPreview = $('#social-post-preview');

  const socialBgColors = { navy: '#0B1F3A', ivory: '#F5F1E8', blue: '#2D6BFF' };
  const socialBgText = { navy: '#F5F1E8', ivory: '#0B1F3A', blue: '#F5F1E8' };
  let socialBg = 'navy';

  function updateSocialPost() {
    if (socialPreviewHeadline && socialHeadline) socialPreviewHeadline.textContent = socialHeadline.value;
    if (socialPreviewSub && socialSub) socialPreviewSub.textContent = socialSub.value;
    if (socialPostPreview) {
      socialPostPreview.style.background = socialBgColors[socialBg] || '#0B1F3A';
      socialPostPreview.style.color = socialBgText[socialBg] || '#F5F1E8';
    }
  }

  if (socialHeadline) socialHeadline.addEventListener('input', updateSocialPost);
  if (socialSub) socialSub.addEventListener('input', updateSocialPost);

  $$('#social-bg-tabs .radio-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('#social-bg-tabs .radio-tab').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      socialBg = btn.dataset.bg;
      updateSocialPost();
    });
  });

  updateSocialPost();

  /* ============================================================
     MOTION SIMULATOR — GENUINE STAR MARK DRAW-ON
  ============================================================ */
  function initMotionAnimation(svgId) {
    const segs = $$(`#${svgId} .motion-seg`);
    segs.forEach(seg => {
      const len = seg.getTotalLength ? seg.getTotalLength() : 800;
      seg.style.strokeDasharray = len;
      seg.style.strokeDashoffset = len;
      seg.style.transition = 'none';
    });

    requestAnimationFrame(() => {
      segs.forEach((seg, i) => {
        const delay = i * 140;
        const dur = 400;
        setTimeout(() => {
          seg.style.transition = `stroke-dashoffset ${dur}ms cubic-bezier(0.22,1,0.36,1)`;
          seg.style.strokeDashoffset = '0';
        }, delay);
      });
    });
  }

  const replayMotion = $('#replay-motion');
  if (replayMotion) {
    replayMotion.addEventListener('click', () => initMotionAnimation('motion-logo-svg'));
  }

  const motionSection = $('#motion-system');
  if (motionSection) {
    const motionObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setTimeout(() => initMotionAnimation('motion-logo-svg'), 300);
          motionObs.unobserve(motionSection);
        }
      });
    });
    motionObs.observe(motionSection);
  }

  // Text reveal demo
  function initTextReveal() {
    const lines = $$('#text-reveal-demo .reveal-line-item');
    lines.forEach(line => {
      line.style.opacity = '0';
      line.style.transform = 'translateY(12px)';
      line.style.transition = 'none';
    });
    lines.forEach((line, i) => {
      setTimeout(() => {
        line.style.transition = 'opacity 0.4s cubic-bezier(0.22,1,0.36,1), transform 0.4s cubic-bezier(0.22,1,0.36,1)';
        line.style.opacity = '1';
        line.style.transform = 'none';
      }, 250 + i * 110);
    });
  }

  const replayTextReveal = $('#replay-text-reveal');
  if (replayTextReveal) {
    replayTextReveal.addEventListener('click', initTextReveal);
  }

  if (motionSection) {
    const textRevealObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setTimeout(initTextReveal, 550);
          textRevealObs.unobserve(motionSection);
        }
      });
    });
    textRevealObs.observe(motionSection);
  }

  /* ============================================================
     42-PAGE SLIDE INSPECTOR (DESKTOP & TOUCH MOBILE)
  ============================================================ */
  const inspectorImg = $('#inspector-img');
  const inspectorCounter = $('#inspector-counter');
  const inspectorPageTitle = $('#inspector-page-title');
  const inspectorPageDesc = $('#inspector-page-desc');
  const inspectorSectionTag = $('#inspector-section-tag');
  const inspectorThumbs = $('#inspector-thumbnails');
  const inspPrev = $('#insp-prev');
  const inspNext = $('#insp-next');
  const inspectorStage = $('#inspector-stage');

  let currentPage = 0;

  function buildThumbnails() {
    if (!inspectorThumbs || !DATA.pages) return;
    inspectorThumbs.innerHTML = DATA.pages.map((p, i) => `
      <div class="insp-thumb ${i === 0 ? 'active' : ''}" data-idx="${i}"
           role="option" tabindex="0" aria-selected="${i === 0}"
           aria-label="Page ${p.page}: ${p.title}">
        <img src="${p.image}" alt="" loading="lazy" />
        <span class="insp-thumb-num">${p.page}</span>
      </div>
    `).join('');

    inspectorThumbs.addEventListener('click', (e) => {
      const thumb = e.target.closest('.insp-thumb');
      if (!thumb) return;
      selectPage(parseInt(thumb.dataset.idx));
    });

    inspectorThumbs.addEventListener('keydown', (e) => {
      const thumb = e.target.closest('.insp-thumb');
      if (!thumb) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectPage(parseInt(thumb.dataset.idx));
      }
    });
  }

  function selectPage(idx) {
    if (!DATA.pages) return;
    idx = Math.max(0, Math.min(idx, DATA.pages.length - 1));
    currentPage = idx;
    const page = DATA.pages[idx];

    if (inspectorImg) {
      inspectorImg.style.opacity = '0';
      setTimeout(() => {
        inspectorImg.src = page.image;
        inspectorImg.alt = `Brand guidelines page ${page.page} — ${page.title}`;
        inspectorImg.style.opacity = '1';
      }, 120);
    }

    if (inspectorCounter) inspectorCounter.textContent = `Page ${page.page} of ${DATA.pages.length}`;
    if (inspectorPageTitle) inspectorPageTitle.textContent = page.title;
    if (inspectorPageDesc) inspectorPageDesc.textContent = page.desc;
    if (inspectorSectionTag) inspectorSectionTag.textContent = page.section;

    // Update thumbnails
    const thumbs = $$('.insp-thumb');
    thumbs.forEach((t, i) => {
      const active = i === idx;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', active);
    });

    if (thumbs[idx]) {
      thumbs[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    if (inspPrev) inspPrev.disabled = idx === 0;
    if (inspNext) inspNext.disabled = idx === DATA.pages.length - 1;
  }

  if (inspPrev) inspPrev.addEventListener('click', () => selectPage(currentPage - 1));
  if (inspNext) inspNext.addEventListener('click', () => selectPage(currentPage + 1));

  // Mobile Touch Swipe for Inspector
  if (inspectorStage) {
    let touchStartX = 0;
    let touchStartY = 0;

    inspectorStage.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    inspectorStage.addEventListener('touchend', e => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const dx = touchEndX - touchStartX;
      const dy = touchEndY - touchStartY;

      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx < 0) {
          selectPage(currentPage + 1); // swipe left
        } else {
          selectPage(currentPage - 1); // swipe right
        }
      }
    }, { passive: true });
  }

  // Keyboard navigation for inspector
  document.addEventListener('keydown', (e) => {
    if (!lightbox || lightbox.hidden) {
      const inspSection = document.getElementById('inspector');
      if (!inspSection) return;
      const rect = inspSection.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); selectPage(currentPage - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); selectPage(currentPage + 1); }
      }
    }
    if (e.key === 'Escape') {
      if (lightbox && !lightbox.hidden) closeLightbox();
      if (!$('#cmd-palette').hidden) closeCmdPalette();
      if (mobileDrawer && mobileDrawer.classList.contains('open')) closeMobileDrawer();
    }
  });

  buildThumbnails();
  selectPage(0);

  /* ============================================================
     COMMAND PALETTE (⌘K / Ctrl+K)
  ============================================================ */
  const cmdPalette = $('#cmd-palette');
  const cmdInput = $('#cmd-input');
  const cmdResults = $('#cmd-results');
  const cmdOpen = $('#cmd-open');
  const cmdBackdrop = $('#cmd-backdrop');

  const cmdSections = [
    { label: '01 Brand Introduction', href: '#intro', icon: '◆' },
    { label: '02 Brand Strategy & Pillars', href: '#strategy', icon: '◇' },
    { label: '03 Logo System & Playground', href: '#logo-system', icon: '★' },
    { label: '04 Colour System & Contrast Matrix', href: '#colour-system', icon: '⬤' },
    { label: '05 Typography & Live Studio', href: '#typography', icon: 'Aa' },
    { label: '06 Graphic Language & Patterns', href: '#graphic-language', icon: '⋯' },
    { label: '07 Photography Direction', href: '#photography', icon: '⬜' },
    { label: '08 Brand Voice & Copy Analyzer', href: '#brand-voice', icon: '✦' },
    { label: '09 Brand Applications & Mockups', href: '#applications', icon: '▣' },
    { label: '10 Digital Brand System', href: '#digital-system', icon: '◉' },
    { label: '11 Motion Direction', href: '#motion-system', icon: '▷' },
    { label: '12 Brand Governance', href: '#governance', icon: '⊞' },
    { label: '42-Page Slide Viewer', href: '#inspector', icon: '📄' },
    { label: 'Brand Asset Downloads (ZIP / SVG)', href: '#assets-hub', icon: '📦' },
    { label: 'Interactive Logo Playground', href: '#logo-system', icon: '🔧' },
    { label: 'Interactive Copy Analyzer', href: '#brand-voice', icon: '✓' },
    { label: 'Live Typography Studio', href: '#typography', icon: 'T' },
  ];

  function openCmdPalette() {
    if (!cmdPalette) return;
    cmdPalette.hidden = false;
    renderCmdResults('');
    setTimeout(() => cmdInput && cmdInput.focus(), 60);
    document.body.style.overflow = 'hidden';
  }

  function closeCmdPalette() {
    if (!cmdPalette) return;
    cmdPalette.hidden = true;
    document.body.style.overflow = '';
  }

  function renderCmdResults(query) {
    if (!cmdResults) return;
    const q = query.toLowerCase();
    const filtered = q ? cmdSections.filter(s => s.label.toLowerCase().includes(q)) : cmdSections;
    cmdResults.innerHTML = filtered.map((s, i) => `
      <li class="cmd-result-item" role="option" tabindex="0" data-href="${s.href}" data-idx="${i}">
        <span class="cmd-result-icon" aria-hidden="true">${s.icon}</span>
        <span>${s.label}</span>
      </li>
    `).join('') || '<li class="cmd-no-results">No brand sections matched your search</li>';

    $$('.cmd-result-item', cmdResults).forEach(item => {
      item.addEventListener('click', () => {
        closeCmdPalette();
        const href = item.dataset.href;
        const target = $(href);
        if (target) {
          const navH = 68;
          const top = target.getBoundingClientRect().top + window.scrollY - navH;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  if (cmdOpen) cmdOpen.addEventListener('click', openCmdPalette);
  if (cmdBackdrop) cmdBackdrop.addEventListener('click', closeCmdPalette);
  if (cmdInput) {
    cmdInput.addEventListener('input', () => renderCmdResults(cmdInput.value));
    cmdInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeCmdPalette();
      if (e.key === 'ArrowDown') {
        const first = $('.cmd-result-item', cmdResults);
        if (first) first.focus();
      }
    });
  }

  if (cmdResults) {
    cmdResults.addEventListener('keydown', (e) => {
      const items = $$('.cmd-result-item', cmdResults);
      const cur = document.activeElement;
      const idx = items.indexOf(cur);
      if (e.key === 'ArrowDown') { e.preventDefault(); items[(idx + 1) % items.length]?.focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); items[(idx - 1 + items.length) % items.length]?.focus(); }
      if (e.key === 'Enter' && idx >= 0) { cur.click(); }
      if (e.key === 'Escape') closeCmdPalette();
    });
  }

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (!cmdPalette || cmdPalette.hidden) openCmdPalette();
      else closeCmdPalette();
    }
  });

  /* ============================================================
     SMOOTH SCROLL FOR ALL INTERNAL LINKS
  ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#' || !href) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navH = 68;
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  console.log('%c NORTHSTAR ADVISORY — Brand Guidelines v2.0 ', 'background:#0B1F3A;color:#2D6BFF;font-weight:800;font-size:14px;padding:8px 16px;border-radius:4px;');
  console.log('%c Identity design by Lyko Artistry. Clarity in complexity. ', 'color:#F5F1E8;font-size:12px;');

})();
