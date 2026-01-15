# WLED Glow — Making Your LED Lights Actually Easy to Use

Hey! So you've got WLED running on your LED strips (or you're thinking about it), and you've probably noticed the built-in interface is... a lot. This doc explains what we're building to fix that.

---

## The Problem

WLED is amazing open-source software. It runs on a $5 ESP32, controls thousands of LEDs, has 180+ effects, works with Home Assistant — genuinely impressive stuff.

But the interface looks like it was designed by engineers, for engineers (because it was). Here's what your average person sees when they open it:

- A dropdown with 180 effects named things like "BPM", "Juggle", and "2D Drift Rose"
- Sliders labeled "FX", "IX", "Seg 0"
- Tiny buttons that are impossible to tap on a phone
- Settings mixed in with controls
- No way to save favorites

Your partner/kids/parents take one look and go "can you just set it to something nice?"

**We're fixing that.**

---

## What We're Building

**WLED Glow** — a simple, beautiful app that talks to your existing WLED setup. You don't replace anything. Your ESP32 and LEDs stay exactly the same. This is just a better remote control.

Think of it like this: WLED's built-in interface is the "full settings panel." Our app is the "everyday remote."

### The Big Ideas

1. **One big ON/OFF button** — not buried in a menu
2. **Brightness slider you can actually use** — big, easy to drag
3. **Color swatches** — tap "Warm White" or "Ocean Blue", done
4. **Effects as visual cards** — browse by mood (Relaxing, Party, Nature), not a 180-item dropdown
5. **Favorites** — save "Movie Night" once, tap it forever
6. **Works on your phone** — install it like an app, lives on your home screen

### What We're NOT Building

- No segment editor (use WLED's interface for that)
- No audio-reactive setup (that's advanced config stuff)
- No device configuration (WiFi settings, LED count, etc.)

This is the "daily driver" app, not the "I'm setting up my whole house" app.

---

## How It Actually Works

Your phone/tablet talks directly to your WLED device over your home WiFi:

```
┌──────────────┐         WiFi          ┌──────────────┐
│              │  ←───────────────────→ │              │
│  WLED Glow   │    "turn on, blue"    │  Your ESP32  │
│  (your phone)│                        │  + LED strip │
│              │  ←───────────────────→ │              │
└──────────────┘     "ok, done"        └──────────────┘
```

No cloud. No account. No subscription. Just your phone talking to your lights.

The app is a "PWA" (Progressive Web App) — basically a website that acts like an app. You open it in your browser once, tap "Add to Home Screen", and boom — it's an app. Works on iPhone, Android, tablets, whatever.

---

## Demo Mode (Try It Without Hardware)

Here's something cool: **you don't need any hardware to try the app.**

When you first open WLED Glow without a device configured, it'll ask if you want to try Demo Mode. Say yes, and you get:

- Full working app
- Fake "lights" that respond to your taps
- All the effects and colors to browse
- Everything works except actually controlling real LEDs

This is great for:
- **Showing off the app** before someone buys hardware
- **Learning the interface** before setting up your lights
- **Development and testing** (more on that below)

When you're ready to connect real lights, just enter your device's IP address and Demo Mode turns off automatically.

---

## The Screens

### Home
The "remote control" view. What you see 90% of the time.

```
┌─────────────────────────────────┐
│         WLED Glow         [⚙️] │
├─────────────────────────────────┤
│                                 │
│            ◉ ON                 │
│                                 │
│   ────────●────────────────     │
│         Brightness              │
│                                 │
│  🟡 ⚪ 🔴 🟠 🔵 🟣 🟢 🩷         │
│  Quick Colors                   │
│                                 │
│  [Rainbow] [Breathe] [Fire]     │
│  Quick Effects                  │
│                                 │
│  ★ Movie Night   ★ Chill        │
│  Your Favorites                 │
└─────────────────────────────────┘
```

### Colors
Full color picker when the swatches aren't enough.

- Color wheel (drag to pick any color)
- White temperature slider (warm → cool)
- Palette browser with visual previews

### Effects
Browse all effects without the overwhelm.

- Cards with icons, not a text dropdown
- Grouped by mood: Relaxing, Energetic, Nature, Party
- Human names: "Cozy Fireplace" not "Fire 2012"
- Speed slider when you pick an effect

### Saved
Your favorites + presets from the WLED device.

- One tap to apply any saved look
- Save current setup with a custom name
- Delete ones you don't want anymore

### Settings
Minimal. Just the essentials.

- Device IP address
- Connection status (green = good, red = problem)
- Demo Mode toggle
- That's basically it

---

## Testing Without Real Hardware

For development, there are a few ways to test:

### Option 1: Demo Mode (Built-in)
Just use the app's Demo Mode. All the UI works, you just don't see real lights change. Good for UI development and showing the app to people.

### Option 2: WLED Simulator
There's an open-source simulator called [wled-sim](https://github.com/13rac1/wled-sim) that acts like a real WLED device:

```bash
# Install (needs Go)
git clone https://github.com/13rac1/wled-sim
cd wled-sim
go run ./cmd -rows 10 -cols 3 -http :9090
```

Then point the app at `http://localhost:9090`. You'll see a little window with a virtual LED matrix that actually changes colors when you tap things in the app.

**What works:** Power, brightness, colors
**What doesn't work:** Effects (it just shows solid colors)

### Option 3: Real Hardware
An ESP32 + a few LEDs costs like $15 total. Flash WLED at [install.wled.me](https://install.wled.me) and you're running in 5 minutes. Honestly this is the most satisfying way to test.

---

## Timeline

We're building this in phases:

### Phase 1: MVP
- Home screen (power, brightness, colors)
- Basic effect picker
- Device setup
- Works as installable PWA

### Phase 2: Polish
- Effect cards with categories
- Full color wheel
- Favorites system
- Demo Mode

### Phase 3: Delight
- Visual effect previews
- Smooth animations
- Onboarding flow for new users
- Final polish

---

## Tech Stuff (Brief)

For the curious:

- **Built with:** HTML/CSS/JavaScript (keeping it simple and fast)
- **Styling:** Tailwind CSS
- **PWA features:** Service Worker for offline, Web App Manifest for install
- **Talks to WLED via:** JSON API over HTTP (standard WLED interface)
- **Data storage:** localStorage (favorites, settings — all local, no cloud)
- **Dark mode:** Yes, by default (you're using this in a dim room)

---

## FAQ

**Do I need to change anything on my WLED device?**
Nope. Works with any WLED 0.14+ device out of the box.

**Does this replace WLED?**
No, it's a companion app. WLED still runs on your ESP32, this is just a nicer way to control it day-to-day.

**Can I still use WLED's built-in interface?**
Absolutely. Use WLED's interface for setup and advanced stuff, use this app for daily control.

**Does it work offline?**
The app itself loads offline (it's cached). But you need to be on the same WiFi as your lights to control them.

**iPhone or Android?**
Both! It's a web app that works everywhere.

**What about multiple WLED devices?**
Not in v1, but it's on the roadmap.

**Is this free?**
That's up to you! It's your app. We're just building it.

---

## Questions?

Let me know what else you want to know. Happy to adjust the plan, add features, or explain anything in more detail.
