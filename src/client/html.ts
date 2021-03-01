export function html(payload: {
  title?: string;
  content: string,
  data?: object;
}) {
  return `
    <!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${payload.title ?? ""}</title>
        <link rel="stylesheet" href="./main.css">
      </head>

      <body>
        <div id="root">${payload.content}</div>
        <script type="text/javascript">
          window.initData=${
            payload.data ? JSON.stringify(payload.data) : "null"
          };
        </script>
        <script type="text/javascript" src="./index.js"></script>
      </body>
    </html>
  `;
}
