import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { EditorView, basicSetup } from 'codemirror'
import { useEffect, useRef } from 'react'

export default function SimpleEditor({
  defaultValue,
  onChange,
}: {
  defaultValue: string
  onChange: (value: string) => void
}) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    if (!editorRef.current) return

    const view = new EditorView({
      doc: defaultValue,
      extensions: [
        basicSetup,
        markdown({ base: markdownLanguage }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current(update.state.doc.toString())
          }
        }),
        EditorView.theme({
          '&': { height: '100%', fontSize: '14px' },
          '.cm-scroller': { overflow: 'auto', fontFamily: '"Fira Code", "Fira Mono", ui-monospace, monospace' },
          '.cm-content': { lineHeight: '1.6' },
          '.cm-gutters': { backgroundColor: 'transparent', borderRight: 'none' },
        }),
      ],
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={editorRef} className="size-full overflow-auto" />
}
