import { createProduct, getAllProducts, getProductById } from '../services/productService.js';


export const createProductController = async (req, res) => {
  try {
    const { sku, name, description, price, cost_price, active } = req.body;
    
    // Required validations
    if (!sku || !name || price == null || cost_price == null) {
      return res.status(400).json({ 
        error: 'Required fields: sku, name, price, cost_price' 
      });
    }
    
    // Validate data types
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }
    
    if (typeof cost_price !== 'number' || cost_price < 0) {
      return res.status(400).json({ error: 'Cost price must be a positive number' });
    }
    
    if (typeof sku !== 'string' || sku.trim().length === 0) {
      return res.status(400).json({ error: 'SKU must be a valid text' });
    }
    
    if (typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name must be a valid text' });
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
      return res.status(400).json({ error: 'SKU already exists. Use a unique SKU.' });
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
    
    // Validate if it's a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ error: 'Invalid product ID. Must be a valid UUID.' });
    }
    
    const product = await getProductById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
