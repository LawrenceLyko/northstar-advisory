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
     04 COLOUR SYSTEM — MASTER SWATCHES & PAIRINGS SIMULATOR
  ============================================================ */
  const swatchGrid = $('#color-swatch-grid');
  if (swatchGrid && DATA.colors) {
    swatchGrid.innerHTML = DATA.colors.core.map(c => `
      <div class="liquid-swatch-card liquid-glass-card" data-name="${c.name}" data-hex="${c.hex}" id="swatch-${c.name.toLowerCase().replace(/\s+/g, '-')}">
        <div class="swatch-color-pod" style="background:${c.hex};">
          <span class="swatch-pod-ratio">${c.name.includes('Navy') ? '60%' : c.name.includes('Ivory') ? '30%' : '10%'}</span>
        </div>
        <div class="swatch-details-pane">
          <div class="swatch-title-row">
            <span class="swatch-name-lg">${c.name}</span>
            <span class="pill-mini" style="margin-bottom:0;">${c.name.includes('Navy') ? 'Dominant' : c.name.includes('Ivory') ? 'Surface' : 'Accent'}</span>
          </div>
          <div class="swatch-role-tag">${c.role}</div>
          <div class="swatch-codes-grid">
            <div class="code-chip" data-copy="${c.hex}" title="Click to copy Hex code">
              <span class="chip-label">HEX</span>
              <span class="chip-val">${c.hex}</span>
            </div>
            <div class="code-chip" data-copy="rgb(${c.rgb})" title="Click to copy RGB code">
              <span class="chip-label">RGB</span>
              <span class="chip-val">${c.rgb}</span>
            </div>
            <div class="code-chip" data-copy="${c.cmyk}" title="Click to copy CMYK values">
              <span class="chip-label">CMYK</span>
              <span class="chip-val">${c.cmyk}</span>
            </div>
            <div class="code-chip" data-copy="Pantone ${c.pantone}" title="Click to copy Pantone code">
              <span class="chip-label">PMS</span>
              <span class="chip-val">${c.pantone}</span>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Code chip copy event delegation
    swatchGrid.addEventListener('click', (e) => {
      const chip = e.target.closest('.code-chip');
      if (chip && chip.dataset.copy) {
        e.stopPropagation();
        copyText(chip.dataset.copy);
        showToast('Copied ' + chip.dataset.copy);
        return;
      }
      const card = e.target.closest('.liquid-swatch-card');
      if (card && card.dataset.hex) {
        copyText(card.dataset.hex);
        showToast('Copied ' + card.dataset.hex);
      }
    });
  }

  // Interactive 60/30/10 Ratio Bar & Legend
  const ratioSegs = $$('.ratio-seg');
  const ratioLegendItems = $$('.ratio-legend-item');

  function highlightSwatchCard(name) {
    const cardId = name.toLowerCase().includes('navy') ? 'swatch-deep-navy'
      : name.toLowerCase().includes('ivory') ? 'swatch-warm-ivory'
      : 'swatch-electric-blue';
    $$('.liquid-swatch-card').forEach(c => {
      c.style.transform = '';
      c.style.borderColor = '';
      c.style.boxShadow = '';
    });
    const target = $(`#${cardId}`);
    if (target) {
      target.style.borderColor = 'var(--blue)';
      target.style.boxShadow = '0 0 40px rgba(45, 107, 255, 0.45)';
      target.style.transform = 'translateY(-4px)';
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  ratioSegs.forEach(seg => {
    seg.addEventListener('click', () => {
      const name = seg.dataset.swatch;
      if (name) highlightSwatchCard(name);
    });
  });

  ratioLegendItems.forEach(item => {
    item.addEventListener('click', () => {
      ratioLegendItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const name = item.dataset.swatch;
      if (name) highlightSwatchCard(name);
    });
  });

  // Approved Brand Pairings Simulator (Page 28 PDF)
  const brandPairings = [
    {
      id: 'ivory-on-navy',
      name: 'Warm Ivory on Deep Navy',
      fg: '#F5F1E8',
      bg: '#0B1F3A',
      accent: '#2D6BFF',
      badge: 'STRATEGIC ADVISORY',
      headline: 'Clarity in complexity.',
      body: 'We build the systems and frameworks that convert strategic ambition into quarterly execution.',
      meta: 'ARR Multiple: 2.8x',
      btnText: 'Explore Framework →',
      btnBg: '#2D6BFF',
      btnFg: '#F5F1E8',
      badgeBg: 'rgba(45,107,255,0.18)',
      badgeFg: '#2D6BFF',
      ratio: '13.2 : 1',
      wcag: 'AAA Pass',
      wcagClass: 'badge-aaa',
      context: 'Primary Dark Viewport',
      rule: 'Official primary dark mode presentation. Exceeds WCAG AAA requirements for maximum readability across all screen calibrations.'
    },
    {
      id: 'navy-on-ivory',
      name: 'Deep Navy on Warm Ivory',
      fg: '#0B1F3A',
      bg: '#F5F1E8',
      accent: '#2D6BFF',
      badge: 'EDITORIAL READING PLANE',
      headline: 'Evidence over opinion.',
      body: 'Decisions backed by rigorous market data eliminate corporate clutter and empower senior leadership.',
      meta: 'Confidence Score: 98%',
      btnText: 'View Case Study →',
      btnBg: '#0B1F3A',
      btnFg: '#F5F1E8',
      badgeBg: 'rgba(11,31,58,0.1)',
      badgeFg: '#0B1F3A',
      ratio: '13.2 : 1',
      wcag: 'AAA Pass',
      wcagClass: 'badge-aaa',
      context: 'Editorial & Print Deliverables',
      rule: 'Primary reading ground for advisory deliverables, whitepapers, financial models, and print collateral. Clean, authoritative, and restful on the eyes.'
    },
    {
      id: 'blue-on-navy',
      name: 'Electric Blue on Deep Navy',
      fg: '#2D6BFF',
      bg: '#0B1F3A',
      accent: '#F5F1E8',
      badge: 'NAVIGATIONAL ACCENT',
      headline: 'Direction of clarity.',
      body: 'Electric Blue provides high-intent directional focus across navigation, active states, and section numbers.',
      meta: 'Navigation Index: 04',
      btnText: 'Launch Portal →',
      btnBg: 'rgba(45,107,255,0.2)',
      btnFg: '#FFFFFF',
      badgeBg: 'rgba(45,107,255,0.25)',
      badgeFg: '#FFFFFF',
      ratio: '4.8 : 1',
      wcag: 'AA Pass',
      wcagClass: 'badge-aa',
      context: 'Indicators & Large Display (24px+)',
      rule: 'Meets WCAG AA for large text (18pt+) and graphic interface indicators. Strictly permitted for major section numbers, active underlines, and display headings.'
    },
    {
      id: 'ivory-on-blue',
      name: 'Warm Ivory on Electric Blue',
      fg: '#F5F1E8',
      bg: '#2D6BFF',
      accent: '#FFFFFF',
      badge: 'PRIMARY CTA BUTTONS',
      headline: 'Immediate Execution.',
      body: 'Solid Electric Blue backgrounds reserved strictly for primary interactive actions, pill tags, and key milestones.',
      meta: 'Action State: Active',
      btnText: 'Confirm & Scale →',
      btnBg: '#0B1F3A',
      btnFg: '#F5F1E8',
      badgeBg: 'rgba(255,255,255,0.22)',
      badgeFg: '#FFFFFF',
      ratio: '4.2 : 1',
      wcag: 'AA Large Pass',
      wcagClass: 'badge-aa',
      context: 'Button Fills & Pill Badges',
      rule: 'Standard treatment for all high-intent conversion buttons, pill badges, and interactive callouts. Always use bold or semi-bold weight (minimum 14px).'
    },
    {
      id: 'blue-on-ivory',
      name: 'Electric Blue on Warm Ivory',
      fg: '#2D6BFF',
      bg: '#F5F1E8',
      accent: '#0B1F3A',
      badge: '⚠️ RESTRICTED DISPLAY',
      headline: 'Large Headlines (24px+)',
      body: 'Guideline Page 28 strictly forbids Electric Blue for body copy on Ivory. Only permitted for oversized numbers, display charts, or key decorative icons.',
      meta: 'Restricted Context',
      btnText: 'Compliance Notice',
      btnBg: 'rgba(45,107,255,0.12)',
      btnFg: '#2D6BFF',
      badgeBg: 'rgba(45,107,255,0.18)',
      badgeFg: '#2D6BFF',
      ratio: '2.7 : 1',
      wcag: 'Restricted (24px+)',
      wcagClass: 'badge-a',
      context: 'Display Only (24px+) / Never Body Text',
      rule: '⚠️ RESTRICTED USAGE: Guideline Page 28 strictly forbids Electric Blue for body copy on Ivory due to 2.7:1 contrast ratio. Permitted ONLY for large 24px+ headline numbers or icons.'
    }
  ];

  const simulatorPairTabs = $('#simulator-pair-tabs');
  const simPreviewInner = $('#simulator-preview-inner');
  const simBadge = $('#sim-badge');
  const simHeadline = $('#sim-headline');
  const simBody = $('#sim-body');
  const simMeta = $('#sim-meta');
  const simButton = $('#sim-button');
  const simRatio = $('#sim-ratio');
  const simWcag = $('#sim-wcag');
  const simContext = $('#sim-context');
  const simRuleText = $('#sim-rule-text');

  function selectPairing(pairId) {
    const pair = brandPairings.find(p => p.id === pairId) || brandPairings[0];
    $$('.sim-pair-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.pairId === pair.id);
    });

    if (simPreviewInner) {
      simPreviewInner.style.background = pair.bg;
      simPreviewInner.style.color = pair.fg;
    }
    if (simBadge) {
      simBadge.textContent = pair.badge;
      simBadge.style.background = pair.badgeBg;
      simBadge.style.color = pair.badgeFg;
    }
    if (simHeadline) {
      simHeadline.textContent = pair.headline;
      simHeadline.style.color = pair.fg;
    }
    if (simBody) {
      simBody.textContent = pair.body;
      simBody.style.color = pair.fg;
      simBody.style.opacity = '0.9';
    }
    if (simMeta) {
      simMeta.textContent = pair.meta;
      simMeta.style.color = pair.fg;
    }
    if (simButton) {
      simButton.textContent = pair.btnText;
      simButton.style.background = pair.btnBg;
      simButton.style.color = pair.btnFg;
    }
    if (simRatio) simRatio.textContent = pair.ratio;
    if (simWcag) {
      simWcag.textContent = pair.wcag;
      simWcag.className = 'telemetry-val ' + pair.wcagClass;
    }
    if (simContext) simContext.textContent = pair.context;
    if (simRuleText) simRuleText.textContent = pair.rule;
  }

  if (simulatorPairTabs) {
    simulatorPairTabs.innerHTML = brandPairings.map((p, idx) => `
      <button class="sim-pair-pill ${idx === 0 ? 'active' : ''}" data-pair-id="${p.id}" role="tab" aria-label="Select pairing ${p.name}">
        <span class="sim-dot-pair">
          <span class="sim-dot-fg" style="background:${p.fg};"></span>
          <span class="sim-dot-bg" style="background:${p.bg};"></span>
        </span>
        <span>${p.name.split(' on ')[0]} on ${p.name.split(' on ')[1]}</span>
      </button>
    `).join('');

    simulatorPairTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.sim-pair-pill');
      if (btn && btn.dataset.pairId) {
        selectPairing(btn.dataset.pairId);
      }
    });

    selectPairing('ivory-on-navy');
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

  /* ============================================================
     05 TYPOGRAPHY HIERARCHY & STUDIO
  ============================================================ */
  const typeHierarchy = $('#type-hierarchy');
  if (typeHierarchy && DATA.typography) {
    typeHierarchy.innerHTML = DATA.typography.hierarchy.map(h => `
      <div class="type-hierarchy-row">
        <div class="th-level">${h.level}</div>
        <div class="th-sample" style="
          font-family:${h.font.includes('Manrope') ? "'Manrope', sans-serif" : "'DM Sans', sans-serif"};
          font-weight:${h.font.includes('Bold') ? 700 : h.font.includes('Semi') ? 600 : h.font.includes('Medium') ? 500 : h.font.includes('Light') ? 300 : 400};
          font-size:clamp(16px, 2.4vw, ${h.size.split('–')[1] || h.size.split('–')[0].trim()});
          line-height:${h.lh};
          letter-spacing:${h.tracking ? (parseInt(h.tracking)/100) + 'em' : '0'};
        ">The direction of clarity.</div>
        <div class="th-spec">
          <span><strong>${h.font}</strong></span>
          <span>${h.size} • LH ${h.lh}</span>
          ${h.tracking ? `<span>Tracking +${h.tracking}</span>` : '<span>Tracking 0</span>'}
        </div>
      </div>
    `).join('');
  }

  /* ============================================================
     TYPOGRAPHY STUDIO WITH PRESETS & LIVE CSS GENERATOR
  ============================================================ */
  const studioFont = $('#studio-font');
  const studioWeight = $('#studio-weight');
  const studioSize = $('#studio-size');
  const studioTracking = $('#studio-tracking');
  const studioLh = $('#studio-lh');
  const studioSizeVal = $('#studio-size-val');
  const studioTrackingVal = $('#studio-tracking-val');
  const studioLhVal = $('#studio-lh-val');
  const studioPreviewInner = $('#studio-preview-inner');
  const studioPreview = $('#studio-preview');
  const typeCssOutput = $('#type-css-output');
  const btnCopyTypeCss = $('#btn-copy-type-css');

  const studioBgColors = { navy: '#0B1F3A', ivory: '#F5F1E8', blue: '#2D6BFF' };
  const studioBgText = { navy: '#F5F1E8', ivory: '#0B1F3A', blue: '#FFFFFF' };
  let studioBg = 'navy';

  const typePresets = {
    h1: { font: "'Manrope', sans-serif", weight: '700', size: '48', tracking: '-2', lh: '110', text: 'Clarity in complexity.' },
    h2: { font: "'Manrope', sans-serif", weight: '600', size: '32', tracking: '-1', lh: '115', text: 'We turn complexity into a plan you can act on this quarter.' },
    metric: { font: "'Manrope', sans-serif", weight: '800', size: '64', tracking: '-3', lh: '100', text: '$48.5M ARR (+34%)' },
    body: { font: "'DM Sans', sans-serif", weight: '400', size: '18', tracking: '0', lh: '155', text: 'Strategic growth requires eliminating vanity initiatives and committing resources to defensible operational moats.' },
    caption: { font: "'DM Sans', sans-serif", weight: '500', size: '13', tracking: '4', lh: '140', text: 'EXECUTIVE MEMORANDUM • CONFIDENTIAL • Q3 REVIEW' }
  };

  function updateStudio() {
    if (!studioPreviewInner) return;
    const font = studioFont ? studioFont.value : "'Manrope', sans-serif";
    const weight = studioWeight ? studioWeight.value : '700';
    const size = studioSize ? studioSize.value : '48';
    const tracking = studioTracking ? (parseInt(studioTracking.value) / 100).toFixed(2) : '-0.02';
    const lh = studioLh ? (parseInt(studioLh.value) / 100).toFixed(2) : '1.1';

    studioPreviewInner.style.fontFamily = font;
    studioPreviewInner.style.fontWeight = weight;
    studioPreviewInner.style.fontSize = size + 'px';
    studioPreviewInner.style.letterSpacing = tracking + 'em';
    studioPreviewInner.style.lineHeight = lh;

    if (studioPreview) {
      studioPreview.style.background = studioBgColors[studioBg] || '#0B1F3A';
      studioPreviewInner.style.color = studioBgText[studioBg] || '#F5F1E8';
    }

    if (studioSizeVal) studioSizeVal.textContent = size;
    if (studioTrackingVal) studioTrackingVal.textContent = tracking;
    if (studioLhVal) studioLhVal.textContent = studioLh ? studioLh.value : '110';

    if (typeCssOutput) {
      typeCssOutput.innerHTML = `<code>font-family: ${font};
font-weight: ${weight};
font-size: ${size}px;
line-height: ${lh};
letter-spacing: ${tracking}em;</code>`;
    }
  }

  [studioFont, studioWeight, studioSize, studioTracking, studioLh].forEach(el => {
    if (el) el.addEventListener('input', updateStudio);
  });

  // Presets handling
  $$('.preset-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.preset-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const preset = typePresets[btn.dataset.preset];
      if (!preset) return;

      if (studioFont) studioFont.value = preset.font;
      if (studioWeight) studioWeight.value = preset.weight;
      if (studioSize) studioSize.value = preset.size;
      if (studioTracking) studioTracking.value = preset.tracking;
      if (studioLh) studioLh.value = preset.lh;
      if (studioPreviewInner) studioPreviewInner.textContent = preset.text;

      updateStudio();
    });
  });

  // Ground tabs
  $$('#studio-bg-tabs .radio-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('#studio-bg-tabs .radio-tab').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      studioBg = btn.dataset.bg;
      updateStudio();
    });
  });

  // Copy CSS button
  if (btnCopyTypeCss && typeCssOutput) {
    btnCopyTypeCss.addEventListener('click', () => {
      copyText(typeCssOutput.innerText);
      showToast('Copied CSS snippet');
    });
  }

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
