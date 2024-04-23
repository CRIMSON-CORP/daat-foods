export default function orderCompletedTemplate({ user }: Order) {
    const firstName = user.full_name.split(' ')[0];
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
      <div style="position: relative">
       <div style="background-color:#f2f2f2;padding-top:75%;background-image:url('https://firebasestorage.googleapis.com/v0/b/daat-foods.appspot.com/o/app-assets%2FLoad%20up_%20Move%20out_.gif?alt=media&token=6a2daf09-72f9-47c7-bc45-7b88fb33aea1');background-size:contain;background-position:center">
       </div>
      </div>
      <div style="padding: 24px">
        <div>
          <h1 style="font-size: 32px; font-weight: bold; margin-bottom: 16px">
            Hey <b>${firstName}</b>, Your Order has been Completed!
          </h1>
          <p>
            Your order has been completed, Thank you for Shopping with DAAT FOODS!.
          </p>
        </div>
      <div style="text-align: center;
      padding-left: 20px;
      padding-top: 20px;
      padding-bottom: 20px;
      padding-right: 20px;
      background-color: rgb(234, 244, 219);
      display:block;
      margin: 0px;">
        <p>
          Thank you
        </p>
      </div>
    </div>
  </body>
</html>

        `;
}
