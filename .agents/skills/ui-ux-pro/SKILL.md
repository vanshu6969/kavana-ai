---
name: ui-ux-pro
description: >-
  Comprehensive UI/UX design intelligence and layout standards. Use when refining user interfaces, building responsive layouts, setting up design token scales, optimizing contrast/accessibility (WCAG), or auditing UI states (loading, empty, error).
---

# UI/UX Pro: Layout, Spacing & Accessibility Standard

This skill enforces systematic UX architecture, consistent spatial scales, and accessibility compliance.

## 1. The 60-30-10 Rule
- **60% Dominant Base**: Background and canvases.
- **30% Structural**: Cards, headers, navigation bars, sidebars.
- **10% Accent**: Call-to-action buttons, active badges, highlights. Keep accents intentional.

## 2. 8pt Spatial Rhythm Scale
All margins, paddings, and layout gaps must use increments of 8 (or 4 for tight controls):
- `4px` (micro: badge padding, icon gap)
- `8px` (compact: input padding, button gap)
- `16px` (default: card padding, standard gap)
- `24px` (moderate: section gap)
- `32px` (wide: container margin)
- `48px` / `64px` (page section dividers)

## 3. UI State Completeness
Every interactive feature must account for all 5 UI states:
1. **Initial / Idle**: Clean, uncluttered default view.
2. **Loading / Processing**: Skeleton screens or subtle spinners (never blank screens).
3. **Empty**: Engaging empty-state illustrations/icons with an action button (e.g. "Create your first bot").
4. **Success**: Clear toast or inline confirmation.
5. **Error / Recovery**: Human-readable error message with an action to retry.

## 4. Mobile Responsiveness & Ergonomics
- Minimum touch target: `44px x 44px` for buttons, links, and form inputs.
- Safe area insets for mobile viewports (`env(safe-area-inset-bottom)`).
- Bento grid layouts that collapse gracefully from 3-4 columns &rarr; 2 columns &rarr; 1 column.

## 5. WCAG 2.1 AA Accessibility
- Text contrast ratio: Minimum `4.5:1` for regular text, `3:1` for large text and UI components.
- Form inputs must have linked `<label>` elements or accessible `aria-label`.
- All interactive controls must support visible keyboard focus rings (`focus-visible`).
