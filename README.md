# Logo Soup

A tiny library that makes logos look good together. No framework required.

## The Problem

Real-world logos are messy. Some have padding, some don't. Some are dense and blocky, others are thin and airy. Put them in a row and they look chaotic.

Logo Soup fixes this automatically.

## Getting Started

```bash
npm install logo-soup
```

```js
import { createLogoSoup } from "logo-soup";

const el = await createLogoSoup({
  logos: ["/logos/acme.svg", "/logos/globex.svg", "/logos/initech.svg"],
});

document.body.appendChild(el);
```

That's it! Logo Soup will analyze each logo and normalize them to look visually balanced. The returned element is a `<div>` you can append anywhere. Need an HTML string instead? Use `el.outerHTML`.

## Options

### `gap`

Space between logos. Default is `28`.

```js
const el = await createLogoSoup({ logos, gap: 24 });
```

### `baseSize`

How big the logos should be, in pixels. Default is `48`.

```js
const el = await createLogoSoup({ logos, baseSize: 64 });
```

### `densityAware` and `densityFactor`

Logo Soup measures the "visual weight" of each logo. Dense, solid logos get scaled down. Light, thin logos get scaled up. This is on by default.

- `densityAware: false` — Turn it off
- `densityFactor` — How strong the effect is (0 = off, 0.5 = default, 1 = strong)

```js
// Stronger density compensation
const el = await createLogoSoup({ logos, densityFactor: 0.8 });

// Turn it off
const el = await createLogoSoup({ logos, densityAware: false });
```

### `scaleFactor`

How to handle logos with different shapes (wide vs tall). Default is `0.5`.

Imagine you have two logos:

- Logo A: wide (200×100)
- Logo B: tall (100×200)

**scaleFactor = 0** → Same width for all logos

- Logo A: 48×24 (short)
- Logo B: 48×96 (very tall)

**scaleFactor = 1** → Same height for all logos

- Logo A: 96×48 (very wide)
- Logo B: 24×48 (narrow)

**scaleFactor = 0.5** → Balanced (default)

- Neither gets too wide nor too tall
- Looks most natural

```js
const el = await createLogoSoup({ logos, scaleFactor: 0.5 });
```

### `alignBy`

How to align logos. Default is `"bounds"`.

- `"bounds"` — Align by geometric center (bounding box)
- `"visual-center"` — Align by visual weight center (accounts for asymmetric logos)
- `"visual-center-x"` — Align by visual weight center horizontally only
- `"visual-center-y"` — Align by visual weight center vertically only

```js
const el = await createLogoSoup({ logos, alignBy: "visual-center" });
```

### `cropToContent`

When enabled, logos are cropped to their content bounds and returned as base64 images. This removes any whitespace/padding baked into the original image files. Default is `false`.

```js
const el = await createLogoSoup({ logos, cropToContent: true });
```

### `className` and `style`

Apply a CSS class or inline styles to the container `<div>`.

```js
const el = await createLogoSoup({
  logos,
  className: "logo-strip",
  style: { maxWidth: "800px" },
});
```

## Using `processLogos` Directly

For custom layouts, use `processLogos` to get the normalized data without any DOM output:

```js
import { processLogos } from "logo-soup";

const normalizedLogos = await processLogos({
  logos: ["/logo1.svg", "/logo2.svg"],
});

for (const logo of normalizedLogos) {
  console.log(logo.src, logo.normalizedWidth, logo.normalizedHeight);
}
```

Each `NormalizedLogo` includes:

- `src`, `alt` — Original source and alt text
- `originalWidth`, `originalHeight` — Original image dimensions
- `normalizedWidth`, `normalizedHeight` — Calculated display dimensions
- `aspectRatio` — Content aspect ratio
- `contentBox` — Detected content bounding box
- `pixelDensity` — Visual weight (0–1)
- `visualCenter` — Weighted center of mass with offsets
- `croppedSrc` — Base64 data URL (when `cropToContent` is enabled)

### `getVisualCenterTransform`

When using `processLogos`, you can apply visual center alignment with the `getVisualCenterTransform` helper:

```js
import { processLogos, getVisualCenterTransform } from "logo-soup";

const logos = await processLogos({ logos: sources });

for (const logo of logos) {
  const img = document.createElement("img");
  img.src = logo.src;
  img.width = logo.normalizedWidth;
  img.height = logo.normalizedHeight;
  img.style.transform = getVisualCenterTransform(logo, "visual-center") || "";
  container.appendChild(img);
}
```

## Custom Image Rendering

Use `renderImage` to control how each logo element is created:

```js
const el = await createLogoSoup({
  logos,
  renderImage: (props) => {
    const picture = document.createElement("picture");
    const img = document.createElement("img");
    img.src = props.src;
    img.alt = props.alt;
    img.width = props.width;
    img.height = props.height;
    Object.assign(img.style, props.style);
    picture.appendChild(img);
    return picture;
  },
});
```

## How It Works

1. **Content Detection** — Analyzes each logo to find its true boundaries, ignoring whitespace and padding
2. **Aspect Ratio Normalization** — Scales logos based on their shape using the `scaleFactor`
3. **Density Compensation** — Measures pixel density and adjusts size so dense logos don't overpower light ones

All processing happens client-side using canvas. No AI, fully deterministic.

## Development

```bash
bun install
bun test
bun run build
```

## License

MIT
