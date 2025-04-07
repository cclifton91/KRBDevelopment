# CliftonCreative Starter: Tailwind-Pages-Alpine

A custom Astro starter template featuring Tailwind CSS for styling, Alpine.js for interactive components, and Pages CMS for content management.
`npm create astro@latest -- --template basics`

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

`
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── ... (Alpine.js enhanced components)
│   ├── layouts/
│   │   └── Layout.astro (with Tailwind styling)
│   ├── pages/
│   │   └── index.astro
│   ├── content/
│   │   └── posts.astro
│   ├── data/
│   │   └── ... (Using Pages CMS)
│   └── styles/
│       └── tailwind.css
├── astro.config.mjs (configured with Tailwind and Alpine integrations)
├── tailwind.config.cjs
└── package.json
`

## 📦 Integrated Technologies

This starter kit combines several powerful technologies:
**Astro**

The core framework for building fast, content-focused websites

**Tailwind CSS**

Utility-first CSS framework for rapid styling

**Alpine.js**

Lightweight JavaScript framework for adding interactivity

**Pages CMS**

Content management system for managing website content

**Astro Icons**
Turn any SVG into a simple, usable icon

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

|      Command          |Description
|----------------|------------------|
|`npm install`   | Installs Dependencies
|`npm run dev`   |Starts local dev server at `localhost:4321`
|`npm run build`   |Builds your production site to ./dist/
|`npm run preview`   |Preview your build locally before deploying
|`npm run astro`   |Installs Dependencies

## 🔍 How It Works

-**Layouts**: The `Layout.astro` file includes Tailwind CSS setup and Alpine.js initialization
-**Components**: Create interactive components using Alpine.js directives (`x-data`, `x-bind`, etc.)
-**Content**: Manage your content through Pages CMS with structured content types. Set it up using the `pages.yml` file. The `src/data` folder holds basic settings that can be accessed through Pages. Astro Content collections can also be accessed through Pages.

-**Styling**: Use Tailwind utility classes for consistent, responsive design