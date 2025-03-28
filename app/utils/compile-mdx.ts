import { compile, run } from "@mdx-js/mdx";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";
import * as runtime from 'react/jsx-runtime';
import { InfoBox } from "~/components/mdx-components/info-box";

export const compileMdx = async (markdown: string) => {
  try {
    const code = await compile(markdown, {
      outputFormat: 'function-body',
      remarkPlugins: [remarkGfm, remarkSmartypants],
    });

    const result = await run(code, {
      ...runtime,
      baseUrl: import.meta.url,
    });


    return renderToString(createElement(result.default, {
      components: {
        InfoBox
      },
    }));

  } catch (err) {
    console.error('Failed to compile MDX:', err);
    throw new Error(err instanceof Error ? err.message : 'Failed to compile MDX');
  }
};