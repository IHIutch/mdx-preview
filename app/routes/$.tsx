import * as React from 'react'
import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router'
import initialContent from 'app/utils/initial-content';
import appCss from '~/styles/app.css?url'
import { useServerFn } from '@tanstack/react-start';
import Preview from '~/components/preview';
import { createPost, getPost, updatePost } from '~/utils/server-functions';
import { z } from 'zod';
import { Editor } from '@monaco-editor/react';
import { cx } from "cva.config"
// const Editor = React.lazy(() => import('@monaco-editor/react').then((mod) => ({ default: mod.Editor })))

export const Route = createFileRoute('/$')({
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
    parse: ({ _splat }) => {
      if (_splat === '') {
        return {
          publicId: undefined
        }
      }
      // Extract the publicId from the _splat parameter
      const publicId = _splat?.split('/')[0]
      const isValid = z.string().length(10).safeParse(publicId)
      if (!isValid.success) {
        throw notFound()
      } else {

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
  const [isSaving, setIsSaving] = React.useState(false);
  const handleCreatePost = useServerFn(createPost)
  const handleUpdatePost = useServerFn(updatePost)
  const navigate = useNavigate({
    from: '/$',
  })

  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            {/* <FileText className="h-6 w-6 text-indigo-600" /> */}
            <h1 className="text-xl font-semibold text-gray-900">
              MDX Editor
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsPreviewVisible(!isPreviewVisible)}
              className={cx("inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer", {
                'bg-gray-100': isSaving,
              })}
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
            <button
              type='submit'
              form="editor"
              className={cx('inline-flex items-center px-3 py-2 border border-blue-500 shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer relative', {
                "opacity-40": isSaving,
              })}
            >
              <span className={cx({
                "invisible": isSaving,
              })}>Share</span>
              {isSaving ? <div className='absolute inset-0 flex items-center justify-center'>
                <span className="icon-[material-symbols--progress-activity] animate-spin"></span>
              </div> : null}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex gap-6 h-full">
        {/* Editor */}
        <div className={`flex-1 ${isPreviewVisible ? 'w-1/2' : 'w-full'}`}>
          <form id="editor" className="h-full" method="POST" onSubmit={async (e) => {
            e.preventDefault()
            if (isSaving) return
            setIsSaving(true)
            const formData = new FormData(e.currentTarget)
            if (data?.post?.publicId) {
              await handleUpdatePost({ data: formData })
            }
            else {
              const res = await handleCreatePost({ data: formData })
              navigate({
                to: '/$',
                params: { publicId: res.publicId },
              })
            }
            setIsSaving(false)
          }}>
            {data?.post?.publicId
              ? <input type="hidden" name="publicId" value={data.post.publicId} />
              : null}

            <input type="hidden" name="content" value={markdown} />
            <div className="size-full border-r border-gray-300">
              <Editor
                className="size-full"
                defaultLanguage="mdx"
                defaultValue={markdown}
                onChange={(value) => {
                  setMarkdown(value || '');
                }}
                loading={null}
                options={{
                  minimap: {
                    enabled: false,
                  },
                  contextmenu: false,
                }}
              />
            </div>
          </form>
        </div>
        {/* Preview */}
        <div className="flex-1 w-1/2">
          <div className="h-full border-l border-gray-300 bg-white relative">
            <Preview content={markdown} />
          </div>
        </div>
      </main>
    </div>
  );
}
