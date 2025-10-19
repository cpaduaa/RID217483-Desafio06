import express from 'express';
import { 
  createSaleController, 
  getSalesController,
  getSaleByIdController 
} from '../controllers/saleController.js';

const router = express.Router();

router.post('/', createSaleController); 
router.get('/', getSalesController);
router.get('/:id', getSaleByIdController); 

export default router;
