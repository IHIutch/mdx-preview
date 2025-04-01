import * as React from 'react'
import { compileMdx } from '~/utils/compile-mdx'

export default function Preview({ content }: { content: string }) {
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
      onLoad={sendHTML}
      srcDoc={`<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>MDX Preview</title>
                        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/uswds/3.11.0/css/uswds.min.css" integrity="sha512-Hc40xGRxbM2Ihz8tDtmRmhHtAzGzlpaHIwOniSb8ClzBIe5mTrW5EEG552LBrp1gELfd+iXJzAtGEUGEvs77NA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
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
                    <body class="padding-4 usa-prose"></body>
                    </html>
                `}
      title="MDX Preview"
      className="w-full h-full border-none"
    />
  )
}
