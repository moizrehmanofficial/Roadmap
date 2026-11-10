import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode, { type Options as PrettyOptions } from "rehype-pretty-code";
import type { ShikiTransformer } from "shiki";
import { mdxComponents } from "@/components/mdx";
import { visit } from "unist-util-visit";
import type { Root, Element, ElementContent, Text } from "hast";

/** Puts the original source + language on <pre> so copy / run buttons can use them. */
const stashRaw: ShikiTransformer = {
  name: "devguide:stash-raw",
  pre(node) {
    node.properties["data-raw"] = this.source;
    // ```text output  → rendered as a program-output panel
    const meta = (this.options.meta as { __raw?: string } | undefined)?.__raw ?? "";
    node.properties["data-lang"] = /\boutput\b/.test(meta) ? "output" : this.options.lang;
  },
};

const prettyCode: PrettyOptions = {
  theme: { light: "github-light", dark: "github-dark-dimmed" },
  keepBackground: false,
  defaultLang: "plaintext",
  transformers: [stashRaw],
};

/**
 * Inline code like `-rw-r-----` must not break at hyphens. Wrap each
 * space-separated token in a no-wrap span so lines only break at spaces.
 * Very long tokens (URLs, hashes) are left breakable so mobile never overflows.
 */
function rehypeInlineCodeNoBreak() {
  const split = (node: Text): ElementContent[] =>
    node.value.split(/(\s+)/).filter(Boolean).map((part) =>
      /^\s+$/.test(part) || part.length > 28
        ? ({ type: "text", value: part } as Text)
        : ({ type: "element", tagName: "span", properties: { className: ["nobr"] }, children: [{ type: "text", value: part }] } as Element)
    );
  const walk = (el: Element) => {
    el.children = el.children.flatMap((c) => {
      if (c.type === "text") return split(c);
      if (c.type === "element") walk(c);
      return [c];
    });
  };
  return (tree: Root) => {
    visit(tree, "element", (node: Element, _i, parent) => {
      if (node.tagName !== "code") return;
      if (parent && parent.type === "element" && (parent as Element).tagName === "pre") return;
      walk(node);
    });
  };
}

export async function renderLesson(source: string) {
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCode], rehypeInlineCodeNoBreak],
      },
    },
  });
  return content;
}
