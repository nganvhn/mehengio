# Mẹ Hẹn Giờ — Mom Timer

A gentle iPhone timer for new moms. One tap sets a reminder for the things that fill the first months:

- **Hút sữa** — pumping
- **Rã đông sữa** — thawing breast milk
- **Rã đông đồ ăn** — thawing baby food
- **Nấu cháo** — rice porridge, as a 3-step chain (soak → cook → cool)
- **Bánh ăn dặm** — baking baby biscuits
- **Khác** — anything else

Big round buttons, very little text, soft colours. Vietnamese and English.

> **Status:** interactive design prototype. This repo holds the screens and their behaviour, not a shipping iOS app yet. See [Building the real app](#building-the-real-app).

## What's in it

| Area | What the design covers |
|---|---|
| Core timer | Pick a task → set minutes or an alarm time → start. Each task has its own animated 3D timer: a drop falling into the bottle, a frozen milk block melting, porridge bubbling, biscuits browning. |
| Leaving the app | Live Activity on the Dynamic Island (compact and expanded) and the lock screen; full-screen alarm through Silent mode (AlarmKit, iOS 26+). |
| Automatic history | After pumping, one tap records the side (Left / Right / Both). Home shows "last pumped 2 h ago · Left". |
| Smart next reminder | Suggests the next pumping time from recent gaps (idea from Huckleberry SweetSpot). |
| Family sharing | One timer shows on Mom's, Dad's and Gran's phones; anyone can pause or stop it. |
| Use-by timer | When thawing ends, a countdown for the thawed milk starts. When it expires it alerts and hides "Baby fed". |
| Undo | Stopping a timer or discarding milk can be undone for 8 seconds. |
| Language | Settings → Tiếng Việt / English. Switches every screen, including past history. |

## Repository layout

```
design/            Prototype screens (.dc.html) and the canvas layout (canvas.json)
  Main.dc.html     The full interactive app — every flow runs inside this one file
  Timer3d.dc.html  The six animated 3D timers
  Icon3d.dc.html   The shared 3D icon set
  *.dc.html        Other boards: individual app screens, Dynamic Island, lock screen, alarm, family phone
docs/              Accessibility notes
tests/             Flow and language tests (Node, no dependencies)
```

The `.dc.html` files are Design Component artboards from a Claude design canvas. They load a canvas runtime (`support.js`) that isn't in this repo, so opening them straight in a browser won't render them. Read them as the source of truth for layout, colours, copy and behaviour. The logic in each file's `<script type="text/x-dc">` block is plain JavaScript.

## Running the tests

Needs Node 18 or later, with no installs:

```sh
node tests/flows.test.js
```

The 38 checks run the prototype's own logic and cover:
- the main flows: pumping, thawing, porridge steps, stop and undo, milk expiry, replacing a running timer
- the language switch, including that Vietnamese and English have the same 108 text keys

## Design notes

- **Palette:** warm cream (`#FBF6F1`) with one pastel per task. Pumping is blush, thawing milk sky blue, thawing food lavender, porridge butter, biscuits sage, other sand. All text meets WCAG AA contrast.
- **Type:** SF Pro on iOS, with Be Vietnam Pro as the web fallback for Vietnamese diacritics.
- **Touch targets:** 56–132 pt, well above Apple's 44 pt minimum.
- **Motion:** every animation stops with Reduce Motion. Fill level and colour still show progress.

## Building the real app

Suggested stack: **SwiftUI** (iOS 26 SDK, Xcode 26).

- **ActivityKit:** Live Activity for the Dynamic Island and lock screen
- **AlarmKit:** alarms that ring through Silent and Focus
- **App Intents:** Pause and Stop from the Island, Siri ("Hey Siri, pump 20 minutes")
- **CloudKit sharing:** family timers
- **String Catalogs:** Vietnamese and English, carrying over the keys in `Main.dc.html`

Before release:
- **Milk use-by times:** confirm the 2 h (room temperature) and 24 h (fridge) values against Bộ Y tế or CDC guidance. The values in the design are placeholders.
- **Accessibility:** test with Dynamic Type at the largest sizes and with VoiceOver on a device. See [docs/accessibility.md](docs/accessibility.md).
- **Usability:** test with 5–6 new moms, including one-handed use at night.
