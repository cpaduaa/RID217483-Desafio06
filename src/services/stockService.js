import prisma from '../prisma.js';

export const getStockByProductId = async (productId) => {
  const stock = await prisma.stock.findUnique({
    where: { product_id: productId },
    include: {
      product: {
        select: {
          id: true,
          sku: true,
          name: true,
          active: true
        }
      }
    }
  });
  
  return stock;
};

export const createOrUpdateStock = async (productId, quantity, minQuantity = 5) => {
  // Check if product exists
  const product = await prisma.products.findUnique({
    where: { id: productId }
  });
  
  if (!product) {
    throw new Error('Product not found');
  }
  
  // Use upsert to create or update stock
  const stock = await prisma.stock.upsert({
    where: { product_id: productId },
    update: {
      quantity: quantity,
      min_quantity: minQuantity
    },
    create: {
      product_id: productId,
      quantity: quantity,
      min_quantity: minQuantity
    },
    include: {
      product: {
        select: {
          name: true,
          sku: true
        }
      }
    }
  });
  
  return stock;
};

export const adjustStock = async (productId, quantityChange, reason = '') => {
  return await prisma.$transaction(async (tx) => {
    // Get current stock
    const currentStock = await tx.stock.findUnique({
      where: { product_id: productId },
      include: {
        product: {
          select: {
            name: true,
            sku: true
          }
        }
      }
    });
    
    if (!currentStock) {
      throw new Error('Stock not found for this product');
    }
    
    const newQuantity = currentStock.quantity + quantityChange;
    
    if (newQuantity < 0) {
      throw new Error('Insufficient stock quantity');
    }
    
    // Update stock
    const updatedStock = await tx.stock.update({
      where: { product_id: productId },
      data: { quantity: newQuantity },
      include: {
        product: {
          select: {
            name: true,
            sku: true
          }
        }
      }
    });
    
    return updatedStock;
  });
};

export const getAllStocks = async () => {
  return await prisma.stock.findMany({
    include: {
      product: {
        select: {
          id: true,
          sku: true,
          name: true,
          active: true
        }
      }
    },
    orderBy: {
      updated_at: 'desc'
    }
  });
};

export const getLowStockItems = async () => {
  return await prisma.stock.findMany({
    where: {
      quantity: {
        lte: prisma.stock.fields.min_quantity
      }
    },
    include: {
      product: {
        select: {
          id: true,
          sku: true,
          name: true,
          active: true
        }
      }
    }
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
