import prisma from '../prisma.js';

export const createProduct = async (data) => {
  const product = await prisma.products.create({
    data: {
      sku: data.sku,
      name: data.name,
      description: data.description,
      price: data.price,
      cost_price: data.cost_price,
      active: data.active ?? true
    }
  });
  return product;
};

export const getAllProducts = async () => {
  return await prisma.products.findMany();
};

export const getProductById = async (id) => {
  return await prisma.products.findUnique({
    where: { id }
  });
};
