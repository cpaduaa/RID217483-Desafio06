import * as stockService from '../services/stockService.js';

export const getStockController = async (req, res) => {
  try {
    const productId = req.params.product_id;
    
    // Validar UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(productId)) {
      return res.status(400).json({ error: 'ID do produto inválido. Deve ser um UUID válido.' });
    }
    
    const stock = await stockService.getStockByProductId(productId);
    if (!stock) return res.status(404).json({ error: 'Estoque não encontrado' });
    res.json(stock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar estoque' });
  }
};

export const getAllStocksController = async (req, res) => {
  try {
    const stocks = await stockService.getAllStocks();
    res.json(stocks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar estoques' });
  }
};

export const createOrUpdateStockController = async (req, res) => {
  try {
    const { product_id, quantity, min_quantity } = req.body;
    
    // Validações
    if (!product_id || quantity == null) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: product_id, quantity' 
      });
    }
    
    if (typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).json({ error: 'Quantidade deve ser um número positivo' });
    }
    
    if (min_quantity != null && (typeof min_quantity !== 'number' || min_quantity < 0)) {
      return res.status(400).json({ error: 'Quantidade mínima deve ser um número positivo' });
    }
    
    const stock = await stockService.createOrUpdateStock(product_id, quantity, min_quantity);
    res.json(stock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const adjustStockController = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { quantity_change, reason } = req.body;
    
    // Validações
    if (quantity_change == null) {
      return res.status(400).json({ 
        error: 'Campo obrigatório: quantity_change' 
      });
    }
    
    if (typeof quantity_change !== 'number') {
      return res.status(400).json({ error: 'Mudança de quantidade deve ser um número' });
    }
    
    const stock = await stockService.adjustStock(product_id, quantity_change, reason);
    res.json(stock);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

export const getLowStockController = async (req, res) => {
  try {
    const lowStockItems = await stockService.getLowStockItems();
    res.json(lowStockItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar itens com estoque baixo' });
  }
};
