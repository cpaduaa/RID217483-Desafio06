import prisma from '../prisma.js';

export const getStockByProductId = async (productId) => {
  return await prisma.stock.findUnique({
    where: { product_id: productId }
  });
};

export const updateStock = async (productId, quantity) => {
  const stock = await getStockByProductId(productId);
  if (!stock) {
    throw new Error('Stock not found');
  }

  if (stock.quantity < quantity) {
    throw new Error('Insufficient stock');
  }

  return await prisma.stock.update({
    where: { product_id: productId },
    data: { quantity: stock.quantity - quantity }
  });
};
