import * as customerService from '../services/customerService.js';

export const createCustomerController = async (req, res) => {
  try {
    const { name, email, phone, address, city, state, zip_code } = req.body;
    
    // Validações obrigatórias
    if (!name || !email) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: name, email' 
      });
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }
    
    // Validar tipos de dados
    if (typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Nome deve ser um texto válido' });
    }
    
    const customer = await customerService.createCustomer({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim(),
      address: address?.trim(),
      city: city?.trim(),
      state: state?.trim(),
      zip_code: zip_code?.trim()
    });
    
    res.status(201).json(customer);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email já está em uso' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const getAllCustomersController = async (req, res) => {
  try {
    const customers = await customerService.getAllCustomers();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCustomerByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = parseInt(id);
    
    if (isNaN(customerId) || customerId <= 0) {
      return res.status(400).json({ error: 'ID do cliente deve ser um número válido' });
    }
    
    const customer = await customerService.getCustomerById(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCustomerController = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = parseInt(id);
    
    if (isNaN(customerId) || customerId <= 0) {
      return res.status(400).json({ error: 'ID do cliente deve ser um número válido' });
    }
    
    const { name, email, phone, address, city, state, zip_code } = req.body;
    
    // Verificar se o cliente existe
    const existingCustomer = await customerService.getCustomerById(customerId);
    if (!existingCustomer) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    // Validar email se fornecido
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Email inválido' });
      }
    }
    
    const customer = await customerService.updateCustomer(customerId, {
      name: name?.trim(),
      email: email?.trim().toLowerCase(),
      phone: phone?.trim(),
      address: address?.trim(),
      city: city?.trim(),
      state: state?.trim(),
      zip_code: zip_code?.trim()
    });
    
    res.json(customer);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email já está em uso' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteCustomerController = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = parseInt(id);
    
    if (isNaN(customerId) || customerId <= 0) {
      return res.status(400).json({ error: 'ID do cliente deve ser um número válido' });
    }
    
    // Verificar se o cliente existe
    const existingCustomer = await customerService.getCustomerById(customerId);
    if (!existingCustomer) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    await customerService.deleteCustomer(customerId);
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        error: 'Não é possível excluir cliente com pedidos associados' 
      });
    }
    res.status(500).json({ error: error.message });
  }
};