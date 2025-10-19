import prisma from '../prisma.js';

export const createSale = async (data) => {
  const { order_id, customer_id, payment_method } = data;

  return await prisma.$transaction(async (tx) => {
    // Check if order exists and fetch items
    const order = await tx.orders.findUnique({
      where: { id: order_id },
      include: { order_items: true }
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === 'completed') {
      throw new Error('Order already completed');
    }

    // Check if a sale already exists for this order
    const existingSale = await tx.sales.findUnique({
      where: { order_id }
    });

    if (existingSale) {
      throw new Error('A sale already exists for this order');
    }

    // Check and update stock
    for (const item of order.order_items) {
      const stock = await tx.stock.findUnique({
        where: { product_id: item.product_id }
      });

      if (!stock || stock.quantity < item.quantity) {
        const product = await tx.products.findUnique({
          where: { id: item.product_id },
          select: { name: true }
        });
        throw new Error(`Insufficient stock for ${product?.name || item.product_id}`);
      }

      // Reduce stock
      await tx.stock.update({
        where: { product_id: item.product_id },
        data: { quantity: stock.quantity - item.quantity }
      });
    }

    // Create the sale
    const sale = await tx.sales.create({
      data: {
        order_id,
        customer_id,
        payment_method,
        amount: order.total_amount,
        status: 'completed',
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

    // Update order status
    await tx.orders.update({
      where: { id: order_id },
      data: { status: 'completed' }
    });

    return sale;
  });
};

export const getSales = async () => {
  return await prisma.sales.findMany({
    include: { 
      sale_items: {
        include: {
          product: {
            select: {
              name: true,
              sku: true
            }
          }
        }
      },
      order: {
        select: {
          id: true,
          status: true,
          total_amount: true,
          shipping_address: true
        }
      },
      customer: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      created_at: 'desc'
    }
  });
};

export const getSaleById = async (id) => {
  return await prisma.sales.findUnique({
    where: { id },
    include: { 
      sale_items: {
        include: {
          product: {
            select: {
              name: true,
              sku: true,
              price: true
            }
          }
        }
      },
      order: {
        select: {
          id: true,
          status: true,
          total_amount: true,
          shipping_address: true
        }
      },
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      }
    }
  });
};
