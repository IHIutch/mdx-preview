import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router'
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '~/utils/db';
import { compile, run } from '@mdx-js/mdx';
import remarkSmartypants from 'remark-smartypants';
import remarkGfm from 'remark-gfm';
import * as runtime from 'react/jsx-runtime';
import { renderToStaticMarkup } from 'react-dom/server';

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
})

function RouteComponent() {
  const [error, setError] = React.useState<string | null>(null);
  const [renderedContent, setRenderedContent] = React.useState<string | null>(null);

  const { publicId } = Route.useParams()
  const post = useLiveQuery(() => db.posts.where('publicId').equals(publicId).first());

  const compileMarkdown = React.useCallback(async () => {
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
      }} />))

    } catch (err) {
      console.error('Failed to compile MDX:', err);
      setError(err instanceof Error ? err.message : 'Failed to compile MDX');
    }
  }, [post?.content]);

  React.useEffect(() => {
    compileMarkdown();
  }, [compileMarkdown]);

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