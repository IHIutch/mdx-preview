import { Editor } from '@monaco-editor/react'
import { createFileRoute, Link, notFound, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import initialContent from 'app/utils/initial-content'
import { cx } from 'cva.config'
import * as React from 'react'
import { NotFound } from '~/components/NotFound'
import Preview from '~/components/preview'
import appCss from '~/styles/app.css?url'
import { createPost, getPost } from '~/utils/server-functions'
// const Editor = React.lazy(() => import('@monaco-editor/react').then((mod) => ({ default: mod.Editor })))

export const Route = createFileRoute('/$')({
  component: NewPreview,
  notFoundComponent: () => <NotFound />,
  head: () => ({
    links: [
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  params: {
    stringify: (params: { publicId?: string }) => {
      return {
        _splat: params.publicId,
      }
    },
    parse: ({ _splat }) => {
      const publicId = _splat?.split('/')[0] || ''
      if (publicId === '') {
        return {
          publicId: undefined,
        }
      }
      return {
        publicId,
      }
    },
  },
  loader: async ({ params }) => {
    if (!params.publicId) {
      return {
        post: null,
      }
    }

    const post = await getPost({ data: params.publicId })
    if (!post) {
      throw notFound()
    }

    return {
      post,
    }
  },
})

function NewPreview() {
  const data = Route.useLoaderData()
  const [isEditorVisible, setIsEditorVisible] = React.useState(true)
  const [markdown, setMarkdown] = React.useState(data?.post?.content || initialContent)
  const [isSaving, setIsSaving] = React.useState(false)
  const [isDirty, setIsDirty] = React.useState(false)

  const handleCreatePost = useServerFn(createPost)
  const navigate = useNavigate({
    from: '/$',
  })

  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isDirty])

  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            {/* <FileText className="h-6 w-6 text-indigo-600" /> */}
            <h1 className="text-xl font-semibold text-gray-900">
              <Link
                to="/$"
                params={{
                  publicId: '',
                }}
                reloadDocument
              >
                MDX Editor
              </Link>
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsEditorVisible(!isEditorVisible)}
              className={cx('inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer')}
            >
              {isEditorVisible
                ? (
                    <>
                      {/* <Split className="h-4 w-4 mr-2" /> */}
                      Hide Editor
                    </>
                  )
                : (
                    <>
                      {/* <Eye className="h-4 w-4 mr-2" /> */}
                      Show Editor
                    </>
                  )}
            </button>
            <button
              type="submit"
              form="editor"
              disabled={!isDirty}
              className={cx('inline-flex items-center px-3 py-2 border border-blue-500 shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer relative disabled:opacity-40 disabled:cursor-not-allowed', {
                'opacity-40': isSaving,
              })}
            >
              <span className={cx({
                invisible: isSaving,
              })}
              >
                Share
              </span>
              {isSaving
                ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="icon-[material-symbols--progress-activity] animate-spin"></span>
                    </div>
                  )
                : null}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex gap-4 h-full">
        {/* Editor */}
        {isEditorVisible
          ? (
              <div className="flex-1 w-1/2">
                <form
                  id="editor"
                  className="h-full"
                  method="POST"
                  onSubmit={async (e) => {
                    e.preventDefault()
                    if (isSaving)
                      return
                    setIsSaving(true)
                    const formData = new FormData(e.currentTarget)
                    const res = await handleCreatePost({ data: formData })
                    navigate({
                      to: '/$',
                      params: { publicId: res.publicId },
                    })
                    setIsSaving(false)
                    setIsDirty(false)
                  }}
                >
                  <input type="hidden" name="content" value={markdown} />
                  <div className="size-full border-r border-gray-300">
                    <Editor
                      className="size-full"
                      defaultLanguage="mdx"
                      defaultValue={markdown}
                      onChange={(value) => {
                        setMarkdown(value || '')
                        if (value !== data?.post?.content) {
                          setIsDirty(true)
                        }
                      }}
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
                  </div>
                </form>
              </div>
            )
          : null}
        {/* Preview */}
        <div className={cx('flex-1', [
          isEditorVisible ? 'w-1/2' : 'w-full',
        ])}
        >
          <div className="h-full border-l border-gray-300 bg-white relative">
            <Preview content={markdown} />
          </div>
        </div>
      </main>
    </div>
  )
}
