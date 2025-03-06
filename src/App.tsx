import React, { createElement, useState } from 'react';
import { Split, FileText, Eye } from 'lucide-react';
import * as runtime from 'react/jsx-runtime';
import remarkGfm from 'remark-gfm';
import { compile, run } from '@mdx-js/mdx';
import { renderToString } from 'react-dom/server';
import remarkSmartypants from 'remark-smartypants';

// Custom component example
function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="usa-alert usa-alert--info">
      <div className="usa-alert__body">
        <h4 className="usa-alert__heading">Informative status</h4>
        <p className="usa-alert__text">
          {children}
        </p>
      </div>
    </div>
  );
}

const components = {
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
<InfoBox>This is a custom component rendered in MDX!</InfoBox>

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
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);

  const [error, setError] = useState<string | null>(null);

  const compileMarkdown = React.useCallback(async () => {
    try {
      setError(null);
      const code = await compile(markdown, {
        outputFormat: 'function-body',
        remarkPlugins: [remarkGfm, remarkSmartypants],
      });

      const result = await run(code, {
        ...runtime,
        baseUrl: import.meta.url,
      });

      const iframeEl = iframeRef.current;
      if (iframeEl && iframeEl.contentDocument) {
        const contentDiv = iframeEl.contentDocument.getElementById('content');
        if (contentDiv) {
          contentDiv.innerHTML = renderToString(createElement(result.default, { components })) || '';
        }
      }

    } catch (err) {
      console.error('Failed to compile MDX:', err);
      setError(err instanceof Error ? err.message : 'Failed to compile MDX');
    }
  }, [markdown]);

  React.useEffect(() => {
    compileMarkdown();
  }, [compileMarkdown]);

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
              <div className="h-full overflow-auto border border-gray-300 rounded-lg bg-white relative">
                    {error ? (
                      <div className="text-red-500 p-4 border border-red-200 rounded-lg bg-red-50 top-4 inset-x-4 absolute z-10">
                        <p className="font-medium">Error:</p>
                        <pre className="mt-2 text-sm whitespace-pre-wrap">
                          {error}
                        </pre>
                      </div>
                    ) : null}
                    <iframe
                      ref={iframeRef}
                      onLoad={compileMarkdown}
                      srcDoc={`
                        <!DOCTYPE html>
                        <html lang="en">
                          <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>MDX Preview</title>
                            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/uswds/3.11.0/css/uswds.min.css" integrity="sha512-Hc40xGRxbM2Ihz8tDtmRmhHtAzGzlpaHIwOniSb8ClzBIe5mTrW5EEG552LBrp1gELfd+iXJzAtGEUGEvs77NA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
                          </head>
                          <body class="prose max-w-none">
                            <div id="content" class="padding-4 usa-prose"></div>
                          </body>
                        </html>
                      `}
                      title="MDX Preview"
                      className="w-full h-full border-none"
                    />
                </div>
              </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;