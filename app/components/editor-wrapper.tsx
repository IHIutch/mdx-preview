import { Editor } from '@monaco-editor/react';

export default function EditorWrapper({ value, onChange }: { value: string, onChange: (value: string) => void }) {
    return (
        <Editor
            className="size-full"
            // height="90vh"
            defaultLanguage="mdx"
            defaultValue={value}
            onChange={(value) => {
                onChange(value || '');
            }}
            loading={null}
            options={{
                minimap: {
                    enabled: false,
                },
                contextmenu: false,
            }}
        // onValidate={handleEditorValidation}
        />
    )
}
