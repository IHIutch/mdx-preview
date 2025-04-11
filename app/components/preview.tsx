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
      sandbox="allow-scripts"
      srcDoc={`<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>MDX Preview</title>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/uswds/3.12.0/js/uswds-init.min.js" integrity="sha512-bXbQXDDedg6Yq2zDO+94e2vhkI3yDQd3Qj3VyGMa958ZudBTkluWOBuB+QXTGxzuaGY3Yd88zZ7IbG5iccGNeA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/uswds/3.12.0/css/uswds.min.css" integrity="sha512-j/dmq9s2rz2O/hAlJwEHMH4oKJJi3RUC1ifemT0DEkg6sggWerBK6UCKjWM5vXHk1e5eF3tYdM205EehKQrHUg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
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
                <script src="https://cdnjs.cloudflare.com/ajax/libs/uswds/3.12.0/js/uswds.min.js" integrity="sha512-ocVArBU7tOmI1Jj6udxyvH5hlM09AIl53g2dNX0tFb7lUS+NtKWn5oCViHmaWmtAqDAhpWzk5VOAocwDIoHk8g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
                </html>`}
      title="MDX Preview"
      className="w-full h-full border-none"
    />
  )
}
