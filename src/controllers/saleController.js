import * as saleService from '../services/saleService.js';

export const createSaleController = async (req, res) => {
  try {
    const { order_id, customer_id, payment_method } = req.body;
    const sale = await saleService.createSale(order_id, customer_id, payment_method);
    res.status(201).json(sale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getSalesController = async (req, res) => {
  try {
    const sales = await saleService.getSales();
    res.json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching sales' });
  }
};
