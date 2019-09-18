import * as React from 'react';
import serialize from 'serialize-javascript';
import { DocumentProps } from './types';

// interface DocumentType extends React.StatelessComponent<DocumentProps> {
//   getInitialProps: (props: DocumentProps) => Promise<any>
// }

export const Document: any = ({
  helmet,
  assets,
  data
}: DocumentProps) => {
  const htmlAttrs = helmet.htmlAttributes.toComponent();
  const bodyAttrs = helmet.bodyAttributes.toComponent();

  return (
    <html {...htmlAttrs}>
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet="utf-8" />
        <title>Welcome to the Afterparty</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {helmet.title.toComponent()}
        {helmet.meta.toComponent()}
        {helmet.link.toComponent()}
        {assets.client.css && <link rel="stylesheet" href={assets.client.css} />}
      </head>
      <body {...bodyAttrs}>
        <AfterRoot />
        <AfterData data={data} />
        <script type="text/javascript" src={assets.client.js} defer crossOrigin="anonymous" />
      </body>
    </html>
  );
}

Document.getInitialProps = async ({
  assets,
  data,
  renderPage
}: DocumentProps) => {
  const page = await renderPage();

  return { assets, data, ...page };
}

export function AfterRoot() {
  return <div id="root">DO_NOT_DELETE_THIS_YOU_WILL_BREAK_YOUR_APP</div>;
}

export function AfterData({ data }: any) {
  return (
    <script
      id="server-app-state"
      type="application/json"
      dangerouslySetInnerHTML={{
        __html: serialize({ ...data })
      }}
    />
  );
}
