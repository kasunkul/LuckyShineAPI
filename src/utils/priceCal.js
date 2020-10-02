const db = require('../../models');

/**
 *
 * @param {*} cart
 * @param {*} orderId
 */

// cart arry example

// cart = [{qty:3,unitPrice:100, id:1, needIron:true}]

async function cal(cart, orderId) {
  try {
    // 1. get tax value

    let taxAmount = 0;
    const taxQ = "SELECT * FROM lavup_db.sysVars where label = 'Tax value'";
    const taxD = await db.sequelize.query(taxQ, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    taxAmount = (parseFloat(taxD[0].value) + 100) / 100;

    // 2. create array for bulk insert order items table

    const cartBulk = [];

    for (let i = 0; i < cart.length; i += 1) {
      const e = cart[i];

      for (let index = 0; index < e.qty; index += 1) {
        cartBulk.push({
          laundryOrderId: orderId,
          unitPrice: e.unitPrice,
          itemId: e.id,
          needIron: e.needIron,
          subTotal: (e.unitPrice * taxAmount).toFixed(1),
          unitsPurchased: 1,
        });
      }
      e.idx = i + 1;
    }

    // 3. set the order value and tax and order amount

    // order value
    const orderValue = parseFloat(
      cartBulk.map((e) => Number(e.subTotal)).reduce((a, b) => a + b, 0),
    ).toFixed(2);

    // tax
    const tax = parseFloat(orderValue * taxAmount - orderValue).toFixed(2);

    // total amount
    const totalOrderAmount = parseFloat(tax, 10) + parseFloat(orderValue, 10);
    console.log(
      'order value',
      orderValue,
      'tax',
      tax,
      'total',
      totalOrderAmount,
    );

    // ===============> return <===============
    const data = {
      orderValue,
      tax,
      totalOrderAmount,
      cartBulk,
    };

    return data;
  } catch (error) {
    console.warn(error);
    throw new Error();
  }
}

module.exports = { cal };
