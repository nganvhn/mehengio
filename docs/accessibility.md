# Accessibility notes

Audit of the prototype in `design/`. These are automated contrast checks and code-level checks of the flows. Testing with real users and with VoiceOver on a device is still to do; see the end of this page.

## Done in the design

- **Contrast:** every text pair meets WCAG AA (4.5:1). Control boundaries and focus rings meet 3:1.
  - Lowest text pair: porridge ink `#7E6224` on butter `#F3E6C6` (4.63:1).
  - Lowest secondary text: `#7A6A62` on cream (4.81:1).
- **Touch targets:** 44 pt or larger everywhere; most are 56–132 pt.
- **Screen reader labels:** icon-only buttons have labels in the current language. Each visible label is contained in its accessible name, so voice control works.
- **Structure:** each screen has one heading. Settings uses a proper radio group, and the family switch reports its on/off state.
- **Announcements:**
  - "Done", "Pumping done" and "Milk has expired" are announced when they appear.
  - Time changes on the Set screen are read out after each tap.
  - Countdowns use the timer role, so they're read when focused rather than every second.
- **Language:** the page language follows the setting, so VoiceOver uses the matching voice. Each language option is written in its own language.
- **Motion:** all animation stops under Reduce Motion. Progress is still shown by fill level and colour, not by motion.
- **Error prevention:**
  - Stop and Discard can be undone for 8 seconds.
  - Starting a new timer while one is running shows a warning first.
  - Expired milk can't be logged as fed.

## To verify in the native app

- **Dynamic Type:** the prototype uses fixed sizes. In SwiftUI, use text styles. At the largest accessibility sizes, switch the Home grid to one column.
- **VoiceOver on device:**
  - Walk every flow.
  - Check focus moves to the alarm screen when it appears.
  - Make the time value on the Set screen one adjustable control (swipe up or down) instead of separate − / + buttons.
- **Haptics:** use a gentle vibration pattern for alarms when the baby is asleep, and a strong one for users who are deaf or hard of hearing.
- **Dark mode:** a dimmed theme for night feeds, plus a check that the pastels hold up under Smart Invert.
