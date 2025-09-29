import express from 'express';
import { getStockController } from '../controllers/stockController.js';

const router = express.Router();

router.get('/:product_id', getStockController);

export default router;
