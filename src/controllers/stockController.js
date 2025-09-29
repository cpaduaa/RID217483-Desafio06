import * as stockService from '../services/stockService.js';

export const getStockController = async (req, res) => {
  try {
    const productId = req.params.product_id;
    const stock = await stockService.getStockByProductId(productId);
    if (!stock) return res.status(404).json({ error: 'Stock not found' });
    res.json(stock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching stock' });
  }
};
