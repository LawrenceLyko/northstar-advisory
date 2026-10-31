/* ============================================================
   NORTHSTAR ADVISORY — Brand Guidelines Site
   app.js v1.0 — All interactivity
   ============================================================ */

(function () {
  'use strict';

  const DATA = window.NORTHSTAR_DATA;

  /* ============================================================
     UTILITY
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
        background:var(--blue);color:#fff;padding:10px 20px;border-radius:4px;
        font-family:var(--font-body);font-size:14px;z-index:9999;
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
    }, 2200);
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
    // update playground stage bg
    updatePlayground();
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => applyTheme(!isDark));
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
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));

  /* ============================================================
     REVEAL ON SCROLL (Intersection Observer)
  ============================================================ */
  const revealItems = $$('.card, .gallery-item, .intro-card, .application-card, .type-specimen');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px' });

  revealItems.forEach(el => {
    el.classList.add('will-reveal');
    revealObs.observe(el);
  });

  // Add CSS for reveal
  const revealStyle = document.createElement('style');
  revealStyle.textContent = `
    .will-reveal { opacity:0; transform:translateY(16px); transition:opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1); }
    .will-reveal.revealed { opacity:1; transform:none; }
  `;
  document.head.appendChild(revealStyle);

  /* ============================================================
     HERO LOGO ANIMATION (stroke draw-on)
  ============================================================ */
  function initHeroAnimation() {
    const segs = $$('#logo-anim .anim-seg');
    segs.forEach(seg => {
      const len = seg.getTotalLength ? seg.getTotalLength() : 100;
      seg.style.strokeDasharray = len;
      seg.style.strokeDashoffset = len;
      seg.style.transition = 'none';
    });

    setTimeout(() => {
      segs.forEach((seg, i) => {
        const delay = 100 + i * 80;
        const dur = 350;
        seg.style.transition = `stroke-dashoffset ${dur}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
        seg.style.strokeDashoffset = '0';
      });
    }, 400);
  }

  // Wait for fonts + layout
  document.fonts.ready.then(initHeroAnimation);

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
     LOGO PLAYGROUND
  ============================================================ */
  const logoImg = $('#playground-logo');
  const playgroundStage = $('#playground-stage');
  const clearspaceBox = $('#clearspace-box');
  const scaleSlider = $('#logo-scale');
  const scaleVal = $('#scale-val');
  const clearspaceToggle = $('#clearspace-toggle');
  const logoDownload = $('#logo-download');

  let currentLogoType = 'logo-primary-horizontal';
  let currentGround = 'navy';
  const groundColors = { navy: '#0B1F3A', ivory: '#F5F1E8', white: '#FFFFFF', blue: '#2D6BFF' };
  const groundVariants = { navy: 'ivory', ivory: 'navy', white: 'navy', blue: 'ivory' };

  function getLogoSrc(type, ground) {
    const variant = groundVariants[ground] || 'ivory';
    if (type === 'logomark' || type === 'wordmark') {
      return `assets/logos/${type}-${variant}.svg`;
    }
    return `assets/logos/${type}-${variant}.svg`;
  }

  function updatePlayground() {
    if (!logoImg) return;
    const src = getLogoSrc(currentLogoType, currentGround);
    logoImg.src = src;
    logoImg.alt = `Northstar Advisory ${currentLogoType.replace(/-/g, ' ')} on ${currentGround}`;
    if (playgroundStage) {
      playgroundStage.style.background = groundColors[currentGround] || '#0B1F3A';
    }
    const size = scaleSlider ? parseInt(scaleSlider.value) : 240;
    logoImg.style.width = size + 'px';
    logoImg.style.maxWidth = 'none';
    logoImg.style.height = 'auto';

    // Clear space
    if (clearspaceBox && clearspaceToggle) {
      if (clearspaceToggle.checked) {
        const markH = Math.max(size * 0.3, 20); // approx 30% of logo width is mark height
        clearspaceBox.style.padding = markH + 'px';
        clearspaceBox.style.border = '1px dashed rgba(45,107,255,0.6)';
        clearspaceBox.style.display = 'inline-block';
      } else {
        clearspaceBox.style.display = 'none';
      }
    }

    // Download button target
    if (logoDownload) {
      logoDownload.dataset.src = src;
    }
  }

  // Logo type tabs
  $$('#logo-type-tabs .radio-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('#logo-type-tabs .radio-tab').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      currentLogoType = btn.dataset.type;
      updatePlayground();
    });
  });

  // Ground tabs
  $$('#logo-ground-tabs .radio-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('#logo-ground-tabs .radio-tab').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
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
      const src = logoImg ? logoImg.src : '';
      if (!src) return;
      const a = document.createElement('a');
      a.href = src;
      a.download = src.split('/').pop();
      a.click();
      showToast('SVG downloaded');
    });
  }

  // Initial render
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
          font-size:clamp(14px, ${h.size.split('–')[0].trim()}, ${h.size.split('–')[1] || h.size.split('–')[0].trim()});
          line-height:${h.lh};
          letter-spacing:${h.tracking || '0'};
        ">The direction of clarity.</div>
        <div class="th-spec">
          <span>${h.font}</span>
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
    const weight = studioWeight ? studioWeight.value : '600';
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

  // Touch swipe for lightbox
  let touchStartX = 0;
  if (lightbox) {
    lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) lbNavigate(dx < 0 ? 1 : -1);
    });
  }

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
    const words = text.split(/\s+/).filter(Boolean);

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
      html += `<div class="result-group"><div class="result-label result-bad">✕ Banned words found (−${foundBanned.length * 18} pts)</div>`;
      html += foundBanned.map(w => `<span class="word-tag banned-tag">${w}</span>`).join('') + '</div>';
    }
    if (foundApproved.length > 0) {
      html += `<div class="result-group"><div class="result-label result-good">✓ On-brand language (+${foundApproved.length * 4} pts)</div>`;
      html += foundApproved.map(w => `<span class="word-tag approved-tag">${w}</span>`).join('') + '</div>';
    }
    if (foundBanned.length === 0 && foundApproved.length === 0) {
      html = '<div class="results-empty">No banned words detected — looking good. Score: ' + score + '</div>';
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
     MOTION SIMULATOR
  ============================================================ */
  function initMotionAnimation(svgId) {
    const segs = $$(`#${svgId} .motion-seg`);
    segs.forEach(seg => {
      const len = seg.getTotalLength ? seg.getTotalLength() : 60;
      seg.style.strokeDasharray = len;
      seg.style.strokeDashoffset = len;
      seg.style.transition = 'none';
      seg.style.opacity = '1';
    });

    requestAnimationFrame(() => {
      segs.forEach((seg, i) => {
        const delay = i * 100;
        const dur = 350;
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

  // Auto-play when section enters view
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
      line.style.transform = 'translateY(10px)';
      line.style.transition = 'none';
    });
    lines.forEach((line, i) => {
      setTimeout(() => {
        line.style.transition = 'opacity 0.4s cubic-bezier(0.22,1,0.36,1), transform 0.4s cubic-bezier(0.22,1,0.36,1)';
        line.style.opacity = '1';
        line.style.transform = 'none';
      }, 300 + i * 120);
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
          setTimeout(initTextReveal, 600);
          textRevealObs.unobserve(motionSection);
        }
      });
    });
    textRevealObs.observe(motionSection);
  }

  /* ============================================================
     42-PAGE INSPECTOR
  ============================================================ */
  const inspectorImg = $('#inspector-img');
  const inspectorCounter = $('#inspector-counter');
  const inspectorPageTitle = $('#inspector-page-title');
  const inspectorPageDesc = $('#inspector-page-desc');
  const inspectorSectionTag = $('#inspector-section-tag');
  const inspectorThumbs = $('#inspector-thumbnails');
  const inspPrev = $('#insp-prev');
  const inspNext = $('#insp-next');

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
      }, 150);
    }

    if (inspectorCounter) inspectorCounter.textContent = `Page ${page.page} of ${DATA.pages.length}`;
    if (inspectorPageTitle) inspectorPageTitle.textContent = page.title;
    if (inspectorPageDesc) inspectorPageDesc.textContent = page.desc;
    if (inspectorSectionTag) inspectorSectionTag.textContent = page.section;

    // Update thumbnails
    $$('.insp-thumb').forEach((t, i) => {
      const active = i === idx;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', active);
      if (active) t.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });

    // Update prev/next disabled state
    if (inspPrev) inspPrev.disabled = idx === 0;
    if (inspNext) inspNext.disabled = idx === DATA.pages.length - 1;
  }

  if (inspPrev) inspPrev.addEventListener('click', () => selectPage(currentPage - 1));
  if (inspNext) inspNext.addEventListener('click', () => selectPage(currentPage + 1));

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
    // ESC closes lightbox
    if (e.key === 'Escape') {
      if (lightbox && !lightbox.hidden) closeLightbox();
      if (!$('#cmd-palette').hidden) closeCmdPalette();
    }
  });

  // Touch swipe for inspector
  let inspTouchStart = 0;
  const inspectorSection = $('#inspector');
  if (inspectorSection) {
    inspectorSection.addEventListener('touchstart', e => { inspTouchStart = e.touches[0].clientX; }, { passive: true });
    inspectorSection.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - inspTouchStart;
      if (Math.abs(dx) > 60) selectPage(currentPage + (dx < 0 ? 1 : -1));
    });
  }

  buildThumbnails();
  selectPage(0);

  // Add CSS transition for inspector image
  if (inspectorImg) {
    inspectorImg.style.transition = 'opacity 0.15s ease';
  }

  /* ============================================================
     COMMAND PALETTE
  ============================================================ */
  const cmdPalette = $('#cmd-palette');
  const cmdInput = $('#cmd-input');
  const cmdResults = $('#cmd-results');
  const cmdOpen = $('#cmd-open');
  const cmdBackdrop = $('#cmd-backdrop');

  const cmdSections = [
    { label: '01 Brand Introduction', href: '#intro', icon: '◆' },
    { label: '02 Brand Strategy', href: '#strategy', icon: '◇' },
    { label: '03 Logo System', href: '#logo-system', icon: '★' },
    { label: '04 Colour System', href: '#colour-system', icon: '⬤' },
    { label: '05 Typography', href: '#typography', icon: 'Aa' },
    { label: '06 Graphic Language', href: '#graphic-language', icon: '⋯' },
    { label: '07 Photography', href: '#photography', icon: '⬜' },
    { label: '08 Brand Voice', href: '#brand-voice', icon: '✦' },
    { label: '09 Brand Applications', href: '#applications', icon: '▣' },
    { label: '10 Digital Brand System', href: '#digital-system', icon: '◉' },
    { label: '11 Motion Direction', href: '#motion-system', icon: '▷' },
    { label: '12 Brand Governance', href: '#governance', icon: '⊞' },
    { label: '42-Page Slide Viewer', href: '#inspector', icon: '⧉' },
    { label: 'Asset Downloads', href: '#assets-hub', icon: '↓' },
    { label: 'Logo Playground', href: '#logo-system', icon: '🔧' },
    { label: 'Copy Analyzer', href: '#brand-voice', icon: '✓' },
    { label: 'Typography Studio', href: '#typography', icon: 'Aa' },
  ];

  function openCmdPalette() {
    if (!cmdPalette) return;
    cmdPalette.hidden = false;
    renderCmdResults('');
    setTimeout(() => cmdInput && cmdInput.focus(), 50);
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
    `).join('') || '<li class="cmd-no-results">No results found</li>';

    $$('.cmd-result-item', cmdResults).forEach(item => {
      item.addEventListener('click', () => {
        closeCmdPalette();
        const href = item.dataset.href;
        const target = $(href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
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

  // Keyboard navigation within results
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

  // ⌘K / Ctrl+K shortcut
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (!cmdPalette || cmdPalette.hidden) openCmdPalette();
      else closeCmdPalette();
    }
  });

  /* ============================================================
     HERO SCROLL HINT — fade on scroll
  ============================================================ */
  const scrollHint = $('.hero-scroll-hint');
  if (scrollHint) {
    window.addEventListener('scroll', () => {
      scrollHint.style.opacity = window.scrollY > 60 ? '0' : '1';
    }, { passive: true });
  }

  /* ============================================================
     SMOOTH SCROLL for anchor links
  ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navH = 68;
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ============================================================
     HERO — staggered reveal
  ============================================================ */
  const heroLines = $$('.hero-content .reveal-line');
  heroLines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateY(12px)';
    setTimeout(() => {
      line.style.transition = 'opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)';
      line.style.opacity = '1';
      line.style.transform = 'none';
    }, 600 + i * 100);
  });

  const heroCta = $('.hero-cta');
  if (heroCta) {
    heroCta.style.opacity = '0';
    heroCta.style.transform = 'translateY(12px)';
    setTimeout(() => {
      heroCta.style.transition = 'opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)';
      heroCta.style.opacity = '1';
      heroCta.style.transform = 'none';
    }, 1000);
  }

  console.log('%c NORTHSTAR ADVISORY — Brand Guidelines v1.0 ', 'background:#0B1F3A;color:#2D6BFF;font-weight:bold;font-size:14px;padding:8px 16px;');
  console.log('%c Identity by Lyko Artistry. Clarity in complexity. ', 'color:#F5F1E8;font-size:12px;');

})();
