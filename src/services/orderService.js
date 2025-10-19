import prisma from '../prisma.js';

export const createOrder = async (customerId, items, shippingAddress) => {
  // Validate if customer exists
  const customer = await prisma.customers.findUnique({
    where: { id: customerId }
  });
  
  if (!customer) {
    throw new Error('Customer not found');
  }
  
  // Validate if all products exist and are active
  for (const item of items) {
    const product = await prisma.products.findUnique({
      where: { id: item.product_id }
    });
    
    if (!product) {
      throw new Error(`Product ${item.product_id} not found`);
    }
    
    if (!product.active) {
      throw new Error(`Product ${product.name} is not active`);
    }
    
    // Check stock
    const stock = await prisma.stock.findUnique({
      where: { product_id: item.product_id }
    });
    
    if (!stock || stock.quantity < item.quantity) {
      throw new Error(`Insufficient stock for product ${product.name}`);
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
      shipping_address: JSON.stringify(shippingAddress), // Convert object to JSON string
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
    shipping_address: JSON.parse(order.shipping_address) // Return as object
  };
};

export const getOrders = async () => {
  return await prisma.orders.findMany({
    include: { order_items: true }
  });
};
