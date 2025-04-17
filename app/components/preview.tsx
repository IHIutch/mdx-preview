/* eslint-disable react-dom/no-unsafe-iframe-sandbox */
/* eslint-disable antfu/no-import-node-modules-by-path */
/* eslint-disable antfu/no-import-dist */
import * as React from 'react'

import { compileMdx } from '~/utils/compile-mdx'

import uswdsCss from '../../node_modules/@uswds/uswds/dist/css/uswds.css?url'
import uswdsJsInit from '../../node_modules/@uswds/uswds/dist/js/uswds-init.js?url'
import uswdsJs from '../../node_modules/@uswds/uswds/dist/js/uswds.js?url'

export default function Preview({ content, children }: { content: string, children?: React.ReactNode }) {
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null)

  const sendHTML = React.useCallback(async () => {
    const markupString = await compileMdx(content)
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow?.postMessage({ html: markupString }, '*')
    }
  }, [content])

  React.useEffect(() => {
    sendHTML()
  }, [sendHTML])

  return (
    <iframe
      ref={iframeRef}
      sandbox="allow-scripts allow-same-origin"
      srcDoc={`<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>MDX Preview</title>
                    <script src="${uswdsJsInit}"></script>
                    <link rel="stylesheet" href="${uswdsCss}" />
                    <script>
                        window.addEventListener('message', (e) => {
                            // console.log('Received message from parent:', e.data)
                            if (typeof e.data.html !== 'undefined') {
                                setHtml(e.data.html)
                            }
                        })
                        function setHtml(html) {
                            if (typeof html === 'undefined') {
                            document.body.innerHTML = ''
                            } else {
                            document.body.innerHTML = html
                            }   
                        }
                    </script>
                </head>
                <body class="padding-4 usa-prose">${children}</body>
                <script src="${uswdsJs}"></script>
                </html>`}
      title="MDX Preview"
      className="w-full h-full border-none"
    />
  )
}
