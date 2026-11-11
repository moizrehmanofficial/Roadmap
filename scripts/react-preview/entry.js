/**
 * Runtime for ```jsx preview blocks in lessons.
 * Bundles React, ReactDOM and the sucrase JSX compiler into public/vendor/react-preview.js.
 * The lesson page puts the example code in <script type="text/jsx"> inside a sandboxed iframe;
 * this file compiles it, runs it, and renders its default export into #root.
 *
 * Rebuild after upgrading react, react-dom or sucrase:
 *   npx esbuild scripts/react-preview/entry.js --bundle --minify --format=iife \
 *     --define:process.env.NODE_ENV='"production"' --outfile=public/vendor/react-preview.js
 */
import * as React from "react";
import * as ReactDOMClient from "react-dom/client";
import * as JSXRuntime from "react/jsx-runtime";
import { transform } from "sucrase";

const MODULES = {
  react: React,
  "react-dom/client": ReactDOMClient,
  "react/jsx-runtime": JSXRuntime,
  "react/jsx-dev-runtime": JSXRuntime,
};

function showError(error) {
  let box = document.getElementById("preview-error");
  if (!box) {
    box = document.createElement("pre");
    box.id = "preview-error";
    box.style.cssText =
      "margin:12px 0 0;padding:10px 12px;border-radius:8px;background:#fef2f2;color:#991b1b;" +
      "font:13px/1.5 ui-monospace,monospace;white-space:pre-wrap";
    document.body.appendChild(box);
  }
  const text = error && error.name ? error.name + ": " + error.message : String(error);
  box.textContent = box.textContent ? box.textContent + "\n" + text : text;
}

window.addEventListener("error", (e) => showError(e.error || e.message));
window.addEventListener("unhandledrejection", (e) => showError(e.reason));

function run(source) {
  let code;
  try {
    code = transform(source, {
      transforms: ["jsx", "typescript", "imports"],
      jsxRuntime: "automatic",
      production: true,
    }).code;
  } catch (error) {
    showError(error);
    return;
  }
  const module = { exports: {} };
  const require = (name) => {
    if (name in MODULES) return MODULES[name];
    throw new Error('Only "react" can be imported in these examples (tried "' + name + '").');
  };
  try {
    new Function("require", "module", "exports", code)(require, module, module.exports);
  } catch (error) {
    showError(error);
    return;
  }
  const App = module.exports.default;
  if (typeof App === "function") {
    const root = ReactDOMClient.createRoot(document.getElementById("root"), {
      onUncaughtError: (error) => showError(error),
    });
    root.render(React.createElement(App));
  }
}

document.querySelectorAll('script[type="text/jsx"]').forEach((s) => run(s.textContent || ""));
