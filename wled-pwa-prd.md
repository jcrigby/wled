# Product Requirements Document (PRD)
# WLED Glow — A User-Friendly LED Controller PWA

**Version:** 1.0  
**Date:** January 14, 2026  
**Author:** Claude  
**Status:** Draft

---

## 1. Executive Summary

**WLED Glow** is a Progressive Web App (PWA) designed to make controlling WLED-powered LED strips simple and delightful for everyday users. While WLED's native web interface is powerful, it's designed for enthusiasts and can overwhelm casual users with technical options. WLED Glow strips away the complexity, presenting a beautiful, intuitive interface that anyone can use — no technical knowledge required.

**One-liner:** *"Control your LED lights like you control your music — simple, beautiful, instant."*

---

## 2. Problem Statement

### Current Pain Points

| Problem | Impact |
|---------|--------|
| WLED's native UI shows 180+ effects in a dropdown list | Users feel overwhelmed, don't explore |
| Technical labels like "FX", "IX", "Segment 0" | Creates anxiety for non-technical users |
| Small touch targets, desktop-first design | Frustrating on mobile devices |
| No visual previews of effects or palettes | Users must try each one blindly |
| Settings and controls mixed together | Hard to find basic functions quickly |
| No "favorites" or quick access to commonly used setups | Repetitive navigation every session |

### Opportunity

There's a gap between WLED's powerful capabilities and the average user's ability to enjoy them. A simplified PWA can unlock WLED for a broader audience — families, casual smart home users, and anyone who just wants pretty lights without reading documentation.

---

## 3. Target Users

### Primary Persona: "Casual Casey"

- **Age:** 28-45
- **Tech comfort:** Uses iPhone/Android daily, has smart home devices, but doesn't code
- **Context:** Bought LED strips for ambient lighting (TV backlight, bedroom, living room)
- **Goals:** Set a mood quickly, save favorites, forget about configuration
- **Frustrations:** "Why are there so many options? I just want it to look nice."

### Secondary Persona: "Family Fiona"

- **Age:** 35-50
- **Tech comfort:** Basic smartphone user
- **Context:** Partner or family member set up the LEDs, now wants to control them
- **Goals:** Turn lights on/off, pick a color, maybe a fun effect for movie night
- **Frustrations:** "My partner showed me once but I forgot. The app looks complicated."

### Non-Target Users (for v1)

- Power users who want segment-level control
- Users who need audio-reactive features
- Commercial/professional lighting installers

---

## 4. Goals & Success Metrics

### Product Goals

| Goal | Description |
|------|-------------|
| **Simplicity** | A new user can turn on lights and set a color within 10 seconds |
| **Delight** | Visual design makes users *want* to open the app |
| **Speed** | All interactions feel instant (<100ms perceived latency) |
| **Installability** | Users can add to home screen and use like a native app |
| **Reliability** | Works even with spotty WiFi, graceful error handling |

### Success Metrics (if trackable)

| Metric | Target |
|--------|--------|
| Time to first successful action | < 15 seconds |
| User can find ON/OFF without guidance | 100% |
| User can change color without guidance | 95% |
| App loads (cached) | < 1 second |
| PWA install rate (if prompted) | > 30% |

---

## 5. User Stories

### Epic 1: Basic Control

| ID | Story | Priority |
|----|-------|----------|
| U1.1 | As a user, I want to turn my lights on and off with one tap | P0 |
| U1.2 | As a user, I want to adjust brightness with a simple slider | P0 |
| U1.3 | As a user, I want to pick a color from preset swatches | P0 |
| U1.4 | As a user, I want to pick a custom color from a color wheel | P1 |
| U1.5 | As a user, I want to see the current state of my lights when I open the app | P0 |

### Epic 2: Effects & Moods

| ID | Story | Priority |
|----|-------|----------|
| U2.1 | As a user, I want to browse effects as visual cards, not a text list | P0 |
| U2.2 | As a user, I want effects grouped by mood (Relaxing, Party, Nature, etc.) | P1 |
| U2.3 | As a user, I want to adjust effect speed with a simple slider | P1 |
| U2.4 | As a user, I want to see human-friendly effect names, not technical ones | P0 |
| U2.5 | As a user, I want to preview what an effect looks like before applying | P2 |

### Epic 3: Favorites & Presets

| ID | Story | Priority |
|----|-------|----------|
| U3.1 | As a user, I want to save my current setup as a favorite | P1 |
| U3.2 | As a user, I want to access my favorites from the home screen | P1 |
| U3.3 | As a user, I want to load presets saved on my WLED device | P1 |
| U3.4 | As a user, I want to give my favorites custom names | P2 |
| U3.5 | As a user, I want to delete favorites I no longer want | P2 |

### Epic 4: Setup & Connection

| ID | Story | Priority |
|----|-------|----------|
| U4.1 | As a user, I want to enter my WLED device's IP address once and have it remembered | P0 |
| U4.2 | As a user, I want to see if my device is connected or not | P0 |
| U4.3 | As a user, I want to try the app in Demo Mode without any hardware | P0 |
| U4.4 | As a user, I want the app to auto-discover WLED devices on my network | P2 |
| U4.5 | As a user, I want to control multiple WLED devices | P2 |
| U4.6 | As a user, I want to give my device a friendly name | P2 |

### Epic 5: PWA Experience

| ID | Story | Priority |
|----|-------|----------|
| U5.1 | As a user, I want to install the app to my home screen | P0 |
| U5.2 | As a user, I want the app to load instantly, even offline | P1 |
| U5.3 | As a user, I want the app to work in standalone mode (no browser UI) | P0 |
| U5.4 | As a user, I want a splash screen when the app launches | P2 |

---

## 6. Feature Requirements

### 6.1 Home Screen

**Purpose:** The "remote control" — fastest path to common actions.

**Components:**

| Component | Behavior |
|-----------|----------|
| **Power Button** | Large, centered toggle. Tap to turn on/off. Visual state change (glow when on). |
| **Brightness Slider** | Horizontal slider below power button. Real-time updates as user drags. |
| **Quick Colors** | 6-8 color swatches (Warm White, Cool White, Red, Orange, Blue, Purple, Green, Pink). Tap to apply. |
| **Quick Effects** | 4-6 most popular effects as icon buttons (Solid, Rainbow, Breathe, Fire, Ocean, Party). |
| **Favorites Row** | Horizontal scroll of user's saved favorites. Tap to apply. |
| **Current State Indicator** | Subtle text or icon showing current effect/color name. |

**Wireframe Concept:**

```
┌─────────────────────────────────┐
│         WLED Glow         [⚙️] │
├─────────────────────────────────┤
│                                 │
│            ◉ ON                │
│         (big button)            │
│                                 │
│   ───────●─────────────────     │
│         Brightness              │
│                                 │
├─────────────────────────────────┤
│  Quick Colors                   │
│  🟡 ⚪ 🔴 🟠 🔵 🟣 🟢 🩷        │
├─────────────────────────────────┤
│  Quick Effects                  │
│  [Solid] [Rainbow] [Breathe]    │
│  [Fire]  [Ocean]   [Party]      │
├─────────────────────────────────┤
│  ★ My Favorites                 │
│  [Movie Night] [Chill] [Wake]   │
└─────────────────────────────────┘
      [🏠]    [🎨]    [✨]    [★]
       Home   Colors  Effects  Saved
```

### 6.2 Colors Screen

**Purpose:** Full color selection for users who want more than quick swatches.

**Components:**

| Component | Behavior |
|-----------|----------|
| **Color Wheel** | Touch-draggable HSV color picker. Updates lights in real-time. |
| **Brightness Slider** | Integrated or separate, controls overall brightness. |
| **White Temperature** | Slider from warm (2700K) to cool (6500K) — only show if device supports CCT. |
| **Palette Browser** | Grid of palette swatches with visual previews. Tap to apply. |
| **Recent Colors** | Last 5-8 colors user selected. |

### 6.3 Effects Screen

**Purpose:** Browse and apply effects without overwhelm.

**Layout:** Card/tile grid, NOT a dropdown list.

**Components:**

| Component | Behavior |
|-----------|----------|
| **Category Tabs/Filter** | Filter by mood: All, Relaxing, Energetic, Nature, Party, Solid/Simple |
| **Effect Cards** | Visual cards with: Icon/preview, Human name, Tap to apply |
| **Active Effect Highlight** | Currently active effect is visually highlighted |
| **Effect Controls** | When effect is selected, show: Speed slider, Intensity slider (only if effect uses them) |

**Effect Name Mapping (examples):**

| WLED Name | User-Friendly Name | Category |
|-----------|-------------------|----------|
| Solid | Solid Color | Simple |
| Blink | Blinking | Simple |
| Breathe | Breathing Pulse | Relaxing |
| Rainbow | Rainbow Wave | Energetic |
| Fire 2012 | Cozy Fireplace | Nature |
| Ocean | Ocean Waves | Nature |
| Colorloop | Color Cycle | Relaxing |
| Fireworks | Fireworks | Party |
| Sparkle | Sparkle | Party |
| Chase | Color Chase | Energetic |
| Meteor | Shooting Star | Nature |
| Rain | Rainfall | Nature |
| Pride 2015 | Pride Rainbow | Party |

### 6.4 Saved/Favorites Screen

**Purpose:** Quick access to user's saved configurations.

**Components:**

| Component | Behavior |
|-----------|----------|
| **Favorites List** | Grid or list of saved favorites. Shows name + color preview. |
| **Device Presets** | Section showing presets stored on WLED device (from presets.json). |
| **Save Current Button** | Floating button to save current state as new favorite. |
| **Edit Mode** | Long-press or edit button to rename/delete favorites. |

### 6.5 Settings Screen

**Purpose:** Configuration (should be minimal for most users).

**Components:**

| Component | Behavior |
|-----------|----------|
| **Device IP** | Text input for WLED IP address. Saved to localStorage. |
| **Connection Status** | Green/red indicator showing if device is reachable. |
| **Device Info** | Read-only: WLED version, LED count, device name (fetched from /json/info). |
| **Test Connection** | Button to verify connection works. |
| **Demo Mode Toggle** | Switch to enable/disable demo mode. |
| **About** | App version, link to WLED project. |

### 6.6 Demo Mode

**Purpose:** Allow users to explore the app without any WLED hardware. Essential for onboarding, demos, and development testing.

**Behavior:**

| Aspect | Implementation |
|--------|----------------|
| **Activation** | Toggle in Settings, or auto-prompt on first launch if no device configured |
| **Visual Indicator** | Persistent "Demo Mode" badge in header/corner |
| **Mock Responses** | All API calls return realistic fake data |
| **State Persistence** | Demo state saved to localStorage, survives refresh |
| **LED Preview** | Optional: animated preview strip showing current color/effect |

**Mock Data Includes:**

| Data | Mock Value |
|------|------------|
| Device name | "Demo Lights" |
| LED count | 60 |
| WLED version | "0.14.0" |
| Effects list | Full list of ~50 curated effects with friendly names |
| Palettes list | Full list of ~50 palettes |
| Current state | Responds to user changes, persists in memory |

**User Flow:**
```
First Launch → No device configured → "Try Demo Mode?" prompt
                                   ↓
                            [Try Demo] → Demo Mode enabled, full app access
                                   ↓
                            [Skip] → Settings screen to enter IP
```

**Exit Demo Mode:**
- User enters a real device IP and saves
- Demo mode automatically disables when real connection succeeds
- User can manually toggle off in Settings

---

## 7. Technical Requirements

### 7.1 Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | Vanilla JS or lightweight (Preact/Alpine) | Fast load, small bundle |
| **Styling** | Tailwind CSS (CDN) or custom CSS | Rapid development, small footprint |
| **PWA** | Service Worker + Manifest | Installability, offline support |
| **State** | localStorage | Persist favorites, device IP |
| **API** | WLED JSON API over HTTP | Standard WLED interface |

### 7.2 WLED API Integration

**Endpoints Used:**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/json` | GET | Fetch full state, effects list, palettes |
| `/json/state` | POST | Update state (on, bri, colors, effects) |
| `/json/info` | GET | Device info (version, LED count) |
| `/json/eff` | GET | Effect names list |
| `/json/pal` | GET | Palette names list |
| `/presets.json` | GET | User presets |

**Common API Calls:**

```javascript
// Turn on
POST /json/state  {"on": true}

// Set brightness
POST /json/state  {"bri": 128}

// Set color (first segment)
POST /json/state  {"seg": [{"col": [[255, 100, 0]]}]}

// Set effect
POST /json/state  {"seg": [{"fx": 9}]}  // Rainbow

// Set effect with speed
POST /json/state  {"seg": [{"fx": 9, "sx": 128}]}

// Load preset
POST /json/state  {"ps": 1}
```

### 7.3 PWA Requirements

| Requirement | Implementation |
|-------------|----------------|
| **Manifest** | `manifest.json` with name, icons (192px, 512px), `display: standalone`, theme color |
| **Service Worker** | Cache app shell, effect/palette data. Network-first for state. |
| **HTTPS** | Required for PWA. User must access via HTTPS or localhost. |
| **Icons** | App icon in multiple sizes, maskable icon for Android |
| **Offline** | Show cached UI with "offline" indicator. Queue commands for retry. |

### 7.4 Network & Error Handling

| Scenario | Handling |
|----------|----------|
| Device unreachable | Show clear error: "Can't connect to lights. Check WiFi and IP address." |
| Slow response | Show loading spinner on affected control. Timeout after 5s. |
| Invalid IP | Validate format before saving. Show error if connection test fails. |
| CORS issues | WLED allows CORS by default. If issues, document for user. |

---

## 8. UX/UI Requirements

### 8.1 Design Principles

1. **Dark Mode Default** — LEDs are used in ambient settings, dark UI reduces eye strain
2. **High Contrast** — Controls must be visible in dim rooms
3. **Touch-First** — All targets minimum 48x48px, generous padding
4. **Instant Feedback** — Every tap shows immediate visual response
5. **Minimal Text** — Use icons and visuals over labels where possible
6. **No Jargon** — "Brightness" not "bri", "Speed" not "sx"

### 8.2 Visual Style

| Element | Specification |
|---------|---------------|
| **Background** | Dark gray (#1a1a1a) or near-black (#0d0d0d) |
| **Cards/Surfaces** | Slightly lighter (#2a2a2a) with subtle border or shadow |
| **Primary Accent** | Vibrant but not harsh (suggest: #6366f1 indigo or #8b5cf6 purple) |
| **Text - Primary** | White (#ffffff) or near-white (#f5f5f5) |
| **Text - Secondary** | Gray (#a0a0a0) |
| **Success** | Green (#22c55e) |
| **Error** | Red (#ef4444) |
| **Fonts** | System font stack (`system-ui, -apple-system, sans-serif`) |
| **Border Radius** | Generous (12-16px for cards, 8px for buttons) |
| **Transitions** | 150-200ms ease-out for all interactive elements |

### 8.3 Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| **Mobile (<640px)** | Single column, bottom tab navigation, full-width controls |
| **Tablet (640-1024px)** | Two-column grid for effects, side-by-side color wheel + swatches |
| **Desktop (>1024px)** | Max-width container (480px), centered. Optional: show all tabs as sidebar. |

### 8.4 Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Color contrast | Minimum 4.5:1 for text, 3:1 for UI elements |
| Touch targets | Minimum 48x48px |
| Focus indicators | Visible focus ring for keyboard navigation |
| Screen readers | Proper ARIA labels on all controls |
| Reduced motion | Respect `prefers-reduced-motion` media query |

---

## 9. Data Model

### 9.1 Local Storage Schema

```javascript
{
  // Device configuration
  "wled_device_ip": "192.168.1.100",
  "wled_device_name": "Living Room",  // user-assigned
  
  // Cached data (for offline/fast load)
  "wled_effects_cache": ["Solid", "Blink", ...],
  "wled_palettes_cache": ["Default", "Rainbow", ...],
  
  // User favorites
  "wled_favorites": [
    {
      "id": "fav_1",
      "name": "Movie Night",
      "state": {
        "on": true,
        "bri": 50,
        "seg": [{"col": [[255, 147, 41]], "fx": 0}]
      }
    }
  ],
  
  // Recent colors
  "wled_recent_colors": [
    [255, 147, 41],
    [0, 150, 255],
    ...
  ]
}
```

### 9.2 Effect Categories Mapping

Static mapping of WLED effect IDs to user-friendly categories:

```javascript
const EFFECT_CATEGORIES = {
  relaxing: [0, 2, 5, 9, 63, ...],    // Solid, Breathe, Random Colors, etc.
  energetic: [1, 3, 6, 10, 11, ...],  // Blink, Wipe, Sweep, Scan, etc.
  nature: [43, 66, 76, 77, ...],      // Rain, Fire 2012, Meteor, etc.
  party: [23, 42, 64, 65, ...],       // Strobe, Fireworks, etc.
  simple: [0, 1, 2, 12, ...]          // Solid, Blink, Breathe, Fade
};

const EFFECT_FRIENDLY_NAMES = {
  0: "Solid Color",
  1: "Blinking",
  2: "Breathing Pulse",
  // ... etc
};
```

---

## 10. Out of Scope (v1)

The following features are explicitly NOT included in version 1:

| Feature | Reason |
|---------|--------|
| Segment control | Adds complexity, power-user feature |
| Audio-reactive effects | Requires additional hardware/setup |
| 2D matrix support | Niche use case |
| Multi-device sync | Complexity, defer to v2 |
| Scheduling/timers | WLED native UI handles this |
| Custom effect parameters (c1, c2, c3) | Too technical for target users |
| Playlist creation | Complexity, defer to v2 |
| Direct device configuration | Use WLED native UI for setup |

---

## 11. Release Plan

### Phase 1: MVP (v0.1)
**Goal:** Basic functional app

- [ ] Home screen with power, brightness, quick colors
- [ ] Single effect dropdown (not cards yet)
- [ ] Device IP configuration
- [ ] PWA manifest and basic service worker
- [ ] Works on mobile Chrome/Safari

### Phase 2: Enhanced UI (v0.2)
**Goal:** Polished experience

- [ ] Effect cards with categories
- [ ] Color wheel picker
- [ ] Favorites system (save/load)
- [ ] Visual effect name mapping
- [ ] Improved offline support

### Phase 3: Delight (v1.0)
**Goal:** Ready for general users

- [ ] Effect previews/animations
- [ ] Palette browser with visuals
- [ ] Device presets integration
- [ ] Onboarding flow for new users
- [ ] Polish, animations, micro-interactions

### Future (v2.0+)
- Multi-device support
- Device discovery (mDNS)
- Simple segment control
- Sharing favorites

---

## 12. Open Questions

| Question | Options | Decision |
|----------|---------|----------|
| How to handle effect previews? | Static images, CSS animations, or skip for v1 | TBD |
| Should we show ALL effects or curate a subset? | All (180+) vs. curated (30-50 best) | Suggest: curated |
| Color wheel implementation | Library (iro.js, vanilla-picker) vs. custom | TBD |
| Handle multiple segments? | Ignore (apply to all), show warning, or basic support | Suggest: ignore for v1 |
| Naming: "WLED Glow" or something else? | Glow, Lumina, Hue Home, LightBox | TBD |

---

## 13. Appendix

### A. WLED Effect IDs Reference (Partial)

| ID | Name | Good for casual users? |
|----|------|------------------------|
| 0 | Solid | ✅ Essential |
| 1 | Blink | ✅ Simple |
| 2 | Breathe | ✅ Popular |
| 9 | Rainbow | ✅ Popular |
| 12 | Fade | ✅ Simple |
| 42 | Fireworks | ✅ Fun |
| 43 | Rain | ✅ Relaxing |
| 63 | Pride 2015 | ✅ Popular |
| 66 | Fire 2012 | ✅ Popular |
| 68 | Colorwaves | ✅ Beautiful |

### B. Competitor/Reference Apps

| App | Strengths | Weaknesses |
|-----|-----------|------------|
| Philips Hue | Polished UI, scene-based | Expensive, closed ecosystem |
| LIFX | Good color picker | Complex for new users |
| Govee Home | Fun effects | Cluttered, too many features |
| WLED Native | Full featured | Technical, overwhelming |

### C. Technical Reference Links

- WLED JSON API: https://kno.wled.ge/interfaces/json-api/
- WLED Effects List: https://kno.wled.ge/features/effects/
- PWA Best Practices: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Best_practices

---

*End of PRD*
