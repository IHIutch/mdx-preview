import { compile, run } from '@mdx-js/mdx'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import * as runtime from 'react/jsx-runtime'
import remarkGfm from 'remark-gfm'
import remarkSmartypants from 'remark-smartypants'
import { AccordionItem, AccordionList } from '~/components/mdx-components/accordion'
import { Button } from '~/components/mdx-components/button'
import { ButtonGroup } from '~/components/mdx-components/button-group'
import { InfoBox } from '~/components/mdx-components/info-box'
import { ProcessItem, ProcessList } from '~/components/mdx-components/process-list'

export async function compileMdx(markdown: string) {
  try {
    const code = await compile(markdown, {
      outputFormat: 'function-body',
      remarkPlugins: [remarkGfm, remarkSmartypants],
    })

    const result = await run(code, {
      ...runtime,
      baseUrl: import.meta.url,
    })

    return renderToString(createElement(result.default, {
      components: {
        AccordionList,
        AccordionItem,
        Button,
        ButtonGroup,
        InfoBox,
        ProcessList,
        ProcessItem,
      },
    }))
  }
  catch (err) {
    console.error('Failed to compile MDX:', err)
    throw new Error(err instanceof Error ? err.message : 'Failed to compile MDX')
  }
}
