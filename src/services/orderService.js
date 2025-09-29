import prisma from '../prisma.js';

export const createOrder = async (customerId, items, shippingAddress) => {
  let totalAmount = 0;
  items.forEach(item => {
    totalAmount += item.unit_price * item.quantity;
  });

  const order = await prisma.orders.create({
    data: {
      customer_id: customerId,
      status: 'pending',
      total_amount: totalAmount,
      shipping_address: shippingAddress,
      order_items: {
        create: items.map(item => ({
          product_id: item.product_id,
          unit_price: item.unit_price,
          quantity: item.quantity,
          subtotal: item.unit_price * item.quantity
        }))
      }
    },
    include: { order_items: true }
  });

  return order;
};

export const getOrders = async () => {
  return await prisma.orders.findMany({
    include: { order_items: true }
  });
};
