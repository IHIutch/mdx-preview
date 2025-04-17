import type { EditorProps } from '@monaco-editor/react'
import { Editor, loader } from '@monaco-editor/react'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import * as React from 'react'

if (typeof self !== 'undefined') {
  self.MonacoEnvironment = {
    getWorker(_, label) {
      if (label === 'json') {
        return new JsonWorker()
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return new CssWorker()
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return new HtmlWorker()
      }
      if (label === 'typescript' || label === 'javascript') {
        return new TsWorker()
      }
      return new EditorWorker()
    },
  }
}

export default function MonacoEditor({
  defaultValue,
  onChange,
}: EditorProps) {
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    async function initMonaco() {
      const monaco = await import('monaco-editor')
      loader.config({ monaco })
      await loader.init()
      setReady(true)
    }

    initMonaco()
  }, [])

  if (!ready)
    return null
  return (
    <Editor
      className="size-full"
      defaultLanguage="mdx"
      defaultValue={defaultValue}
      onChange={onChange}
      loading={null}
      options={{
        minimap: {
          enabled: false,
        },
        fontSize: 14,
        lineHeight: 1.6,
        contextmenu: false,
      }}
    />
  )
}
