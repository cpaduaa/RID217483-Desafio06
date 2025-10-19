import * as saleService from '../services/saleService.js';

export const createSaleController = async (req, res) => {
  try {
    const { order_id, customer_id, payment_method } = req.body;
    
    // Validações obrigatórias
    if (!order_id || !customer_id || !payment_method) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: order_id, customer_id, payment_method' 
      });
    }
    
    // Validar tipos
    if (typeof order_id !== 'number' || order_id <= 0) {
      return res.status(400).json({ error: 'order_id deve ser um número válido' });
    }
    
    if (typeof customer_id !== 'number' || customer_id <= 0) {
      return res.status(400).json({ error: 'customer_id deve ser um número válido' });
    }
    
    if (typeof payment_method !== 'string' || payment_method.trim().length === 0) {
      return res.status(400).json({ error: 'Método de pagamento deve ser um texto válido' });
    }
    
    const sale = await saleService.createSale({
      order_id,
      customer_id,
      payment_method: payment_method.trim()
    });
    
    res.status(201).json(sale);
  } catch (error) {
    console.error(error);
    if (error.message.includes('não encontrado') || 
        error.message.includes('já foi finalizado') ||
        error.message.includes('Já existe uma venda') ||
        error.message.includes('Estoque insuficiente')) {
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
    res.status(500).json({ error: 'Erro ao buscar vendas' });
  }
};

export const getSaleByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const saleId = parseInt(id);
    
    if (isNaN(saleId) || saleId <= 0) {
      return res.status(400).json({ error: 'ID da venda deve ser um número válido' });
    }
    
    const sale = await saleService.getSaleById(saleId);
    if (!sale) {
      return res.status(404).json({ error: 'Venda não encontrada' });
    }
    
    // Converter shipping_address de volta para objeto se for string JSON
    if (sale.order && sale.order.shipping_address) {
      try {
        sale.order.shipping_address = JSON.parse(sale.order.shipping_address);
      } catch {
        // Se não for JSON válido, manter como string
      }
    }
    
    res.json(sale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar venda' });
  }
};
