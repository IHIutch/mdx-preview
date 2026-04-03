import { compile, run } from '@mdx-js/mdx'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import * as runtime from 'react/jsx-runtime'
import remarkGfm from 'remark-gfm'
import remarkSmartypants from 'remark-smartypants'
import { AccordionItem, AccordionList } from 'src/components/mdx-components/accordion'
import { Button } from 'src/components/mdx-components/button'
import { ButtonGroup } from 'src/components/mdx-components/button-group'
import { InfoBox } from 'src/components/mdx-components/info-box'
import { ProcessItem, ProcessList } from 'src/components/mdx-components/process-list'

const components = {
  AccordionList,
  AccordionItem,
  Button,
  ButtonGroup,
  InfoBox,
  ProcessList,
  ProcessItem,
}

export async function compileMdx(markdown: string) {
  const code = await compile(markdown, {
    outputFormat: 'function-body',
    format: 'mdx',
    remarkPlugins: [remarkGfm, remarkSmartypants],
  })

  const result = await run(code, {
    ...runtime,
    baseUrl: import.meta.url,
  })

  return renderToString(createElement(result.default, { components }))
}
