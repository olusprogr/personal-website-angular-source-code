# AI-Generated Photo Note System

Handwritten-style annotation on the hero photo that says the photo is AI-generated. Consists of a Caveat-font text label and a curved SVG arrow pointing at the image.

## Where

- **HTML:** `src/app/home/start/start.component.html`, inside `.hero-image-wrap`, after the `<img>`.
- **CSS:** `src/app/home/start/start.component.css`, classes `.ai-note`, `.ai-note-text`, `.ai-note-arrow`.
- **Font:** `Caveat` (Google Fonts), loaded in `src/index.html`.

## Structure

```html
<div class="hero-image-wrap">
  <img class="hero-image" ... />
  <div class="ai-note" aria-hidden="true">
    <span class="ai-note-text">yep, this pic is<br>AI generated</span>
    <svg class="ai-note-arrow" viewBox="0 0 200 130" ...>
      <path d="M8 122 C 50 132, 130 115, 165 45" ... />  <!-- curve -->
      <path d="M148 55 L165 45 L175 63" ... />           <!-- arrowhead -->
    </svg>
  </div>
</div>
```

`.hero-image-wrap` is `position: relative` so `.ai-note` can be positioned absolutely relative to the image.

## Coordinate system (why it's built this way)

Text and arrow are both `position: absolute` inside `.ai-note`. This decouples them so each can be positioned independently in pixels. The arrow's shape is defined in an SVG viewBox (200x130), and the arrow's on-screen size and position are set via CSS `width`, `height`, `left`, `top` on the `<svg>`.

- **Text is centered inside a 130px-wide block** with `text-align: center` so its visual midpoint is predictable at `left + 65px`.
- **Arrow's visual start** is at viewBox coordinate `(8, 122)`, so the visible start on-screen sits `~8px` right of the SVG's `left` value and near the bottom.
- **Arrow's visual end (arrowhead tip)** is at viewBox coordinate `(165, 45)`.

## Current tuned values (as of last iteration)

`.ai-note` — container placed below the image:
- `top: calc(100% + 20px)` — 20px below the image
- `left: -160px` — shifted left so the whole block sits mostly under the left side of the image, giving the arrow room to end away from the right edge
- `width: 340px`, `height: 140px`

`.ai-note-text`:
- `left: 0`, `top: 30px`
- `width: 130px`, `text-align: center`
- `font-family: 'Caveat', 'Bradley Hand', 'Segoe Print', cursive`
- `font-size: 24px`, `font-weight: 600`
- `color: #6366f1` (matches accent)
- `transform: rotate(-4deg)` for the "scribbled" feel

`.ai-note-arrow`:
- `left: 140px`, `top: -40px`
- `width: 140px`, `height: 95px`
- `opacity: 0.9`

Colors are hardcoded to `#6366f1` on the SVG strokes so the arrow stays purple regardless of `currentColor` context.

## Responsive

The note is hidden on mobile (`@media (max-width: 900px)`) because the hero layout stacks vertically there and there's no room for the annotation without breaking the composition.

## History of what was tried and why (so a future session doesn't repeat mistakes)

1. **First attempt: flex container with arrow + text side by side.** Failed because the arrow's SVG viewBox couldn't be aligned with the text's baseline reliably, and layout drifted when the SVG width changed.
2. **Reversed arrow direction (right-side placement).** User wanted text left, arrow going right and up to the image — reverted.
3. **Flatter diagonal curve.** User wanted more of a real "curve" (starts horizontal, sweeps up). Curve control points were tuned to `C 50 132, 130 115, 165 45` for that shape.
4. **Arrow was overlapping the text** because SVG width and position weren't accounting for the text block width. Fixed by giving `.ai-note-text` a fixed width and computing arrow `left` from that.
5. **Arrowhead was too short.** Lengthened to ~18–20px legs.
6. **Whole note was too tall/too close to image / arrow tip too close to image corner.** Adjusted `left: -130px → -160px` and arrow `top: -20px → -40px` in small nudges over several iterations.

## Key rules for future edits

- **Never use em-dashes (—) or en-dashes (–) anywhere on the site.** See `feedback_no_em_dashes` in the memory system. They read as AI-written and the whole point of this note (and the site rewrite) is to feel human.
- **Tune in small pixel steps.** Big jumps (like moving 50px at once) always overshoot. When the user says "a bit up" or "a bit right", change by ~20px.
- **Text-mid-alignment matters.** When repositioning the arrow, keep in mind that the arrow's visual start should look like it's coming from under the text's center, not from the right edge of the text block.
- **Arrowhead tip should NOT touch the image.** Leave visible whitespace between the tip and the image bottom-left area.
- **Don't switch the whole architecture on a nudge.** If the user asks for a small change, adjust CSS pixel values, not the HTML structure or SVG paths — unless they explicitly want a bigger change.

## If asked to move / resize the arrow

- **Move right:** increase `.ai-note-arrow` `left` in ~15–20px steps.
- **Move up:** decrease `top` in ~15–20px steps (more negative).
- **Shorter arrow:** reduce both `width` and `height` proportionally (keep the ratio ~1.5:1).
- **Longer arrowhead:** modify the arrowhead `<path>` in the SVG, adjusting the two "leg" endpoints away from the tip point `(165, 45)`.

## If asked to change the text

- Text lives in the `<span class="ai-note-text">` in the HTML. It's a hardcoded string with a `<br>` for the line break.
- The container width (130px) and the arrow's `left` are tuned to the current 2-line text. Different text may require re-tuning the arrow start position.
