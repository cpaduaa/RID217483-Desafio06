import * as orderService from '../services/orderService.js';

export const createOrderController = async (req, res) => {
  try {
    const { customer_id, items, shipping_address } = req.body;
    const order = await orderService.createOrder(customer_id, items, shipping_address);
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderService.getOrders();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
};
