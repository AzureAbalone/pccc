# Refining Content Animation

## Objective

Ensure that when switching between report tabs (e.g., 'Thoát nạn' -> 'Cháy lan'), the static header components DO NOT re-animate, but the dynamic content (CategoryTab, CitationList) DOES re-render and animate properly.

## Current State

1. **ReportView Key**: Separated. `ReportView` no longer remounts on tab change.
2. **Content Keys**: Added. `CategoryTab` and `CitationList` have keys based on `activeTab`.
3. **Animations**:
    - `animate-fade-in-up` was removed from the stats container (Step 236).
    - `animate-fade-in-up` IS present on the content wrapper (Step 245, Line 205).

## The Issue

The content wrapper `div` at line 205 has `animate-fade-in-up`.

```tsx
<div className="min-h-[300px] lg:min-h-[400px] animate-fade-in-up">
  <CategoryTab key={key} ... />
  <CitationList key={key} ... />
</div>
```

Since the wrapper itself DOES NOT have a key, it won't re-trigger the animation when props change, unless the children's unmount/mount triggers layout shifts.

To ensure the FADE IN happens efficiently on tab switch, the animation class should ideally be on the keyed elements themselves, OR we should key the wrapper.

## Proposed Improvement

Move the `animate-fade-in-up` class directly to the keyed components or add a key to the wrapper div.
Adding a key to the wrapper div is cleaner:

```tsx
<div key={activeTab} className="... animate-fade-in-up">
```

This ensures the entire content block performs the entry animation every time the tab changes.

## Plan

1. Update `ReportView.tsx` to add `key={activeTab}` to the content wrapper div.
2. This guarantees the animation triggers.
