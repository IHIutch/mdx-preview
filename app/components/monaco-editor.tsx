import type { EditorProps } from '@monaco-editor/react'
import { Editor, loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

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

loader.config({ monaco })

export default function MonacoEditor({
  defaultValue,
  onChange,
}: EditorProps) {
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
