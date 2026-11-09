// Verifies that every lesson file belongs to the curriculum and has the required frontmatter.
// Usage: npm run check:content
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import matter from "gray-matter";

const require = createRequire(import.meta.url);
const { transform } = require("sucrase");

const root = process.cwd();
const load = (file) => {
  const code = transform(fs.readFileSync(file, "utf8"), { transforms: ["typescript", "imports"] }).code;
  const m = { exports: {} };
  new Function("module", "exports", "require", code)(m, m.exports, (id) => {
    if (id === "@/lib/slug") return load(path.join(root, "lib/slug.ts"));
    return require(id);
  });
  return m.exports;
};

const { tracks } = load(path.join(root, "content/curriculum.ts"));
const { slugify } = load(path.join(root, "lib/slug.ts"));

const expected = new Set();
const seen = new Map();
for (const t of tracks)
  for (const m of t.modules)
    for (const e of m.lessons) {
      const slug = typeof e === "string" ? slugify(e) : e[1];
      const id = `${t.slug}/${m.slug}/${slug}`;
      if (seen.has(id)) console.error(`✖ duplicate lesson id ${id}`);
      seen.set(id, true);
      expected.add(id);
    }

let errors = 0;
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? walk(path.join(dir, d.name)) : d.name.endsWith(".mdx") ? [path.join(dir, d.name)] : []
  );
const files = walk(path.join(root, "content/lessons"));
for (const f of files) {
  const id = path.relative(path.join(root, "content/lessons"), f).replace(/\\/g, "/").replace(/\.mdx$/, "");
  if (!expected.has(id)) {
    console.error(`✖ ${id}.mdx is not listed in content/curriculum.ts`);
    errors++;
  }
  const { data } = matter(fs.readFileSync(f, "utf8"));
  for (const k of ["title", "summary"]) {
    if (!data[k]) {
      console.error(`✖ ${id}: missing frontmatter "${k}"`);
      errors++;
    }
  }
}
console.log(`${files.length} published of ${expected.size} lessons in the curriculum`);
if (errors) process.exit(1);
console.log("✓ content OK");
