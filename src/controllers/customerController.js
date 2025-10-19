import * as customerService from '../services/customerService.js';

export const createCustomerController = async (req, res) => {
  try {
    const { name, email, phone, address, city, state, zip_code } = req.body;
    
    // Required validations
    if (!name || !email) {
      return res.status(400).json({ 
        error: 'Required fields: name, email' 
      });
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    
    // Validate data types
    if (typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name must be a valid text' });
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
      return res.status(400).json({ error: 'Email already in use' });
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
      return res.status(400).json({ error: 'Customer ID must be a valid number' });
    }
    
    const customer = await customerService.getCustomerById(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
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
      return res.status(400).json({ error: 'Customer ID must be a valid number' });
    }
    
    const { name, email, phone, address, city, state, zip_code } = req.body;
    
    // Check if customer exists
    const existingCustomer = await customerService.getCustomerById(customerId);
    if (!existingCustomer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email' });
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
      return res.status(400).json({ error: 'Email already in use' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteCustomerController = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = parseInt(id);
    
    if (isNaN(customerId) || customerId <= 0) {
      return res.status(400).json({ error: 'Customer ID must be a valid number' });
    }
    
    // Check if customer exists
    const existingCustomer = await customerService.getCustomerById(customerId);
    if (!existingCustomer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    await customerService.deleteCustomer(customerId);
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        error: 'Cannot delete customer with associated orders' 
      });
    }
    res.status(500).json({ error: error.message });
  }
};