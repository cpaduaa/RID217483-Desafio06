import express from 'express';
import {
  createProductController,
  getAllProductsController,
  getProductByIdController
} from '../controllers/productController.js';

const router = express.Router();

router.post('/', createProductController);
router.get('/', getAllProductsController); 
router.get('/:id', getProductByIdController); 

export default router;
