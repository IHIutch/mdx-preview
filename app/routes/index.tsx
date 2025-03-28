import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useLiveQuery } from 'dexie-react-hooks';
import { nanoid } from 'nanoid';
import { db } from '~/utils/db';
import initialContent from '~/utils/initial-content';
import appCss from '~/styles/app.css?url'

export const Route = createFileRoute('/')({
  component: Home,
  head: () => ({
    links: [
      { rel: 'stylesheet', href: appCss },
    ]
  })
})

function Home() {
  const [markdown, setMarkdown] = React.useState(initialContent);
  const [isPreviewVisible, setIsPreviewVisible] = React.useState(true);

  const posts = useLiveQuery(() => db.posts.toArray());

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* <FileText className="h-6 w-6 text-indigo-600" /> */}
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
                  {/* <Split className="h-4 w-4 mr-2" /> */}
                  Hide Preview
                </>
              ) : (
                <>
                  {/* <Eye className="h-4 w-4 mr-2" /> */}
                  Show Preview
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6 h-[calc(100vh-12rem)]">
          {/* Editor */}
          <div className={`flex-1 ${isPreviewVisible ? 'w-1/2' : 'w-full'}`}>
            <div className="h-full">
              <textarea
                defaultValue={markdown}
                onChange={async (e) => {
                  const content = (e.target as HTMLTextAreaElement).value;
                  if (posts?.length) {
                    await db.posts.update(posts[0].id, { content });
                  }
                }}
                className="w-full h-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white font-mono text-sm resize-none"
                placeholder="Write your MDX here..."
              />
            </div>
          </div>
          {/* Preview */}
          <div className="flex-1 w-1/2">
            <div className="h-full overflow-auto border border-gray-300 rounded-lg bg-white relative">
              <iframe className="size-full" src="./preview/eGtFmOiYOv" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
