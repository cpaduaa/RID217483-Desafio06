import { createProduct, getAllProducts, getProductById } from '../services/productService.js';


export const createProductController = async (req, res) => {
  try {
    const { sku, name, description, price, cost_price, active } = req.body;
    
    // Validações obrigatórias
    if (!sku || !name || price == null || cost_price == null) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: sku, name, price, cost_price' 
      });
    }
    
    // Validar tipos de dados
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ error: 'Preço deve ser um número positivo' });
    }
    
    if (typeof cost_price !== 'number' || cost_price < 0) {
      return res.status(400).json({ error: 'Preço de custo deve ser um número positivo' });
    }
    
    if (typeof sku !== 'string' || sku.trim().length === 0) {
      return res.status(400).json({ error: 'SKU deve ser um texto válido' });
    }
    
    if (typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Nome deve ser um texto válido' });
    }
    
    const product = await createProduct({
      sku: sku.trim(),
      name: name.trim(),
      description: description?.trim(),
      price,
      cost_price,
      active: active ?? true
    });
    
    res.status(201).json(product);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'SKU já existe. Use um SKU único.' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const getAllProductsController = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getProductByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validar se é um UUID válido
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ error: 'ID do produto inválido. Deve ser um UUID válido.' });
    }
    
    const product = await getProductById(id);
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
