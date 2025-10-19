import * as saleService from '../services/saleService.js';

export const createSaleController = async (req, res) => {
  try {
    const { order_id, customer_id, payment_method } = req.body;
    
    // Required validations
    if (!order_id || !customer_id || !payment_method) {
      return res.status(400).json({ 
        error: 'Required fields: order_id, customer_id, payment_method' 
      });
    }
    
    // Validate types
    if (typeof order_id !== 'number' || order_id <= 0) {
      return res.status(400).json({ error: 'order_id must be a valid number' });
    }
    
    if (typeof customer_id !== 'number' || customer_id <= 0) {
      return res.status(400).json({ error: 'customer_id must be a valid number' });
    }
    
    if (typeof payment_method !== 'string' || payment_method.trim().length === 0) {
      return res.status(400).json({ error: 'Payment method must be a valid text' });
    }
    
    const sale = await saleService.createSale({
      order_id,
      customer_id,
      payment_method: payment_method.trim()
    });
    
    res.status(201).json(sale);
  } catch (error) {
    console.error(error);
    if (error.message.includes('not found') || 
        error.message.includes('already completed') ||
        error.message.includes('sale already exists') ||
        error.message.includes('Insufficient stock')) {
      return res.status(400).json({ error: error.message });
    }
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

export const getSaleByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const saleId = parseInt(id);
    
    if (isNaN(saleId) || saleId <= 0) {
      return res.status(400).json({ error: 'Sale ID must be a valid number' });
    }
    
    const sale = await saleService.getSaleById(saleId);
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    
    // Convert shipping_address back to object if it's a JSON string
    if (sale.order && sale.order.shipping_address) {
      try {
        sale.order.shipping_address = JSON.parse(sale.order.shipping_address);
      } catch {
        // If not valid JSON, keep as string
      }
    }
    
    res.json(sale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching sale' });
  }
};
