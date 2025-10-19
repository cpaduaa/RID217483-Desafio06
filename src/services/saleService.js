import prisma from '../prisma.js';

export const createSale = async (data) => {
  const { order_id, customer_id, payment_method } = data;

  return await prisma.$transaction(async (tx) => {
    // Verificar se o pedido existe e buscar itens
    const order = await tx.orders.findUnique({
      where: { id: order_id },
      include: { order_items: true }
    });

    if (!order) {
      throw new Error('Pedido não encontrado');
    }

    if (order.status === 'completed') {
      throw new Error('Pedido já foi finalizado');
    }

    // Verificar se já existe uma venda para este pedido
    const existingSale = await tx.sales.findUnique({
      where: { order_id }
    });

    if (existingSale) {
      throw new Error('Já existe uma venda para este pedido');
    }

    // Verificar estoque e atualizar
    for (const item of order.order_items) {
      const stock = await tx.stock.findUnique({
        where: { product_id: item.product_id }
      });

      if (!stock || stock.quantity < item.quantity) {
        const product = await tx.products.findUnique({
          where: { id: item.product_id },
          select: { name: true }
        });
        throw new Error(`Estoque insuficiente para ${product?.name || item.product_id}`);
      }

      // Reduzir estoque
      await tx.stock.update({
        where: { product_id: item.product_id },
        data: { quantity: stock.quantity - item.quantity }
      });
    }

    // Criar a venda
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

    // Atualizar status do pedido
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
