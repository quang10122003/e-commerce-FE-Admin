# MyShop Admin Design System Specification

## Scope
- Source analyzed: `app/login`, `app/admin/*`, `components/admin/*`, `components/ui/Pagination.tsx`, `app/globals.css`
- UI surfaces covered: login, dashboard, users, categories, products, orders, payments, chat, admin shell
- Notes:
  - This spec reflects the UI that is currently implemented in the repo.
  - Size values like `min-w-245` and `max-w-420` are inferred from Tailwind v4 numeric spacing utilities (`1 unit = 0.25rem = 4px`).

## 1. Design Philosophy
- Style: modern SaaS admin dashboard, soft minimalism, flat-plus-subtle-elevation
- Visual character: clean, professional, slightly premium, corporate, data-first
- Density: medium-compact
- Tone: light only
- Surface language:
  - White primary panels on a pale blue-tinted canvas
  - Large radii
  - Very light borders
  - Low shadow depth
  - Blue as the single dominant brand/action color
- Not used:
  - Glassmorphism
  - Heavy gradients on components
  - Strong blur
  - Brutalist or high-contrast styling
  - Dark theme

## 2. Color System

### Core Tokens
- `--background`: `#f4f7fb`
- `--foreground`: `#0f172a`
- `--panel`: `#ffffff`
- `--panel-border`: `#dbe4f0`
- `--panel-muted`: `#f8fbff`
- `--primary`: `#0f4ad9`
- `--primary-soft`: `#e7efff`
- `--danger-soft`: `#ffe9e9`
- `--warning-soft`: `#fff6e4`
- `--success-soft`: `#e7f8ef`
- `--color-error`: `#dc2626`

### Functional Color Roles
- Primary action:
  - Background: `#0f4ad9`
  - Text: white
  - Hover: brightness increase (`hover:brightness-110`)
- Active navigation:
  - Background: Tailwind `blue-600`
  - Text: white
- Informational accent:
  - Soft bg: `#e7efff`
  - Text: blue 700 family
- Success:
  - Soft bg: `#e7f8ef`
  - Text: green 700 family
- Warning:
  - Soft bg: `#fff6e4`
  - Text: amber/brown 700 family
- Danger:
  - Soft bg: `#ffe9e9`
  - Text: rose/red 700 family

### Background Layers
- App background:
  - Base: `#f4f7fb`
  - Overlay 1: radial gradient at top-right using `#dce9ff`
  - Overlay 2: radial gradient at bottom-left using `#e6f7ff`
- Panels:
  - Default: solid white
  - Muted panels: very light blue-white (`#f8fbff`)
- Special login hero panel:
  - Linear gradient `145deg`, white to pale blue (`#edf4ff`)

### Text Colors
- Heading / strong text: `text-slate-900`
- Primary body text: `text-slate-700` to `text-slate-800`
- Secondary body text: `text-slate-600`
- Muted / metadata / table headers: `text-slate-500`
- Error text: `#dc2626` or `text-rose-600/700`
- Inverse text on primary surfaces: white

### Border & Divider Style
- Primary border: 1px solid light slate/blue-gray
- Default panel border token: `#dbe4f0`
- Common border utility: `border-slate-200`
- Table row dividers:
  - Head: `border-slate-200`
  - Body: `border-slate-100`

### State Colors
- Hover:
  - Primary buttons: brighten
  - Outline buttons: add very soft tinted background
  - Nav items: gray hover fill
- Active:
  - Sidebar nav = blue fill + white text
- Disabled:
  - Opacity reduced to `50%` to `70%`
  - Cursor sometimes set to `not-allowed`, not fully consistent

## 3. Typography

### Font Family
- Primary UI font: `Be Vietnam Pro`
- Monospace / technical tokens: `JetBrains Mono`

### Font Weight Scale
- 400: default body text
- 500: labels, secondary emphasis
- 600: chips, buttons, section titles
- 700: key headings, page titles, important values

### Font Size System
- `text-xs`: 12px
- `text-sm`: 14px
- `text-base`: 16px
- `text-lg`: 18px
- `text-xl`: 20px
- `text-2xl`: 24px
- `text-3xl`: 30px
- `text-4xl`: 36px

### Line Height / Letter Spacing
- Body copy follows Tailwind defaults for comfortable admin readability
- Uppercase labels use explicit tracking:
  - `0.2em` for topbar eyebrow
  - `0.24em` for sidebar brand label
- No decorative letter spacing on normal body text

### Heading Hierarchy
- H1 marketing/login hero: `text-4xl font-bold`
- H1 page header: `text-3xl font-bold`
- H1 shell/topbar title: `text-lg font-bold`
- H2 section/card title: `text-lg font-semibold`
- H3 card-level title or subheading: `text-sm` to `text-base font-semibold`
- Metric value: `text-2xl font-bold`

## 4. Spacing & Layout System

### Layout Frame
- Global admin container:
  - Max width: `max-w-420` = `1680px`
  - Min width: `min-w-245` = `980px`
  - Horizontal padding: `24px`
  - Vertical padding: `16px`
- Login container:
  - Max width: `72rem` (`max-w-6xl`)
  - Min width: `980px`
  - Centered both axes

### Grid System
- Admin shell:
  - Left sidebar fixed width: `w-72` = `288px`
  - Right content: flexible
  - Gap between columns: `20px`
- Page content:
  - Stats rows: `3` or `4` cards on desktop
  - Main sections often split into `1.4fr / 1fr`, `1.3fr / 1fr`, or `1.1fr / 0.9fr`
- Tables:
  - Wrapped in `overflow-x-auto`
  - Explicit min width used when needed

### Spacing Scale
- Base unit: `4px`
- Common gaps:
  - `gap-2`: 8px
  - `gap-3`: 12px
  - `gap-4`: 16px
  - `gap-5`: 20px
  - `gap-6`: 24px
  - `gap-7`: 28px
- Common paddings:
  - `p-1.5`: 6px
  - `p-3`: 12px
  - `p-4`: 16px
  - `p-5`: 20px
  - `px-4 py-2.5`: primary button default
  - `px-3 py-2`: field default

### Padding / Margin Rules
- Main panel padding: `20px`
- Muted inner panel padding: `16px`
- Compact list item / inline card padding: `12px`
- Page section spacing:
  - Between header and first block: `24px`
  - Between stacked blocks: `20px` to `24px`
- Table row vertical rhythm: `12px`

### Responsive Behavior
- Implemented behavior:
  - Cards collapse from 4 to 3 to 1 columns based on `md` and `xl`
  - Filter bars wrap
  - Tables become horizontally scrollable
- Important limitation:
  - `min-w-245` enforces a minimum layout width of about `980px`
  - Current UI is tablet/desktop-first, not truly mobile-optimized

## 5. Component Design System

### Button
- Shape:
  - Primary: `rounded-xl` (`12px`)
  - Secondary outline: `rounded-lg` (`8px`)
- Variants:
  - Primary solid blue
  - Neutral outline
  - Danger outline
  - Sidebar active nav button
- Primary button spec:
  - Inline-flex, centered
  - Gap between icon and label: `8px`
  - Padding: `16px x 10px`
  - Font: `14px / semibold`
  - Text: white
  - Background: primary blue
- Outline button spec:
  - Border: slate-200 or rose-200
  - Padding: `10px x 4px`
  - Font: `12px / medium`
  - Neutral text: slate-700
  - Danger text: rose-700
- States:
  - Hover primary: brightness +10%
  - Hover outline neutral: `bg-slate-100`
  - Hover outline danger: `bg-rose-50`
  - Disabled: opacity reduction; sometimes cursor not-allowed
- Shadow / blur:
  - No blur
  - No dedicated button shadow

### Card / Panel
- Primary card class: `.panel`
- Background: white
- Border: 1px solid `--panel-border`
- Radius: `16px`
- Shadow: `shadow-sm`
- Padding: `20px`
- Variants:
  - Muted panel: `16px` padding, pale background
  - Subtle card: white with light slate border
  - Item row card: compact horizontal layout with `12px` vertical rhythm

### Input / Form
- Shared control style:
  - Background: white
  - Border: `border-slate-200`
  - Radius: `12px`
  - Padding: `12px x 8px` or `16px x 10px` depending on density
  - Text size: `14px`
  - Outline removed
- Input variants:
  - Standard full-width input
  - Compact filter input (`h-10`)
  - Select with matching radius/border
  - Textarea with same border language
- Focus state:
  - Border changes to `blue-400`
  - No visible focus ring or glow
- Error state:
  - Error text shown underneath in red
  - Submit/global errors shown inside a rounded tinted alert box

### Navbar / Header
- Sidebar:
  - Sticky
  - Top offset: `16px`
  - Height: `calc(100vh - 2rem)`
  - Width: `288px`
  - White panel treatment
- Topbar:
  - Sticky
  - Same top offset: `16px`
  - White panel treatment
  - Contains eyebrow label, page title, notification icon button, account switcher/menu
- Transparency / blur:
  - None

### Table
- Typography: `text-sm`
- Header text: muted gray
- Header divider: strong light border
- Row divider: lighter border
- Important cells:
  - IDs and numeric anchors use bolder text
  - Payment refs may use monospace
- Actions:
  - Inline small outline buttons
- Empty/loading:
  - Single-row text message inside body

### Badge / Chip / Status
- Shape: fully rounded pill
- Padding: `12px x 4px`
- Font: `12px / semibold`
- Usage:
  - Status
  - Count labels
  - Small metadata callouts
- Tone system:
  - Primary
  - Success
  - Warning
  - Danger
  - Info
  - Neutral

### Dropdown
- Present component: account menu
- Position: absolute under trigger, right-aligned
- Width: `208px`
- Background: white
- Radius: `12px`
- Border: `border-slate-200`
- Padding: `6px`
- Shadow: `shadow-lg`
- Item rows:
  - `rounded-lg`
  - `px-3 py-2`
  - Neutral or danger hover tint

### Modal
- No modal pattern currently implemented
- If recreated in the same style:
  - Use panel styling, 16px radius, white surface, light border, no heavy blur

## 6. Effects & Visual Style
- Glassmorphism level: none
- Blur usage: none
- Shadow system:
  - `shadow-sm` for standard elevated containers
  - `shadow-lg` only for dropdown overlays
- Border radius scale:
  - `rounded-lg`: 8px
  - `rounded-xl`: 12px
  - `rounded-2xl`: 16px
  - `rounded-full`: chips/avatar
- Animation style:
  - Simple Tailwind `transition`
  - No spring animation
  - No motion-heavy entrance effects
  - Dropdown chevron rotates 180 degrees
- Hover effects:
  - Brightness on primary buttons
  - Light fill on outline controls
  - Sidebar item fill on hover
  - No scale transform

## 7. Interaction Patterns
- Hover behavior:
  - Always subtle, never dramatic
  - Hover should reveal interactivity through fill, brightness, or text contrast
- Click feedback:
  - Primarily color-based
  - No ripple, no compression, no bounce
- Loading states:
  - Replace button labels with text like `Dang xu ly...`
  - Replace table body with text row like `Dang tai danh sach users...`
  - Use route transition pending state for filter/pagination refresh
- Skeleton / shimmer:
  - Not implemented
- Confirmation:
  - Destructive or status-changing actions use native `window.confirm`

## 8. UX Patterns

### Navigation Flow
- Root redirects to login
- Login is a split-screen panel layout
- After auth, user enters persistent admin shell
- Sidebar is the primary navigation model
- Topbar reflects current page title and account actions

### Layout Consistency
- Common page formula:
  - `PageHeader`
  - Stats row
  - Main data surface
  - Secondary side panels or detail panels
- Every major content block is card-contained
- Dense data always lives inside a white bordered panel

### Reusability Patterns
- Reusable utility classes:
  - `.panel`
  - `.panel-muted`
  - `.chip`
  - `.field-input`
  - `.field-select`
  - `.field-textarea`
  - `.btn-primary`
  - `.btn-outline`
  - `.btn-outline-danger`
  - `.section-title`
- Reusable component families:
  - `PageHeader`
  - `StatCard`
  - `StatusBadge`
  - `Pagination`

### Accessibility Assessment
- Strengths:
  - Semantic buttons, forms, tables, headers
  - Some ARIA usage in account menu trigger/menu
  - Good text size baseline for admin UI
- Gaps:
  - Focus visibility is weak because outline is removed and only border color changes
  - Mobile access is limited by large forced minimum widths
  - Status relies heavily on color + badge tone
  - No dedicated keyboard/focus treatment for custom dropdown items beyond basic semantics

## 9. Tailwind / CSS Tokens

### CSS Variable Source of Truth
```css
:root {
  --background: #f4f7fb;
  --foreground: #0f172a;
  --panel: #ffffff;
  --panel-border: #dbe4f0;
  --panel-muted: #f8fbff;
  --primary: #0f4ad9;
  --primary-soft: #e7efff;
  --danger-soft: #ffe9e9;
  --warning-soft: #fff6e4;
  --success-soft: #e7f8ef;
  --color-error: #dc2626;
}
```

### Tailwind Token Mapping
```ts
colors: {
  background: "var(--background)",
  foreground: "var(--foreground)",
  panel: "var(--panel)",
  panelBorder: "var(--panel-border)",
  panelMuted: "var(--panel-muted)",
  primary: "var(--primary)",
  primarySoft: "var(--primary-soft)",
  error: "var(--color-error)",
}
```

### Radius Tokens
```ts
borderRadius: {
  lg: "8px",
  xl: "12px",
  "2xl": "16px",
  full: "9999px",
}
```

### Spacing Tokens
```ts
spacingBase = 4px
2 = 8px
3 = 12px
4 = 16px
5 = 20px
6 = 24px
7 = 28px
10 = 40px
11 = 44px
72 = 288px
190 = 760px
245 = 980px
420 = 1680px
```

## 10. Reusable Ruleset
- All pages must use a light canvas with a pale blue-gray base and soft radial gradient accents.
- All major content containers must sit inside white cards with 16px radius, 1px light border, and subtle shadow.
- All admin pages should follow the same structure: page header, KPI cards, primary data surface, then supporting detail panels.
- All typography must use `Be Vietnam Pro` for UI and `JetBrains Mono` only for technical identifiers or refs.
- All primary actions must use deep blue fills with white semibold text and a simple brightness hover state.
- All secondary actions must use small outline buttons with neutral or danger border/text tint.
- All text inputs, selects, and textareas must use 12px radius, white fill, light border, and blue border on focus.
- All section titles inside panels should use `18px` semibold dark text.
- All chips and badges must be pill-shaped, compact, semibold, and use soft tinted backgrounds.
- All tables must be low-noise: muted headers, light dividers, no zebra striping, compact row height.
- All sticky shell surfaces must reuse the same panel styling as content cards.
- All hover feedback must be subtle and color-based; avoid transforms, glows, or exaggerated motion.
- All destructive actions should use rose/red tinted outline styling before confirmation.
- All loading states should degrade gracefully with inline text replacement if skeletons are not implemented.
- All overlays should use white surfaces, light borders, 12px radius, and one level stronger shadow than panels.
- Use muted inner panels for grouped information blocks nested inside a parent card.
- Keep section-to-section spacing between `20px` and `24px`.
- Keep icon sizes mostly between `16px` and `20px`.
- Prefer 3-card or 4-card stat rows at desktop widths; collapse progressively below `md`.
- Do not introduce blur-based glass effects, dark theme tokens, or heavy elevation if matching this system.

## Implementation Guidance for Another AI
- Recreate the admin shell first: background, centered max-width container, sticky sidebar, sticky topbar.
- Define the shared utility classes or component primitives before page implementation.
- Build `PageHeader`, `StatCard`, `StatusBadge`, `Button`, `Input`, `Panel`, and `Table` as the design primitives.
- Preserve the UI's desktop-first bias unless explicitly asked to improve responsiveness.
- If improving the system, prioritize stronger focus states and mobile layout flexibility without changing the visual language.
