import prisma from '../prisma.js';

export const createCustomer = async (data) => {
  const customer = await prisma.customers.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      zip_code: data.zip_code
    }
  });
  return customer;
};

export const getAllCustomers = async () => {
  return await prisma.customers.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      city: true,
      created_at: true
    }
  });
};

export const getCustomerById = async (id) => {
  return await prisma.customers.findUnique({
    where: { id },
    include: {
      orders: {
        select: {
          id: true,
          status: true,
          total_amount: true,
          created_at: true
        }
      }
    }
  });
};

export const updateCustomer = async (id, data) => {
  return await prisma.customers.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      zip_code: data.zip_code
    }
  });
};

export const deleteCustomer = async (id) => {
  return await prisma.customers.delete({
    where: { id }
  });
};