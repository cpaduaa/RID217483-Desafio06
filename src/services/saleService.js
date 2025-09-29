import prisma from '../prisma.js';
import { updateStock } from './stockService.js';

export const createSale = async (orderId, customerId, paymentMethod) => {

  const order = await prisma.orders.findUnique({
    where: { id: orderId },
    include: { order_items: true }
  });

  if (!order) throw new Error('Order not found');


  for (const item of order.order_items) {
    await updateStock(item.product_id, item.quantity);
  }

  
  const sale = await prisma.sales.create({
    data: {
      order_id: orderId,
      customer_id: customerId,
      payment_method: paymentMethod,
      amount: order.total_amount,
      status: 'paid',
      paid_at: new Date(),
      sale_items: {
        create: order.order_items.map(item => ({
          product_id: item.product_id,
          unit_price: item.unit_price,
          quantity: item.quantity,
          subtotal: item.subtotal
        }))
      }
    },
    include: { sale_items: true }
  });

  await prisma.orders.update({
    where: { id: orderId },
    data: { status: 'confirmed' }
  });

  return sale;
};

export const getSales = async () => {
  return await prisma.sales.findMany({
    include: { sale_items: true }
  });
};
