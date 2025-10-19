import prisma from '../prisma.js';

export const createOrder = async (customerId, items, shippingAddress) => {
  // Validar se o cliente existe
  const customer = await prisma.customers.findUnique({
    where: { id: customerId }
  });
  
  if (!customer) {
    throw new Error('Cliente não encontrado');
  }
  
  // Validar se todos os produtos existem e estão ativos
  for (const item of items) {
    const product = await prisma.products.findUnique({
      where: { id: item.product_id }
    });
    
    if (!product) {
      throw new Error(`Produto ${item.product_id} não encontrado`);
    }
    
    if (!product.active) {
      throw new Error(`Produto ${product.name} não está ativo`);
    }
    
    // Verificar estoque
    const stock = await prisma.stock.findUnique({
      where: { product_id: item.product_id }
    });
    
    if (!stock || stock.quantity < item.quantity) {
      throw new Error(`Estoque insuficiente para o produto ${product.name}`);
    }
  }
  
  let totalAmount = 0;
  items.forEach(item => {
    totalAmount += item.unit_price * item.quantity;
  });

  const order = await prisma.orders.create({
    data: {
      customer_id: customerId,
      status: 'pending',
      total_amount: totalAmount,
      shipping_address: JSON.stringify(shippingAddress), // Converter objeto para JSON string
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

  return {
    ...order,
    shipping_address: JSON.parse(order.shipping_address) // Retornar como objeto
  };
};

export const getOrders = async () => {
  return await prisma.orders.findMany({
    include: { order_items: true }
  });
};
