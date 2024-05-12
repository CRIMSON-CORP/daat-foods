interface Params {
    name: string;
    email: string;
    message: string;
}

export default function newContactRequest({ name, email, message }: Params) {
    return `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body style="background-color: white; padding: 0px; margin: 0px">
    <div
      style="
        background-color: rgb(250, 252, 246);
        max-width: 1024px;
        margin: 0 auto;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
          Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
          sans-serif;
        line-height: 1.625;
      "
    >
      <div style="padding: 24px">
        <div>
          <h1 style="font-size: 32px; font-weight: bold; margin-bottom: 16px">
            Hey MKDAAT
          </h1>
          <p style="font-weight: 300; font-size: 18px">
           You have a contact request
          </p>
        </div>
        <div>
          <p style="font-weight: 300; font-size: 18px">
            Name: ${name}
          </p>
          <p style="font-weight: 300; font-size: 18px">
            Email: ${email}
          </p>
          <p style="font-weight: 300; font-size: 18px">
            Message: ${message}
          </p>
        </div>
      </div>
    </div>
  </body>
</html>

        `;
}
