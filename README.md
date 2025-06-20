# 🃏 Custom Decks for Figma

**Design custom card decks. Fast, simple, right inside Figma.**

Create, customize, and insert playing card decks directly into your Figma files.  
Whether you're using predefined decks or designing your own from scratch, this plugin gives you full control through a simple, intuitive UI.

- ⚡ Import/export decks as JSON
- 🎨 Customize colors, titles, and card values
- 🧩 Add, remove, and edit cards easily
- 🔄 Live preview and updates

Perfect for design games, card-based UI concepts, teaching tools, or prototyping.

👉 Try it on Figma:  
https://www.figma.com/community/widget/1517891692674372146

---

## 🧱 Project structure

This repo is a widget + React iframe template. Code is split as follows:

| Path                  | Description                   |
| --------------------- | ----------------------------- |
| `ui-src/`             | React iframe (deck editor UI) |
| `ui-src/index.html`   | Iframe entry point            |
| `widget-src/`         | Main Figma widget logic       |
| `widget-src/code.tsx` | Widget entry point            |
| `dist/`               | Output directory after build  |

- `widget-src` is bundled with **esbuild**
- `ui-src` is bundled with **Vite 6 + React + Tailwind**

---

## 🚀 Getting Started

### One-time setup

1. Copy this repo
2. Update `manifest.json`, `package.json`, and `package-lock.json` (search for `WidgetTemplate`)
3. Install dependencies:
   ```bash
   npm ci
   ```

### Build and import

1. Run a build:
   ```bash
   npm run build
   ```
2. In Figma → Plugins → "Import widget from manifest"
3. Select your `manifest.json`

---

## 💻 Development workflow

Use the following command during dev to auto-build everything:

```bash
npm run dev
```

This does:

- ✅ Typechecking (`tsc --noEmit`) for both `widget-src` and `ui-src`
- 🔁 Bundling both widget and iframe in watch mode
- 🌐 Starts a Vite dev server at `http://localhost:3000`

---

## 📦 Other scripts

| Script                     | Description                      |
| -------------------------- | -------------------------------- |
| `npm run build`            | Full dev build (widget + iframe) |
| `npm run build:production` | Full prod build (minified)       |
| `npm run build:main`       | Build widget code only           |
| `npm run build:ui`         | Build iframe code only           |
| `npm run tsc`              | Typecheck both sides             |

---

## 🐞 Issues / Feedback

For help with Figma widgets: https://www.figma.com/widget-docs

Found a bug or have a question?  
→ https://www.figma.com/widget-docs/get-help/
