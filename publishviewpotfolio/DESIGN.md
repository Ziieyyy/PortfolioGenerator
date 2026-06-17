---
name: FolioGo
colors:
  surface: '#fbf9f2'
  surface-dim: '#dbdad3'
  surface-bright: '#fbf9f2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f4ed'
  surface-container: '#efeee7'
  surface-container-high: '#e9e8e1'
  surface-container-highest: '#e4e3dc'
  on-surface: '#1b1c18'
  on-surface-variant: '#45483e'
  inverse-surface: '#30312c'
  inverse-on-surface: '#f2f1ea'
  outline: '#75786c'
  outline-variant: '#c5c8ba'
  surface-tint: '#506535'
  primary: '#506535'
  on-primary: '#ffffff'
  primary-container: '#9ab17a'
  on-primary-container: '#314418'
  inverse-primary: '#b7cf95'
  secondary: '#5a623a'
  on-secondary: '#ffffff'
  secondary-container: '#dce5b2'
  on-secondary-container: '#5e663e'
  tertiary: '#62603e'
  on-tertiary: '#ffffff'
  tertiary-container: '#afab84'
  on-tertiary-container: '#423f21'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d3ebaf'
  primary-fixed-dim: '#b7cf95'
  on-primary-fixed: '#102000'
  on-primary-fixed-variant: '#394d20'
  secondary-fixed: '#dee7b5'
  secondary-fixed-dim: '#c2cb9a'
  on-secondary-fixed: '#181e01'
  on-secondary-fixed-variant: '#424a25'
  tertiary-fixed: '#e9e4ba'
  tertiary-fixed-dim: '#cdc89f'
  on-tertiary-fixed: '#1e1c03'
  on-tertiary-fixed-variant: '#4a4829'
  background: '#fbf9f2'
  on-background: '#1b1c18'
  surface-variant: '#e4e3dc'
typography:
  display:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style
The brand personality is high-end, efficient, and professional, specifically tailored to bridge the gap between ambitious students and discerning recruiters. The visual direction is a sophisticated blend of **Corporate Modern** and **Glassmorphism**, taking heavy inspiration from the precision of developer-centric tools like Linear and the refined aesthetics of Stripe.

The design system prioritizes clarity and trust through a "less, but better" approach. It utilizes expansive whitespace to reduce cognitive load, allowing the candidate's content to remain the focal point. Subtle frosted-glass effects and precision-engineered shadows create a sense of tactile quality and digital craftsmanship.

## Colors
The color palette is grounded in an organic, "Sage & Cream" sophisticated hardware-inspired aesthetic. 

- **Primary (#9AB17A):** A muted sage green used for primary actions and brand presence. It signals growth and stability without being aggressive.
- **Secondary & Accent:** Soft, desaturated greens and beiges used for secondary buttons, subtle highlights, and category tags.
- **Background (#FBE8CE):** A warm, creamy off-white that feels more premium and less sterile than pure white, providing a comfortable reading experience.
- **Surface (#FFFFFF):** Pure white is reserved for high-level cards and containers to create clear separation from the warm background.

## Typography
The typography system uses a dual-font approach to balance technical precision with extreme legibility. **Geist** is employed for headings and UI labels to provide a modern, monospaced-influenced feel that suggests efficiency. **Inter** is used for body copy to ensure maximum readability for long-form resumes and portfolios.

Hierarchy is established through tight leading on headlines and generous line heights for body text to maintain a "breathable" editorial feel. Letter spacing is slightly tightened on larger displays to maintain a cohesive visual "block" of text.

## Layout & Spacing
This design system utilizes a **Fixed Grid** model for desktop to maintain a premium, centered focus, while transitioning to a fluid layout for mobile devices. 

- **Grid:** A 12-column grid with 24px gutters.
- **Rhythm:** An 8px linear scale is used for all padding and margins to ensure mathematical consistency.
- **Whitespace:** Emphasize vertical rhythm. Use `stack-lg` (48px) to separate major sections of a portfolio or dashboard, ensuring that recruiters can easily scan information without visual noise.

## Elevation & Depth
Depth is created through a combination of **Tonal Layering** and **Ambient Shadows**. Instead of harsh black shadows, we use low-opacity shadows tinted with the primary sage color to maintain a soft, integrated look.

- **Level 0 (Background):** #FBE8CE.
- **Level 1 (Cards):** #FFFFFF with a 1px border (#E4DFB5) and a very soft, 12px blur shadow at 5% opacity.
- **Level 2 (Glass Accents):** Semi-transparent white (80% opacity) with a 20px backdrop blur, used for sticky navigation bars and floating action menus.
- **Level 3 (Modals):** High-contrast white with a 32px diffused shadow, signaling immediate priority.

## Shapes
The shape language is defined by large, friendly, yet structured radii. A base **16px (1rem)** radius is applied to all primary cards and buttons. This significant rounding creates a "soft-tech" feel that is approachable for students while appearing polished and modern to recruiters. 

Smaller elements like input fields and tags follow a scaled-down 8px radius to maintain visual harmony without appearing too circular.

## Components
- **Buttons:** Primary buttons use the Sage Green (#9AB17A) with white Geist Medium text. They feature a subtle inner-glow to simulate a tactile, slightly raised surface.
- **Cards:** White surfaces with a 1px stroke in the Accent color (#E4DFB5). Hover states should lift the card slightly (4px translateY) and deepen the shadow.
- **Inputs:** Clean, 2px borders that transition from Accent to Primary on focus. Use Inter for input text and Geist for floating labels.
- **Chips/Badges:** Use the Secondary color (#C3CC9B) at 20% opacity with solid text of the same hue for a sophisticated "tone-on-tone" effect.
- **Glass Nav:** A top-level navigation bar with `backdrop-filter: blur(10px)` and a light bottom border to define the edge against the creamy background.
- **Progress Indicators:** Thin, elegant lines using the Primary green to show application or profile completion status.