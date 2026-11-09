import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode, { type Options as PrettyOptions } from "rehype-pretty-code";
import type { ShikiTransformer } from "shiki";
import { mdxComponents } from "@/components/mdx";

/** Puts the original source + language on <pre> so copy / run buttons can use them. */
const stashRaw: ShikiTransformer = {
  name: "devguide:stash-raw",
  pre(node) {
    node.properties["data-raw"] = this.source;
    node.properties["data-lang"] = this.options.lang;
  },
};

const prettyCode: PrettyOptions = {
  theme: { light: "github-light", dark: "github-dark-dimmed" },
  keepBackground: false,
  defaultLang: "plaintext",
  transformers: [stashRaw],
};

export async function renderLesson(source: string) {
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCode]],
      },
    },
  });
  return content;
}
