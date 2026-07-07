---
name: Kawaii Shiritori
colors:
  surface: "#fdf7ff"
  surface-dim: "#e0d5f6"
  surface-bright: "#fdf7ff"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f8f1ff"
  surface-container: "#f3eaff"
  surface-container-high: "#eee4ff"
  surface-container-highest: "#e9ddff"
  on-surface: "#1e1830"
  on-surface-variant: "#544246"
  inverse-surface: "#332c46"
  inverse-on-surface: "#f6eeff"
  outline: "#867276"
  outline-variant: "#d9c0c5"
  surface-tint: "#98415e"
  primary: "#98415e"
  on-primary: "#ffffff"
  primary-container: "#ff94b4"
  on-primary-container: "#7a2846"
  inverse-primary: "#ffb1c6"
  secondary: "#006b5a"
  on-secondary: "#ffffff"
  secondary-container: "#92f5dc"
  on-secondary-container: "#007260"
  tertiary: "#735c00"
  on-tertiary: "#ffffff"
  tertiary-container: "#d4b142"
  on-tertiary-container: "#564400"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#ffd9e1"
  primary-fixed-dim: "#ffb1c6"
  on-primary-fixed: "#3f001b"
  on-primary-fixed-variant: "#7b2947"
  secondary-fixed: "#92f5dc"
  secondary-fixed-dim: "#76d8c0"
  on-secondary-fixed: "#00201a"
  on-secondary-fixed-variant: "#005143"
  tertiary-fixed: "#ffe088"
  tertiary-fixed-dim: "#e7c353"
  on-tertiary-fixed: "#241a00"
  on-tertiary-fixed-variant: "#574500"
  background: "#fdf7ff"
  on-background: "#1e1830"
  surface-variant: "#e9ddff"
typography:
  display-game:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: "800"
    lineHeight: "1.2"
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: "700"
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: "700"
    lineHeight: 32px
  body-lg:
    fontFamily: Quicksand
    fontSize: 20px
    fontWeight: "500"
    lineHeight: 28px
  body-md:
    fontFamily: Quicksand
    fontSize: 16px
    fontWeight: "500"
    lineHeight: 24px
  label-caps:
    fontFamily: Quicksand
    fontSize: 12px
    fontWeight: "700"
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  container-margin: 24px
  bubble-padding: 16px
  gutter: 16px
---

## Brand & Style

The brand personality is high-energy, welcoming, and "kawaii." It targets language learners and casual gamers who appreciate a soft, friendly Japanese aesthetic. The emotional response should be one of safety and playfulness, reducing the friction of learning a language through a game-first approach.

The design style is **Modern Kawaii**, a blend of **Minimalism** and **Tactile** design. It uses generous whitespace to keep Japanese characters legible, paired with "squishy," pill-shaped UI elements that feel physical and interactive. Surfaces are soft and inviting, avoiding sharp edges or aggressive transitions to maintain a gentle atmosphere.

## Colors

The palette is rooted in a "Sakura & Mint" concept.

- **Primary (Sakura Pink):** Used for the active player’s speech bubbles and primary actions. It evokes warmth and energy.
- **Secondary (Mint Green):** Used for "Correct" states and word history. It provides a refreshing contrast to the pink.
- **Tertiary (Sunshine Yellow):** Used for rewards, streaks, and highlighting the "last syllable" in the word chain.
- **Neutral (Deep Slate):** Used for text to ensure high-contrast readability against pastel backgrounds.

Backgrounds should use very faint washes of the primary and secondary colors (e.g., #FFF5F7) to maintain the soft aesthetic without sacrificing legibility.

## Typography

The typography strategy prioritizes friendliness and character clarity. **Plus Jakarta Sans** provides a modern, geometric foundation for headlines that feels optimistic. **Quicksand** is used for all functional and body text; its rounded terminals perfectly mirror the "kawaii" visual language.

For Japanese characters (Kanji/Kana), ensure the fallback font is a rounded Gothic style (like Zen Maru Gothic) to maintain the soft aesthetic. Use `display-game` for the current word being played to ensure maximum impact and legibility.

## Layout & Spacing

This design system utilizes a **Fluid Grid** with generous safe areas. The layout is centered around a vertical "Game Feed" where speech bubbles stack.

- **Mobile:** A single-column layout with 24px side margins. Elements are large and touch-friendly.
- **Desktop/Tablet:** The layout remains centered but expands the margins, using sidebars for 'History' and 'Rules' to keep the central play area focused.

Spacing follows an 8px rhythmic scale. Use larger-than-normal padding inside containers to emphasize the "bubbly" and "cushioned" feel of the interface.

## Elevation & Depth

Hierarchy is achieved through **Tonal Layers** and **Ambient Shadows**. Instead of harsh, black shadows, this system uses "Color-Tinted Soft Shadows."

- **Level 1 (Base):** Flat, soft-colored background.
- **Level 2 (Cards/Bubbles):** White or pale pastel surfaces with a 10% opacity shadow tinted with the primary or secondary color.
- **Level 3 (Buttons/Active Bubbles):** A slightly deeper shadow (20% opacity) and a subtle 2px bottom-border "offset" to make the element look like a physical, pressable button.

Avoid using blur-only shadows; always include a slight Y-axis offset to reinforce the tactile, "toy-like" nature of the game.

## Shapes

The shape language is strictly **Pill-shaped**. There are no sharp corners in this design system.

- All standard buttons, input fields, and chips must use the maximum corner radius (pill).
- Game speech bubbles should use a large radius (rounded-xl) with a small "tail" at the bottom to indicate the speaker.
- Avatars are always circular with a thick, soft-colored stroke.

## Components

### Buttons

Primary buttons are pill-shaped, using the Primary color with a 2px "darker" bottom border to create a 3D effect. On press, the button should translate 2px down to simulate being squished.

### Bubbly Speech Bubbles

The core component of the word chain. Bubbles alternate sides based on the player. Use white backgrounds for the opponent and Primary-light for the user. Highlight the final character of the word in a bold, Tertiary-colored circle at the end of the bubble.

### Character Avatars

Circular frames featuring simplified animal illustrations (neko, inu, etc.). When it is a player's turn, their avatar should have a "pulsing" Primary-color glow effect.

### Chips & Tags

Used for 'History' and 'Rules'. These should be small, pill-shaped elements with Secondary-color backgrounds and Neutral-dark text.

### Inputs

The word entry field should be large, white, and pill-shaped with a 2px stroke in the Primary color. The placeholder text should be a friendly prompt like "Type a word..."

### History Feed

A vertical list of previous words, connected by a dotted line to visualize the "chain" aspect of the game.
