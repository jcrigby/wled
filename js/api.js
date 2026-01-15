/**
 * WLED Glow - API Service
 * Handles communication with WLED devices and demo mode
 */

// Effect categories and friendly names mapping
const EFFECT_DATA = {
  effects: [
    { id: 0, name: 'Solid Color', category: 'simple', icon: '🎨' },
    { id: 1, name: 'Blinking', category: 'simple', icon: '💡' },
    { id: 2, name: 'Breathing Pulse', category: 'relaxing', icon: '🌊' },
    { id: 3, name: 'Color Wipe', category: 'simple', icon: '🖌️' },
    { id: 4, name: 'Color Wipe Random', category: 'energetic', icon: '🎲' },
    { id: 5, name: 'Random Colors', category: 'party', icon: '🎪' },
    { id: 6, name: 'Color Sweep', category: 'simple', icon: '➡️' },
    { id: 7, name: 'Dynamic', category: 'energetic', icon: '⚡' },
    { id: 8, name: 'Rainbow', category: 'energetic', icon: '🌈' },
    { id: 9, name: 'Rainbow Cycle', category: 'energetic', icon: '🌈' },
    { id: 10, name: 'Scan', category: 'simple', icon: '📊' },
    { id: 11, name: 'Dual Scan', category: 'simple', icon: '📊' },
    { id: 12, name: 'Fade', category: 'relaxing', icon: '🌙' },
    { id: 13, name: 'Theater Chase', category: 'party', icon: '🎭' },
    { id: 14, name: 'Theater Chase Rainbow', category: 'party', icon: '🎭' },
    { id: 15, name: 'Running Lights', category: 'simple', icon: '🏃' },
    { id: 16, name: 'Saw', category: 'energetic', icon: '📈' },
    { id: 17, name: 'Twinkle', category: 'relaxing', icon: '✨' },
    { id: 18, name: 'Dissolve', category: 'relaxing', icon: '💫' },
    { id: 19, name: 'Dissolve Random', category: 'party', icon: '💫' },
    { id: 20, name: 'Sparkle', category: 'party', icon: '✨' },
    { id: 21, name: 'Sparkle Dark', category: 'party', icon: '🌟' },
    { id: 22, name: 'Sparkle+', category: 'party', icon: '⭐' },
    { id: 23, name: 'Strobe', category: 'party', icon: '💥' },
    { id: 24, name: 'Strobe Rainbow', category: 'party', icon: '🌈' },
    { id: 25, name: 'Mega Strobe', category: 'party', icon: '⚡' },
    { id: 26, name: 'Blink Rainbow', category: 'party', icon: '🌈' },
    { id: 27, name: 'Android', category: 'energetic', icon: '🤖' },
    { id: 28, name: 'Chase Color', category: 'simple', icon: '🏃' },
    { id: 29, name: 'Chase Random', category: 'energetic', icon: '🎲' },
    { id: 30, name: 'Chase Rainbow', category: 'energetic', icon: '🌈' },
    { id: 31, name: 'Chase Flash', category: 'party', icon: '💥' },
    { id: 32, name: 'Chase Flash Random', category: 'party', icon: '🎲' },
    { id: 33, name: 'Chase Rainbow White', category: 'energetic', icon: '⚪' },
    { id: 34, name: 'Colorful', category: 'relaxing', icon: '🎨' },
    { id: 35, name: 'Traffic Light', category: 'simple', icon: '🚦' },
    { id: 36, name: 'Color Sweep Random', category: 'energetic', icon: '🎲' },
    { id: 37, name: 'Running Color', category: 'simple', icon: '🏃' },
    { id: 38, name: 'Aurora', category: 'nature', icon: '🌌' },
    { id: 39, name: 'Stream', category: 'relaxing', icon: '💧' },
    { id: 40, name: 'Scanner', category: 'energetic', icon: '📡' },
    { id: 41, name: 'Lighthouse', category: 'simple', icon: '🗼' },
    { id: 42, name: 'Fireworks', category: 'party', icon: '🎆' },
    { id: 43, name: 'Rainfall', category: 'nature', icon: '🌧️' },
    { id: 44, name: 'Fire Flicker', category: 'nature', icon: '🔥' },
    { id: 45, name: 'Gradient', category: 'relaxing', icon: '🌅' },
    { id: 46, name: 'Loading', category: 'simple', icon: '⏳' },
    { id: 47, name: 'Police', category: 'energetic', icon: '🚔' },
    { id: 48, name: 'Police All', category: 'energetic', icon: '🚨' },
    { id: 49, name: 'Two Dots', category: 'simple', icon: '◐' },
    { id: 50, name: 'Two Areas', category: 'simple', icon: '▓' },
    { id: 51, name: 'Circus', category: 'party', icon: '🎪' },
    { id: 52, name: 'Halloween', category: 'party', icon: '🎃' },
    { id: 53, name: 'Tri Chase', category: 'energetic', icon: '🔺' },
    { id: 54, name: 'Tri Wipe', category: 'simple', icon: '🔻' },
    { id: 55, name: 'Tri Fade', category: 'relaxing', icon: '🔷' },
    { id: 56, name: 'Lightning', category: 'nature', icon: '⚡' },
    { id: 57, name: 'ICU', category: 'energetic', icon: '👁️' },
    { id: 58, name: 'Multi Comet', category: 'energetic', icon: '☄️' },
    { id: 59, name: 'Scanner Dual', category: 'energetic', icon: '📡' },
    { id: 60, name: 'Stream 2', category: 'relaxing', icon: '💧' },
    { id: 61, name: 'Oscillate', category: 'relaxing', icon: '〰️' },
    { id: 62, name: 'Pride', category: 'party', icon: '🏳️‍🌈' },
    { id: 63, name: 'Juggle', category: 'party', icon: '🤹' },
    { id: 64, name: 'Palette', category: 'relaxing', icon: '🎨' },
    { id: 65, name: 'Cozy Fireplace', category: 'nature', icon: '🔥' },
    { id: 66, name: 'Fire 2012', category: 'nature', icon: '🔥' },
    { id: 67, name: 'Colorwaves', category: 'relaxing', icon: '🌊' },
    { id: 68, name: 'BPM', category: 'party', icon: '💓' },
    { id: 69, name: 'Fill Noise', category: 'relaxing', icon: '📺' },
    { id: 70, name: 'Noise 1', category: 'relaxing', icon: '📺' },
    { id: 71, name: 'Noise 2', category: 'relaxing', icon: '📺' },
    { id: 72, name: 'Noise 3', category: 'relaxing', icon: '📺' },
    { id: 73, name: 'Noise 4', category: 'relaxing', icon: '📺' },
    { id: 74, name: 'Colortwinkles', category: 'party', icon: '✨' },
    { id: 75, name: 'Lake', category: 'nature', icon: '🏞️' },
    { id: 76, name: 'Meteor', category: 'nature', icon: '☄️' },
    { id: 77, name: 'Smooth Meteor', category: 'nature', icon: '☄️' },
    { id: 78, name: 'Railway', category: 'simple', icon: '🚂' },
    { id: 79, name: 'Ripple', category: 'relaxing', icon: '💧' }
  ],
  palettes: [
    { id: 0, name: 'Default' },
    { id: 1, name: 'Random Cycle' },
    { id: 2, name: 'Color 1' },
    { id: 3, name: 'Colors 1 & 2' },
    { id: 4, name: 'Color Gradient' },
    { id: 5, name: 'Colors Only' },
    { id: 6, name: 'Party' },
    { id: 7, name: 'Cloud' },
    { id: 8, name: 'Lava' },
    { id: 9, name: 'Ocean' },
    { id: 10, name: 'Forest' },
    { id: 11, name: 'Rainbow' },
    { id: 12, name: 'Rainbow Bands' },
    { id: 13, name: 'Sunset' },
    { id: 14, name: 'Rivendell' },
    { id: 15, name: 'Breeze' },
    { id: 16, name: 'Red & Blue' },
    { id: 17, name: 'Yellowout' },
    { id: 18, name: 'Analogous' },
    { id: 19, name: 'Splash' },
    { id: 20, name: 'Pastel' },
    { id: 21, name: 'Sunset 2' },
    { id: 22, name: 'Beach' },
    { id: 23, name: 'Vintage' },
    { id: 24, name: 'Departure' },
    { id: 25, name: 'Landscape' },
    { id: 26, name: 'Beech' },
    { id: 27, name: 'Sherbet' },
    { id: 28, name: 'Hult' },
    { id: 29, name: 'Hult 64' },
    { id: 30, name: 'Drywet' }
  ]
};

class WLEDApi {
  constructor() {
    this.deviceIp = localStorage.getItem('wled_device_ip') || '';
    this.demoMode = localStorage.getItem('wled_demo_mode') === 'true';
    this.connected = false;
    this.state = this.getDefaultState();
    this.listeners = [];

    // Load cached state for demo mode
    if (this.demoMode) {
      const cached = localStorage.getItem('wled_demo_state');
      if (cached) {
        try {
          this.state = { ...this.state, ...JSON.parse(cached) };
        } catch (e) {
          console.error('Failed to parse demo state:', e);
        }
      }
    }
  }

  getDefaultState() {
    return {
      on: false,
      bri: 128,
      seg: [{
        col: [[255, 180, 107], [0, 0, 0], [0, 0, 0]],
        fx: 0,
        sx: 128,
        ix: 128,
        pal: 0
      }],
      info: {
        name: 'Demo Lights',
        ver: '0.14.0',
        leds: { count: 60 }
      }
    };
  }

  // Subscribe to state changes
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners of state change
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Get base URL for API calls
  getBaseUrl() {
    if (!this.deviceIp) return null;
    const ip = this.deviceIp.trim();
    if (ip.startsWith('http://') || ip.startsWith('https://')) {
      return ip;
    }
    return `http://${ip}`;
  }

  // Enable/disable demo mode
  setDemoMode(enabled) {
    this.demoMode = enabled;
    localStorage.setItem('wled_demo_mode', enabled);

    if (enabled) {
      this.connected = true;
      this.state = this.getDefaultState();
      localStorage.setItem('wled_demo_state', JSON.stringify(this.state));
    } else {
      this.connected = false;
    }

    this.notifyListeners();
    return this.state;
  }

  // Set device IP
  setDeviceIp(ip) {
    this.deviceIp = ip;
    localStorage.setItem('wled_device_ip', ip);
  }

  // Test connection to device
  async testConnection() {
    if (this.demoMode) {
      return { success: true, info: this.state.info };
    }

    const baseUrl = this.getBaseUrl();
    if (!baseUrl) {
      return { success: false, error: 'No device IP configured' };
    }

    try {
      const response = await fetch(`${baseUrl}/json/info`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const info = await response.json();
      this.connected = true;
      this.state.info = info;

      // Auto-disable demo mode when real connection succeeds
      if (this.demoMode) {
        this.setDemoMode(false);
      }

      return { success: true, info };
    } catch (error) {
      this.connected = false;
      return { success: false, error: error.message };
    }
  }

  // Fetch current state from device
  async fetchState() {
    if (this.demoMode) {
      return this.state;
    }

    const baseUrl = this.getBaseUrl();
    if (!baseUrl) {
      throw new Error('No device IP configured');
    }

    try {
      const response = await fetch(`${baseUrl}/json`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      this.state = { ...this.state, ...data.state, info: data.info };
      this.connected = true;
      this.notifyListeners();
      return this.state;
    } catch (error) {
      this.connected = false;
      throw error;
    }
  }

  // Send state update to device
  async setState(update) {
    if (this.demoMode) {
      // Merge update into current state
      if (update.on !== undefined) this.state.on = update.on;
      if (update.bri !== undefined) this.state.bri = update.bri;
      if (update.seg) {
        this.state.seg = this.state.seg.map((seg, i) => {
          const updateSeg = update.seg[i] || {};
          return { ...seg, ...updateSeg };
        });
      }
      if (update.ps !== undefined) {
        // Load preset (just acknowledge in demo)
        console.log('Demo: Loading preset', update.ps);
      }

      // Save demo state
      localStorage.setItem('wled_demo_state', JSON.stringify(this.state));
      this.notifyListeners();
      return this.state;
    }

    const baseUrl = this.getBaseUrl();
    if (!baseUrl) {
      throw new Error('No device IP configured');
    }

    try {
      const response = await fetch(`${baseUrl}/json/state`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(update),
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const newState = await response.json();
      this.state = { ...this.state, ...newState };
      this.connected = true;
      this.notifyListeners();
      return this.state;
    } catch (error) {
      this.connected = false;
      throw error;
    }
  }

  // Convenience methods
  async togglePower() {
    return this.setState({ on: !this.state.on });
  }

  async setPower(on) {
    return this.setState({ on });
  }

  async setBrightness(bri) {
    return this.setState({ bri: Math.round(bri) });
  }

  async setColor(r, g, b) {
    return this.setState({
      seg: [{ col: [[r, g, b]] }]
    });
  }

  async setEffect(fx) {
    return this.setState({
      seg: [{ fx }]
    });
  }

  async setEffectSpeed(sx) {
    return this.setState({
      seg: [{ sx: Math.round(sx) }]
    });
  }

  async setEffectIntensity(ix) {
    return this.setState({
      seg: [{ ix: Math.round(ix) }]
    });
  }

  async loadPreset(ps) {
    return this.setState({ ps });
  }

  // Get effects list
  getEffects() {
    return EFFECT_DATA.effects;
  }

  // Get effects by category
  getEffectsByCategory(category) {
    if (category === 'all') {
      return EFFECT_DATA.effects;
    }
    return EFFECT_DATA.effects.filter(e => e.category === category);
  }

  // Get palettes list
  getPalettes() {
    return EFFECT_DATA.palettes;
  }

  // Get current state
  getState() {
    return this.state;
  }

  // Check if connected
  isConnected() {
    return this.connected || this.demoMode;
  }

  // Check if in demo mode
  isDemoMode() {
    return this.demoMode;
  }
}

// Favorites management
class FavoritesManager {
  constructor() {
    this.favorites = this.loadFavorites();
  }

  loadFavorites() {
    try {
      const stored = localStorage.getItem('wled_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load favorites:', e);
      return [];
    }
  }

  saveFavorites() {
    localStorage.setItem('wled_favorites', JSON.stringify(this.favorites));
  }

  getAll() {
    return this.favorites;
  }

  add(name, state) {
    const favorite = {
      id: `fav_${Date.now()}`,
      name,
      state: {
        on: state.on,
        bri: state.bri,
        seg: state.seg ? [{
          col: state.seg[0]?.col || [[255, 255, 255]],
          fx: state.seg[0]?.fx || 0,
          sx: state.seg[0]?.sx || 128,
          ix: state.seg[0]?.ix || 128
        }] : [{ col: [[255, 255, 255]], fx: 0 }]
      },
      createdAt: new Date().toISOString()
    };

    this.favorites.push(favorite);
    this.saveFavorites();
    return favorite;
  }

  remove(id) {
    this.favorites = this.favorites.filter(f => f.id !== id);
    this.saveFavorites();
  }

  get(id) {
    return this.favorites.find(f => f.id === id);
  }
}

// Recent colors management
class RecentColorsManager {
  constructor(maxColors = 8) {
    this.maxColors = maxColors;
    this.colors = this.loadColors();
  }

  loadColors() {
    try {
      const stored = localStorage.getItem('wled_recent_colors');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  saveColors() {
    localStorage.setItem('wled_recent_colors', JSON.stringify(this.colors));
  }

  add(r, g, b) {
    const colorKey = `${r},${g},${b}`;

    // Remove if already exists
    this.colors = this.colors.filter(c => `${c[0]},${c[1]},${c[2]}` !== colorKey);

    // Add to front
    this.colors.unshift([r, g, b]);

    // Limit size
    if (this.colors.length > this.maxColors) {
      this.colors = this.colors.slice(0, this.maxColors);
    }

    this.saveColors();
  }

  getAll() {
    return this.colors;
  }
}

// Export instances
const wledApi = new WLEDApi();
const favoritesManager = new FavoritesManager();
const recentColorsManager = new RecentColorsManager();
