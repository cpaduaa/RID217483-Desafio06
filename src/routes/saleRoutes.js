import express from 'express';
import { createSaleController, getSalesController } from '../controllers/saleController.js';

const router = express.Router();

router.post('/', createSaleController); 
router.get('/', getSalesController); 

export default router;
