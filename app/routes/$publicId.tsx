import * as React from 'react'
import { createFileRoute, notFound } from '@tanstack/react-router'
import appCss from '~/styles/app.css?url'
import { createServerFn } from '@tanstack/react-start';
import { prisma } from 'app/utils/prisma';
import { compileMdx } from '~/utils/compile-mdx';

const getPost = createServerFn({ method: 'GET' })
    .validator((d: string) => d)
    .handler(async ({ data }) => {
        const post = await prisma.post.findFirst({
            where: {
                publicId: data,
            },
        });
        return post;
    })

export const sharePost = createServerFn({ method: 'POST' })
    .validator((formData: FormData) => {
        if (!(formData instanceof FormData)) {
            throw new Error('Invalid form data')
        }
        const publicId = formData.get('publicId')
        const content = formData.get('content')

        if (!content || !publicId) {

            throw new Error('Content and publicId are required')
        }
        return {
            content: content.toString(),
            publicId: publicId.toString(),
        }
    })
    .handler(async ({ data: { content, publicId } }) => {

        await prisma.post.update({
            where: { publicId },
            data: {
                content,
            }
        })

        return new Response('ok', {
            status: 301,
            headers: {
                Location: `/${publicId}`,
            }
        })
    })

export const Route = createFileRoute('/$publicId')({
    component: Component,
    head: () => ({
        links: [
            { rel: 'stylesheet', href: appCss },
        ]
    }),
    loader: async ({ params }) => {
        const post = await getPost({ data: params.publicId || '' });
        if (!post) {
            throw notFound()
        }
        return {
            post,
        }
    },
})

function Component() {
    const data = Route.useLoaderData();
    const [isPreviewVisible, setIsPreviewVisible] = React.useState(true);
    const iframeRef = React.useRef<HTMLIFrameElement | null>(null);
    const [markdown, setMarkdown] = React.useState(data.post.content);

    const injectMdx = React.useCallback(async () => {
        const contentString = await compileMdx(markdown);

        const iframeEl = iframeRef.current;
        if (iframeEl && iframeEl.contentDocument) {
            const contentDiv = iframeEl.contentDocument.getElementById('content');
            if (contentDiv) {
                contentDiv.innerHTML = contentString || '';
            }
        }
    }, [markdown]);

    React.useEffect(() => {
        injectMdx();
    }, [injectMdx]);

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
                        <form id="editor" className="h-full" action={sharePost.url} method="POST">
                            <input type="hidden" name="publicId" value={data.post.publicId} />
                            <textarea
                                name="content"
                                defaultValue={data.post.content}
                                onChange={async (e) => {
                                    const content = (e.target as HTMLTextAreaElement).value;
                                    // if (posts?.length) {
                                    //     await dexieDb.posts.update(posts[0].id, { content });
                                    // }
                                    setMarkdown(content);
                                }}
                                className="w-full h-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white font-mono text-sm resize-none"
                                placeholder="Write your MDX here..."
                            />
                        </form>
                    </div>
                    {/* Preview */}
                    <div className="flex-1 w-1/2">
                        <div className="h-full overflow-auto border border-gray-300 rounded-lg bg-white relative">
                            <iframe
                                ref={iframeRef}
                                onLoad={injectMdx}
                                srcDoc={`
                                        <!DOCTYPE html>
                                        <html lang="en">
                                        <head>
                                            <meta charset="UTF-8">
                                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                            <title>MDX Preview</title>
                                            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/uswds/3.11.0/css/uswds.min.css" integrity="sha512-Hc40xGRxbM2Ihz8tDtmRmhHtAzGzlpaHIwOniSb8ClzBIe5mTrW5EEG552LBrp1gELfd+iXJzAtGEUGEvs77NA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
                                        </head>
                                        <body class="max-w-none">
                                            <div id="content" class="padding-4 usa-prose"></div>
                                        </body>
                                        </html>
                                    `}
                                title="MDX Preview"
                                className="w-full h-full border-none"
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
