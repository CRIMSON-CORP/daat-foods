interface Params {
    full_name: string;
    created_at: string;
    order_id: string;
    cart: CartItem[];
    transaction_reference: string;
    address: string;
    email: string;
    phone_number: string;
    total: number;
}

export default function newOrderTemplate({
    user,
    created_at,
    id,
    cart,
    transaction_reference,
    total,
}: Order) {
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
            Hey MKDAAT
          </h1>
          <p style="font-weight: 300; font-size: 18px">
           You have a new Order
          </p>
        </div>
        <div>
          <h2>Order summary</h2>
          <table style="width: 100%">
            <tbody>
            ${cart.map(
                ({ image, name, quantity, sub_total }) => `
                <tr>
                <td>
                  <img
                    src="${image}"
                    alt="${name}"
                    style="width: 80px; border-radius: 10px"
                  />
                </td>
                <td>${quantity} X ${name}</td>
                <td style="white-space: nowrap">₦${sub_total}</td>
              </tr>
                `,
            )}
            <tr style="border-top: 1px solid black">
            <td colspan="2"><b>Total</b></td>
            <td><b>₦${total}</b></td>
          </tr>
            </tbody>
          </table>
        </div>
        <div>
          <h2>Order Details</h2>
          <table style="width: 100%">
            <tbody>
              <tr>
                <td>Order Id</td>
                <td><b>${id}</b></td>
              </tr>
              <tr>
                <td>Date</td>
                <td><b>${new Date(Number(created_at)).toDateString()}</b></td>
              </tr>
              <tr>
                <td>payment Method</td>
                <td><b>Card</b></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <h2>Shipping Details</h2>
          <table style="width: 100%">
            <tbody>
              <tr>
                <td>Name</td>
                <td><b>${user.full_name}</b></td>
              </tr>
              <tr>
                <td>Address</td>
                <td><b>${user.address}</b></td>
              </tr>
              <tr style="border-top: 1px solid black">
                <td>Email</td>
                <td><b>${user.email}</b></td>
              </tr>
              <tr style="border-top: 1px solid black">
                <td>Phone number</td>
                <td><b>${user.phone_number}</b></td>
              </tr>
              <tr style="border-top: 1px solid black">
                <td>Transaction Reference</td>
                <td><b>${transaction_reference}</b></td>
              </tr>
            </tbody>
          </table>
        </div>
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
