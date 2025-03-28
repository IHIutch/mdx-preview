import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router'
import { useLiveQuery } from 'dexie-react-hooks';
import { compile, run } from '@mdx-js/mdx';
import remarkSmartypants from 'remark-smartypants';
import remarkGfm from 'remark-gfm';
import * as runtime from 'react/jsx-runtime';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServerFn } from '@tanstack/react-start';
import { prisma } from 'app/utils/prisma';
import { dexieDb } from 'app/utils/db';

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

export const Route = createFileRoute('/preview/$publicId')({
  component: RouteComponent,
  head: () => ({
    title: 'MDX Preview',
    links: [
      {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/uswds/3.11.0/css/uswds.min.css',
        integrity: 'sha512-Hc40xGRxbM2Ihz8tDtmRmhHtAzGzlpaHIwOniSb8ClzBIe5mTrW5EEG552LBrp1gELfd+iXJzAtGEUGEvs77NA==',
        crossOrigin: 'anonymous',
        referrerPolicy: 'no-referrer'
      },
    ]
  }),
  loader: async ({ params }) => {
    return params.publicId ? await getPost({ data: params.publicId }) : null;
  },
})

function RouteComponent() {
  const [error, setError] = React.useState<string | null>(null);
  const [renderedContent, setRenderedContent] = React.useState<string | null>(null);

  const { publicId } = Route.useParams()
  const data = Route.useLoaderData();
  const post = useLiveQuery(() => dexieDb.posts.where('publicId').equals(publicId).first());

  console.log({ data })

  React.useEffect(() => {
    const compileAndRender = async () => {
      try {
        setError(null);
        const code = await compile((post?.content || ''), {
          outputFormat: 'function-body',
          remarkPlugins: [remarkGfm, remarkSmartypants],
        });

        const { default: MdxContent } = await run(code, {
          ...runtime,
          baseUrl: import.meta.url,
        });

        setRenderedContent(renderToStaticMarkup(<MdxContent components={{
          InfoBox
        }} />));
      } catch (err) {
        console.error('Failed to compile MDX:', err);
        setError(err instanceof Error ? err.message : 'Failed to compile MDX');
      }
    };

    if (post?.content) {
      compileAndRender();
    }
  }, [post?.content]);

  return (
    <div>
      {post ? (
        <div className='padding-4 usa-prose' dangerouslySetInnerHTML={{ __html: renderedContent || '' }} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

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