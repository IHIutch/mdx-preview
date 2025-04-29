import { Menu } from '@ark-ui/react/menu'
import { useForm, useStore } from '@tanstack/react-form'
import { createFileRoute, Link, notFound, stripSearchParams, useBlocker, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { zodValidator } from '@tanstack/zod-adapter'
import initialContent from 'app/utils/initial-content'
import { cx } from 'cva.config'
import * as React from 'react'
import { z } from 'zod'

import { NotFound } from '~/components/NotFound'
import Preview from '~/components/preview'
import { compileMdx } from '~/utils/compile-mdx'
import { createPost, getPost } from '~/utils/server-functions'

const searchSchema = z.object({
  show_navbar: z.boolean().default(false).optional(),
  show_sidebar: z.boolean().default(false).optional(),
  show_toc: z.boolean().default(false).optional(),
})

type SearchParams = z.infer<typeof searchSchema>

const MonacoEditor = React.lazy(() => import('~/components/monaco-editor').then(mod => ({
  default: mod.default,
})))

export const Route = createFileRoute('/$')({
  component: NewPreview,
  notFoundComponent: () => <NotFound />,
  validateSearch: zodValidator(searchSchema),
  shouldReload: false,
  search: {
    middlewares: [
      // Removes when false
      stripSearchParams({
        show_navbar: false,
        show_sidebar: false,
        show_toc: false,
      }),
    ],
  },
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
        initialHTML: await compileMdx(initialContent),
        post: null,
      }
    }

    const post = await getPost({ data: params.publicId })
    if (!post) {
      throw notFound()
    }

    return {
      initialHTML: await compileMdx(post.content),
      post,
    }
  },
})

function NewPreview() {
  const { post } = Route.useLoaderData()
  const {
    show_navbar: showNavbar,
    show_sidebar: showSidebar,
    show_toc: showToc,
  } = Route.useSearch()

  const [isEditorVisible, setIsEditorVisible] = React.useState(true)

  const handleCreatePost = useServerFn(createPost)
  const navigate = useNavigate({
    from: '/$',
  })

  const form = useForm({
    defaultValues: {
      markdown: post?.content || initialContent,
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData()
      formData.append('markdown', value.markdown)

      const res = await handleCreatePost({ data: formData })
      form.reset({ markdown: value.markdown })

      // Seems like we need to return this so "isSubmitting" resolves correctly
      return await navigate({
        to: '/$',
        params: { publicId: res.publicId },
        search: prev => prev,
      })
    },
  })

  const isDirty = useStore(form.store, state => state.isDirty)

  useBlocker({
    shouldBlockFn: () => isDirty,
    enableBeforeUnload: isDirty,
  })

  const handleUpdateSetting = (payload: SearchParams) => {
    navigate({
      to: '/$',
      params: prev => prev,
      search: prev => ({
        ...prev,
        ...payload,
      }),
      replace: true,
      ignoreBlocker: true,
    })
  }

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
          <div className="flex gap-6">
            <div className="flex gap-3">
              <Menu.Root
                closeOnSelect={false}
                positioning={{
                  placement: 'bottom',
                }}
              >
                <Menu.Trigger className="size-10 inline-flex items-center justify-center border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
                  <span aria-hidden className="icon-[material-symbols--settings] h-5 w-5 text-gray-600"></span>
                  <span className="sr-only">Settings</span>
                </Menu.Trigger>
                <Menu.Positioner>
                  <Menu.Content className="z-10 w-48 bg-white rounded-md shadow-lg focus:outline-none p-1 ring-1 ring-gray-200">
                    <Menu.CheckboxItem
                      className="flex rounded-sm items-center gap-2 px-2 h-10 cursor-pointer bg-white text-gray-900 [[data-highlighted]]:bg-gray-100"
                      value="show_navbar"
                      checked={Boolean(showNavbar)}
                      onCheckedChange={(value) => {
                        handleUpdateSetting({ show_navbar: value })
                      }}
                    >
                      <div className="size-6 flex items-center justify-center">
                        <Menu.ItemIndicator>✅</Menu.ItemIndicator>
                      </div>
                      <Menu.ItemText>Show Navbar</Menu.ItemText>
                    </Menu.CheckboxItem>
                    <Menu.CheckboxItem
                      className="flex rounded-sm items-center gap-2 px-2 h-10 cursor-pointer bg-white text-gray-900 [[data-highlighted]]:bg-gray-100"
                      value="show_sidebar"
                      checked={Boolean(showSidebar)}
                      onCheckedChange={(value) => {
                        handleUpdateSetting({ show_sidebar: value })
                      }}
                    >
                      <div className="size-6 flex items-center justify-center">
                        <Menu.ItemIndicator>✅</Menu.ItemIndicator>
                      </div>
                      <Menu.ItemText>Show Sidebar</Menu.ItemText>
                    </Menu.CheckboxItem>

                    <Menu.CheckboxItem
                      className="flex rounded-sm items-center gap-2 px-2 h-10 cursor-pointer bg-white text-gray-900 [[data-highlighted]]:bg-gray-100"
                      value="show_toc"
                      checked={Boolean(showToc)}
                      onCheckedChange={(value) => {
                        handleUpdateSetting({ show_toc: value })
                      }}
                    >
                      <div className="size-6 flex items-center justify-center">
                        <Menu.ItemIndicator>✅</Menu.ItemIndicator>
                      </div>
                      <Menu.ItemText>Show ToC</Menu.ItemText>
                    </Menu.CheckboxItem>
                  </Menu.Content>
                </Menu.Positioner>
              </Menu.Root>
              <button
                type="button"
                onClick={() => setIsEditorVisible(!isEditorVisible)}
                className={cx('h-10 inline-flex items-center px-3 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer')}
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
            </div>
            <form.Subscribe
              selector={state => [state.isSubmitting, state.isPristine]}
              children={([isSubmitting, isPristine]) => (
                <button
                  type="submit"
                  form="editor"
                  disabled={isPristine}
                  className={cx('h-10 inline-flex items-center px-3 border border-blue-500 shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer relative disabled:opacity-40 disabled:cursor-not-allowed', {
                    'opacity-40': isSubmitting,
                  })}
                >
                  <span className={cx({
                    invisible: isSubmitting,
                  })}
                  >
                    Share
                  </span>
                  {isSubmitting
                    ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="icon-[material-symbols--progress-activity] animate-spin"></span>
                        </div>
                      )
                    : null}
                </button>
              )}
            />
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
                  onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                  }}
                >
                  {/* <input type="hidden" name="content" value={markdown} /> */}
                  <div className="size-full border-r border-gray-300">
                    <React.Suspense fallback={(
                      <div className="h-full flex items-center justify-center">
                        <span className="icon-[material-symbols--progress-activity] animate-spin size-10 bg-gray-400"></span>
                      </div>
                    )}
                    >
                      <form.Field
                        name="markdown"
                        children={field => (
                          <MonacoEditor
                            {...field}
                            className="size-full"
                            defaultLanguage="mdx"
                            defaultValue={field.state.value}
                            onChange={(value) => {
                              field.handleChange(value || '')
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
                        )}
                      />
                    </React.Suspense>
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
            <form.Subscribe
              selector={state => state}
              children={state => (
                <Preview content={state.values.markdown} />
              )}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
