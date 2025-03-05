import React, { Fragment, useState } from 'react';
import { Split, FileText, Eye } from 'lucide-react';
import * as mdx from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import type { MDXModule } from 'mdx/types.js';
import remarkGfm from 'remark-gfm';

// Custom component example
function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center text-blue-800">
        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        {children}
      </div>
    </div>
  );
}

const components = {
  h1: (props: any) => <h1 className="text-4xl font-bold mb-4" {...props} />,
  h2: (props: any) => <h2 className="text-3xl font-semibold mb-3" {...props} />,
  h3: (props: any) => <h3 className="text-2xl font-semibold mb-2" {...props} />,
  p: (props: any) => <p className="mb-4" {...props} />,
  code: (props: any) => (
    <code className="bg-gray-100 rounded px-1" {...props} />
  ),
  pre: (props: any) => (
    <pre
      className="bg-gray-100 p-4 rounded-lg mb-4 overflow-x-auto"
      {...props}
    />
  ),
  a: (props: any) => <a className="text-blue-600 hover:underline" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside mb-4" {...props} />,
  ol: (props: any) => (
    <ol className="list-decimal list-inside mb-4" {...props} />
  ),
  li: (props: any) => <li className="mb-1" {...props} />,
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-gray-200 pl-4 italic my-4"
      {...props}
    />
  ),
  table: (props: any) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 my-4" {...props} />
    </div>
  ),
  th: (props: any) => (
    <th
      className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
      {...props}
    />
  ),
  td: (props: any) => (
    <td
      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
      {...props}
    />
  ),
  InfoBox,
};

const initialMarkdown = `# Welcome to the MDX Editor!

## Features
- Real-time preview
- MDX Component support
- GitHub Flavored Markdown
- Beautiful syntax highlighting
- Responsive design

Try editing this markdown on the left side!

### Custom Components Example
<InfoBox>
  This is a custom component rendered in MDX!
</InfoBox>

### Code Example
\`\`\`javascript
function hello() {
  console.log('Hello, MDX!');
}
\`\`\`

### Table Example
| Feature | Status |
|---------|--------|
| Preview | ✅ |
| MDX | ✅ |
| Tables | ✅ |
`;

function App() {
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [compiledJSX, setCompiledJSX] = useState<MDXModule | null>(null);
  const [error, setError] = useState<string | null>(null);

  const Content = compiledJSX ? compiledJSX.default : Fragment;

  React.useEffect(() => {
    const compileMarkdown = async () => {
      try {
        setError(null);
        const code = await mdx.compile(markdown, {
          outputFormat: 'function-body',
          remarkPlugins: [remarkGfm],
        });

        const result = await mdx.run(code, {
          ...runtime,
          baseUrl: import.meta.url,
        });

        // const code = String(compiled);
        // const scope = { ...runtime, components, React };
        // console.log({ scope });
        // const fn = new Function(
        //   ...Object.keys(scope),
        //   `return (() => { ${code} })()`
        // );
        // const Content = fn(...Object.values(scope)).default;

        setCompiledJSX(result);
      } catch (err) {
        console.error('Failed to compile MDX:', err);
        setError(err instanceof Error ? err.message : 'Failed to compile MDX');
        setCompiledJSX(null);
      }
    };

    compileMarkdown();
  }, [markdown]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-indigo-600" />
              <h1 className="text-xl font-semibold text-gray-900">
                MDX Editor
              </h1>
            </div>
            <button
              onClick={() => setIsPreviewVisible(!isPreviewVisible)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isPreviewVisible ? (
                <>
                  <Split className="h-4 w-4 mr-2" />
                  Hide Preview
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Show Preview
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6 h-[calc(100vh-12rem)]">
          {/* Editor */}
          <div className={`flex-1 ${isPreviewVisible ? 'w-1/2' : 'w-full'}`}>
            <div className="h-full">
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="w-full h-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white font-mono text-sm resize-none"
                placeholder="Write your MDX here..."
              />
            </div>
          </div>

          {/* Preview */}
          {isPreviewVisible && (
            <div className="flex-1 w-1/2">
              <div className="h-full overflow-auto border border-gray-300 rounded-lg bg-white p-8">
                <div className="prose max-w-none">
                  {error ? (
                    <div className="text-red-500 p-4 border border-red-200 rounded-lg bg-red-50">
                      <p className="font-medium">Error:</p>
                      <pre className="mt-2 text-sm whitespace-pre-wrap">
                        {error}
                      </pre>
                    </div>
                  ) : (
                    // <MDXProvider components={components}>
                    <Content components={components} />
                    // </MDXProvider>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
