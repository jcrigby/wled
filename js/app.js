/**
 * WLED Glow - Main Application
 */

(function() {
  'use strict';

  // DOM Elements
  const elements = {
    // Header
    demoBadge: document.getElementById('demo-badge'),
    connectionIndicator: document.getElementById('connection-indicator'),
    settingsBtn: document.getElementById('settings-btn'),

    // Power
    powerBtn: document.getElementById('power-btn'),
    powerLabel: document.getElementById('power-label'),

    // Brightness
    brightnessSlider: document.getElementById('brightness-slider'),
    brightnessValue: document.getElementById('brightness-value'),

    // Colors
    colorSwatches: document.getElementById('color-swatches'),
    colorWheel: document.getElementById('color-wheel'),
    colorPickerCursor: document.getElementById('color-picker-cursor'),
    currentColorPreview: document.getElementById('current-color-preview'),
    currentColorHex: document.getElementById('current-color-hex'),
    tempSlider: document.getElementById('temp-slider'),
    recentColors: document.getElementById('recent-colors'),

    // Effects
    effectsGrid: document.getElementById('effects-grid'),
    speedSlider: document.getElementById('speed-slider'),
    speedValue: document.getElementById('speed-value'),
    intensitySlider: document.getElementById('intensity-slider'),
    intensityValue: document.getElementById('intensity-value'),
    quickEffects: document.getElementById('quick-effects'),

    // Favorites
    favoritesRow: document.getElementById('favorites-row'),
    savedFavorites: document.getElementById('saved-favorites'),
    saveCurrBtn: document.getElementById('save-current-btn'),

    // Settings
    deviceIp: document.getElementById('device-ip'),
    connectionStatus: document.getElementById('connection-status'),
    testConnectionBtn: document.getElementById('test-connection-btn'),
    demoModeToggle: document.getElementById('demo-mode-toggle'),
    infoName: document.getElementById('info-name'),
    infoVersion: document.getElementById('info-version'),
    infoLeds: document.getElementById('info-leds'),

    // Navigation
    navItems: document.querySelectorAll('.nav-item'),
    screens: document.querySelectorAll('.screen'),
    categoryTabs: document.querySelectorAll('.category-tab'),

    // Modals
    firstLaunchModal: document.getElementById('first-launch-modal'),
    tryDemoBtn: document.getElementById('try-demo-btn'),
    setupDeviceBtn: document.getElementById('setup-device-btn'),
    saveModal: document.getElementById('save-modal'),
    favoriteName: document.getElementById('favorite-name'),
    cancelSaveBtn: document.getElementById('cancel-save-btn'),
    confirmSaveBtn: document.getElementById('confirm-save-btn')
  };

  // State
  let currentScreen = 'home';
  let currentCategory = 'all';
  let colorWheelCtx = null;
  let isDraggingColorWheel = false;

  // Initialize application
  function init() {
    // Check for first launch
    const hasLaunched = localStorage.getItem('wled_has_launched');
    const deviceIp = localStorage.getItem('wled_device_ip');
    const demoMode = localStorage.getItem('wled_demo_mode') === 'true';

    if (!hasLaunched && !deviceIp && !demoMode) {
      showFirstLaunchModal();
    }

    localStorage.setItem('wled_has_launched', 'true');

    // Load saved settings
    elements.deviceIp.value = wledApi.deviceIp || '';
    elements.demoModeToggle.checked = wledApi.isDemoMode();

    // Subscribe to state changes
    wledApi.subscribe(updateUI);

    // Initialize components
    initNavigation();
    initPowerButton();
    initBrightnessSlider();
    initColorSwatches();
    initColorWheel();
    initTempSlider();
    initEffects();
    initSettings();
    initFavorites();
    initModals();

    // Initial state fetch
    if (wledApi.isDemoMode() || wledApi.deviceIp) {
      fetchInitialState();
    }

    // Update connection status
    updateConnectionStatus();
  }

  // Navigation
  function initNavigation() {
    elements.navItems.forEach(item => {
      item.addEventListener('click', () => {
        const screen = item.dataset.screen;
        navigateTo(screen);
      });
    });

    elements.settingsBtn.addEventListener('click', () => {
      navigateTo('settings');
    });
  }

  function navigateTo(screen) {
    currentScreen = screen;

    // Update nav items
    elements.navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.screen === screen);
    });

    // Update screens
    elements.screens.forEach(s => {
      s.classList.toggle('active', s.id === `screen-${screen}`);
    });

    // Refresh data when entering screens
    if (screen === 'effects') {
      renderEffects();
    } else if (screen === 'saved') {
      renderFavorites();
    } else if (screen === 'colors') {
      renderRecentColors();
    }
  }

  // Power button
  function initPowerButton() {
    elements.powerBtn.addEventListener('click', async () => {
      try {
        await wledApi.togglePower();
      } catch (error) {
        console.error('Failed to toggle power:', error);
        showError('Failed to toggle power');
      }
    });
  }

  // Brightness slider
  function initBrightnessSlider() {
    let debounceTimer = null;

    elements.brightnessSlider.addEventListener('input', (e) => {
      const bri = parseInt(e.target.value);
      elements.brightnessValue.textContent = `${Math.round(bri / 255 * 100)}%`;

      // Debounce API calls
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        try {
          await wledApi.setBrightness(bri);
        } catch (error) {
          console.error('Failed to set brightness:', error);
        }
      }, 50);
    });
  }

  // Color swatches
  function initColorSwatches() {
    elements.colorSwatches.addEventListener('click', async (e) => {
      const swatch = e.target.closest('.color-swatch');
      if (!swatch) return;

      const color = swatch.dataset.color.split(',').map(Number);
      try {
        await wledApi.setColor(color[0], color[1], color[2]);
        recentColorsManager.add(color[0], color[1], color[2]);

        // Update active state
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
      } catch (error) {
        console.error('Failed to set color:', error);
        showError('Failed to set color');
      }
    });
  }

  // Color wheel
  function initColorWheel() {
    const canvas = elements.colorWheel;
    colorWheelCtx = canvas.getContext('2d');

    // Draw the color wheel
    drawColorWheel();

    // Event handlers
    canvas.addEventListener('mousedown', startColorPick);
    canvas.addEventListener('touchstart', startColorPick, { passive: false });

    document.addEventListener('mousemove', moveColorPick);
    document.addEventListener('touchmove', moveColorPick, { passive: false });

    document.addEventListener('mouseup', endColorPick);
    document.addEventListener('touchend', endColorPick);
  }

  function drawColorWheel() {
    const canvas = elements.colorWheel;
    const ctx = colorWheelCtx;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw color wheel
    for (let angle = 0; angle < 360; angle++) {
      const startAngle = (angle - 1) * Math.PI / 180;
      const endAngle = (angle + 1) * Math.PI / 180;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, 'white');
      gradient.addColorStop(1, `hsl(${angle}, 100%, 50%)`);

      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  function startColorPick(e) {
    isDraggingColorWheel = true;
    pickColor(e);
  }

  function moveColorPick(e) {
    if (!isDraggingColorWheel) return;
    pickColor(e);
  }

  function endColorPick() {
    isDraggingColorWheel = false;
  }

  function pickColor(e) {
    e.preventDefault();

    const canvas = elements.colorWheel;
    const rect = canvas.getBoundingClientRect();

    let clientX, clientY;
    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Scale to canvas coordinates
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const canvasX = x * scaleX;
    const canvasY = y * scaleY;

    // Get pixel color
    const pixel = colorWheelCtx.getImageData(canvasX, canvasY, 1, 1).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];

    // Update cursor position
    elements.colorPickerCursor.style.left = `${x}px`;
    elements.colorPickerCursor.style.top = `${y}px`;
    elements.colorPickerCursor.style.backgroundColor = `rgb(${r},${g},${b})`;

    // Update preview
    elements.currentColorPreview.style.backgroundColor = `rgb(${r},${g},${b})`;
    elements.currentColorHex.textContent = rgbToHex(r, g, b);

    // Send to device (debounced)
    if (isDraggingColorWheel) {
      debouncedSetColor(r, g, b);
    }
  }

  const debouncedSetColor = debounce(async (r, g, b) => {
    try {
      await wledApi.setColor(r, g, b);
      recentColorsManager.add(r, g, b);
    } catch (error) {
      console.error('Failed to set color:', error);
    }
  }, 50);

  // Temperature slider
  function initTempSlider() {
    let debounceTimer = null;

    elements.tempSlider.addEventListener('input', (e) => {
      const value = parseInt(e.target.value);

      // Map 0-100 to warm (2700K) to cool (6500K)
      const color = kelvinToRgb(2700 + (value / 100) * (6500 - 2700));

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        try {
          await wledApi.setColor(color.r, color.g, color.b);
        } catch (error) {
          console.error('Failed to set temperature:', error);
        }
      }, 50);
    });
  }

  // Effects
  function initEffects() {
    // Category tabs
    elements.categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        currentCategory = tab.dataset.category;
        elements.categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderEffects();
      });
    });

    // Quick effects
    elements.quickEffects.addEventListener('click', async (e) => {
      const chip = e.target.closest('.effect-chip');
      if (!chip) return;

      const fx = parseInt(chip.dataset.effect);
      try {
        await wledApi.setEffect(fx);
        updateQuickEffectsUI(fx);
      } catch (error) {
        console.error('Failed to set effect:', error);
        showError('Failed to set effect');
      }
    });

    // Speed slider
    elements.speedSlider.addEventListener('input', (e) => {
      const sx = parseInt(e.target.value);
      elements.speedValue.textContent = `${Math.round(sx / 255 * 100)}%`;
    });

    elements.speedSlider.addEventListener('change', async (e) => {
      try {
        await wledApi.setEffectSpeed(parseInt(e.target.value));
      } catch (error) {
        console.error('Failed to set speed:', error);
      }
    });

    // Intensity slider
    elements.intensitySlider.addEventListener('input', (e) => {
      const ix = parseInt(e.target.value);
      elements.intensityValue.textContent = `${Math.round(ix / 255 * 100)}%`;
    });

    elements.intensitySlider.addEventListener('change', async (e) => {
      try {
        await wledApi.setEffectIntensity(parseInt(e.target.value));
      } catch (error) {
        console.error('Failed to set intensity:', error);
      }
    });
  }

  function renderEffects() {
    const effects = wledApi.getEffectsByCategory(currentCategory);
    const currentFx = wledApi.getState().seg?.[0]?.fx || 0;

    elements.effectsGrid.innerHTML = effects.map(effect => `
      <button class="effect-card ${effect.id === currentFx ? 'active' : ''}" data-effect="${effect.id}">
        <div class="effect-card-icon">${effect.icon}</div>
        <div class="effect-card-name">${effect.name}</div>
      </button>
    `).join('');

    // Add click handlers
    elements.effectsGrid.querySelectorAll('.effect-card').forEach(card => {
      card.addEventListener('click', async () => {
        const fx = parseInt(card.dataset.effect);
        try {
          await wledApi.setEffect(fx);
          renderEffects();
          updateQuickEffectsUI(fx);
        } catch (error) {
          console.error('Failed to set effect:', error);
          showError('Failed to set effect');
        }
      });
    });
  }

  function updateQuickEffectsUI(currentFx) {
    document.querySelectorAll('.effect-chip').forEach(chip => {
      chip.classList.toggle('active', parseInt(chip.dataset.effect) === currentFx);
    });
  }

  // Settings
  function initSettings() {
    // Device IP
    elements.deviceIp.addEventListener('change', () => {
      wledApi.setDeviceIp(elements.deviceIp.value.trim());
    });

    // Test connection
    elements.testConnectionBtn.addEventListener('click', testConnection);

    // Demo mode toggle
    elements.demoModeToggle.addEventListener('change', (e) => {
      wledApi.setDemoMode(e.target.checked);
      updateConnectionStatus();

      if (e.target.checked) {
        fetchInitialState();
      }
    });
  }

  async function testConnection() {
    const statusEl = elements.connectionStatus;
    const indicator = statusEl.querySelector('.status-indicator');
    const text = statusEl.querySelector('.status-text');

    indicator.className = 'status-indicator connecting';
    text.textContent = 'Testing connection...';

    const result = await wledApi.testConnection();

    if (result.success) {
      indicator.className = 'status-indicator connected';
      text.textContent = `Connected to ${result.info.name || 'WLED'}`;

      // Update device info
      elements.infoName.textContent = result.info.name || '-';
      elements.infoVersion.textContent = result.info.ver || '-';
      elements.infoLeds.textContent = result.info.leds?.count || '-';

      // Fetch full state
      fetchInitialState();
    } else {
      indicator.className = 'status-indicator disconnected';
      text.textContent = `Failed: ${result.error}`;
    }

    updateConnectionStatus();
  }

  function updateConnectionStatus() {
    const isConnected = wledApi.isConnected();
    const isDemoMode = wledApi.isDemoMode();

    // Update header
    elements.connectionIndicator.classList.toggle('connected', isConnected);
    elements.demoBadge.classList.toggle('hidden', !isDemoMode);

    // Update settings
    if (isDemoMode) {
      const statusEl = elements.connectionStatus;
      const indicator = statusEl.querySelector('.status-indicator');
      const text = statusEl.querySelector('.status-text');
      indicator.className = 'status-indicator connected';
      text.textContent = 'Demo Mode Active';

      elements.infoName.textContent = 'Demo Lights';
      elements.infoVersion.textContent = '0.14.0';
      elements.infoLeds.textContent = '60';
    }
  }

  // Favorites
  function initFavorites() {
    elements.saveCurrBtn.addEventListener('click', () => {
      elements.favoriteName.value = '';
      elements.saveModal.classList.remove('hidden');
      elements.favoriteName.focus();
    });
  }

  function renderFavorites() {
    const favorites = favoritesManager.getAll();

    // Home screen favorites row
    if (favorites.length === 0) {
      elements.favoritesRow.innerHTML = '<p class="empty-state">No favorites yet. Save your favorite looks!</p>';
    } else {
      elements.favoritesRow.innerHTML = favorites.map(fav => {
        const color = fav.state.seg?.[0]?.col?.[0] || [255, 255, 255];
        return `
          <button class="favorite-card" data-id="${fav.id}">
            <div class="favorite-card-color" style="background: rgb(${color.join(',')})"></div>
            <span class="favorite-card-name">${fav.name}</span>
          </button>
        `;
      }).join('');
    }

    // Saved screen favorites list
    if (favorites.length === 0) {
      elements.savedFavorites.innerHTML = '<p class="empty-state">No favorites saved yet</p>';
    } else {
      elements.savedFavorites.innerHTML = favorites.map(fav => {
        const color = fav.state.seg?.[0]?.col?.[0] || [255, 255, 255];
        const effectName = getEffectName(fav.state.seg?.[0]?.fx || 0);
        return `
          <div class="saved-item" data-id="${fav.id}">
            <div class="saved-item-color" style="background: rgb(${color.join(',')})"></div>
            <div class="saved-item-info">
              <div class="saved-item-name">${fav.name}</div>
              <div class="saved-item-desc">${effectName} - ${Math.round(fav.state.bri / 255 * 100)}%</div>
            </div>
            <button class="saved-item-delete" data-id="${fav.id}" aria-label="Delete favorite">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        `;
      }).join('');
    }

    // Add click handlers
    document.querySelectorAll('.favorite-card, .saved-item').forEach(el => {
      el.addEventListener('click', async (e) => {
        if (e.target.closest('.saved-item-delete')) return;

        const id = el.dataset.id;
        const favorite = favoritesManager.get(id);
        if (favorite) {
          try {
            await wledApi.setState(favorite.state);
          } catch (error) {
            console.error('Failed to apply favorite:', error);
            showError('Failed to apply favorite');
          }
        }
      });
    });

    // Delete handlers
    document.querySelectorAll('.saved-item-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        favoritesManager.remove(id);
        renderFavorites();
      });
    });
  }

  function renderRecentColors() {
    const colors = recentColorsManager.getAll();

    if (colors.length === 0) {
      elements.recentColors.innerHTML = '<p class="empty-state">Your recent colors will appear here</p>';
    } else {
      elements.recentColors.innerHTML = colors.map(color => `
        <button class="color-swatch" data-color="${color.join(',')}" style="background: rgb(${color.join(',')})"></button>
      `).join('');
    }

    // Add click handlers
    elements.recentColors.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', async () => {
        const color = swatch.dataset.color.split(',').map(Number);
        try {
          await wledApi.setColor(color[0], color[1], color[2]);
        } catch (error) {
          console.error('Failed to set color:', error);
        }
      });
    });
  }

  // Modals
  function initModals() {
    // First launch modal
    elements.tryDemoBtn.addEventListener('click', () => {
      wledApi.setDemoMode(true);
      elements.demoModeToggle.checked = true;
      elements.firstLaunchModal.classList.add('hidden');
      fetchInitialState();
      updateConnectionStatus();
    });

    elements.setupDeviceBtn.addEventListener('click', () => {
      elements.firstLaunchModal.classList.add('hidden');
      navigateTo('settings');
    });

    // Save modal
    elements.cancelSaveBtn.addEventListener('click', () => {
      elements.saveModal.classList.add('hidden');
    });

    elements.confirmSaveBtn.addEventListener('click', () => {
      const name = elements.favoriteName.value.trim() || 'My Favorite';
      const state = wledApi.getState();
      favoritesManager.add(name, state);
      elements.saveModal.classList.add('hidden');
      renderFavorites();
    });

    // Close modal on outside click
    [elements.firstLaunchModal, elements.saveModal].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
        }
      });
    });
  }

  function showFirstLaunchModal() {
    elements.firstLaunchModal.classList.remove('hidden');
  }

  // Update UI based on state
  function updateUI(state) {
    // Power button
    elements.powerBtn.classList.toggle('on', state.on);
    elements.powerLabel.textContent = state.on ? 'ON' : 'OFF';

    // Brightness
    elements.brightnessSlider.value = state.bri;
    elements.brightnessValue.textContent = `${Math.round(state.bri / 255 * 100)}%`;

    // Current color
    if (state.seg?.[0]?.col?.[0]) {
      const color = state.seg[0].col[0];
      elements.currentColorPreview.style.backgroundColor = `rgb(${color.join(',')})`;
      elements.currentColorHex.textContent = rgbToHex(color[0], color[1], color[2]);
    }

    // Effect controls
    if (state.seg?.[0]) {
      const seg = state.seg[0];
      if (seg.sx !== undefined) {
        elements.speedSlider.value = seg.sx;
        elements.speedValue.textContent = `${Math.round(seg.sx / 255 * 100)}%`;
      }
      if (seg.ix !== undefined) {
        elements.intensitySlider.value = seg.ix;
        elements.intensityValue.textContent = `${Math.round(seg.ix / 255 * 100)}%`;
      }

      // Update quick effects
      updateQuickEffectsUI(seg.fx || 0);
    }

    // Connection status
    updateConnectionStatus();
  }

  // Fetch initial state
  async function fetchInitialState() {
    try {
      await wledApi.fetchState();
      renderFavorites();
    } catch (error) {
      console.error('Failed to fetch state:', error);
    }
  }

  // Helper functions
  function debounce(fn, delay) {
    let timer = null;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
  }

  function kelvinToRgb(kelvin) {
    const temp = kelvin / 100;
    let r, g, b;

    if (temp <= 66) {
      r = 255;
      g = Math.max(0, Math.min(255, 99.4708025861 * Math.log(temp) - 161.1195681661));
    } else {
      r = Math.max(0, Math.min(255, 329.698727446 * Math.pow(temp - 60, -0.1332047592)));
      g = Math.max(0, Math.min(255, 288.1221695283 * Math.pow(temp - 60, -0.0755148492)));
    }

    if (temp >= 66) {
      b = 255;
    } else if (temp <= 19) {
      b = 0;
    } else {
      b = Math.max(0, Math.min(255, 138.5177312231 * Math.log(temp - 10) - 305.0447927307));
    }

    return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
  }

  function getEffectName(fx) {
    const effects = wledApi.getEffects();
    const effect = effects.find(e => e.id === fx);
    return effect ? effect.name : 'Unknown';
  }

  function showError(message) {
    // Simple alert for now - could be replaced with toast notification
    console.error(message);
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
