import * as React from 'react'
import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router'
import initialContent from 'app/utils/initial-content';
import appCss from '~/styles/app.css?url'
import { useServerFn } from '@tanstack/react-start';
import Preview from '~/components/preview';
import { createPost, getPost, updatePost } from '~/utils/server-functions';
import { z } from 'zod';

export const Route = createFileRoute('/preview/$')({
  component: NewPreview,
  head: () => ({
    links: [
      { rel: 'stylesheet', href: appCss },
    ]
  }),
  params: {
    stringify: (params: { publicId?: string }) => {
      return {
        _splat: params.publicId
      }
    },
    parse: (params) => {
      if (params._splat === '') {
        return {
          publicId: undefined
        }
      }
      // Extract the publicId from the _splat parameter
      const publicId = params._splat?.split('/')[0]
      const isValid = z.string().length(10).safeParse(publicId)
      if (!isValid.success) {
        throw notFound()
      }
      return {
        publicId: isValid.data,
      }
    },
  },
  loader: async ({ params }) => {
    if (!params.publicId) {
      return {
        post: null
      };
    }

    const post = await getPost({ data: params.publicId });
    if (!post) {
      throw notFound()
    }

    return {
      post
    };
  }
})

function NewPreview() {
  const data = Route.useLoaderData()
  const [isPreviewVisible, setIsPreviewVisible] = React.useState(true);
  const [markdown, setMarkdown] = React.useState(data?.post?.content || initialContent);
  const handleCreatePost = useServerFn(createPost)
  const handleUpdatePost = useServerFn(updatePost)
  const navigate = useNavigate({
    from: '/$',
  })

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
            <button type='submit' form="editor" className='inline-flex items-center px-3 py-2 border border-blue-500 shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
              Share
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6 h-[calc(100vh-12rem)]">
          {/* Editor */}
          <div className={`flex-1 ${isPreviewVisible ? 'w-1/2' : 'w-full'}`}>
            <form id="editor" className="h-full" method="POST" onSubmit={async (e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              if (data?.post?.publicId) {
                await handleUpdatePost({ data: formData })
              }
              else {
                const res = await handleCreatePost({ data: formData })
                console.log({ res })
                navigate({
                  to: '/preview/$',
                  params: { publicId: res.publicId },
                  // viewTransition: true
                })
              }
            }}>
              {data?.post?.publicId
                ? <input type="hidden" name="publicId" value={data.post.publicId} />
                : null}

              <textarea
                name="content"
                defaultValue={markdown}
                onChange={async (e) => {
                  setMarkdown(e.target.value);
                }}
                className="w-full h-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white font-mono text-sm resize-none"
                placeholder="Write your MDX here..."
              />
            </form>
          </div>
          {/* Preview */}
          <div className="flex-1 w-1/2">
            <div className="h-full overflow-auto border border-gray-300 rounded-lg bg-white relative">
              <Preview content={markdown} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
