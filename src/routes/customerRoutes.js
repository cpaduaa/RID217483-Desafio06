import express from 'express';
import {
  createCustomerController,
  getAllCustomersController,
  getCustomerByIdController,
  updateCustomerController,
  deleteCustomerController
} from '../controllers/customerController.js';

const router = express.Router();

router.post('/', createCustomerController);
router.get('/', getAllCustomersController);
router.get('/:id', getCustomerByIdController);
router.put('/:id', updateCustomerController);
router.delete('/:id', deleteCustomerController);

export default router;