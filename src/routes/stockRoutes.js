import express from 'express';
import { 
  getStockController, 
  getAllStocksController,
  createOrUpdateStockController,
  adjustStockController,
  getLowStockController
} from '../controllers/stockController.js';

const router = express.Router();

// Rotas específicas primeiro
router.get('/low', getLowStockController);
router.get('/all', getAllStocksController);
router.post('/', createOrUpdateStockController);
router.patch('/:product_id/adjust', adjustStockController);

// Rota geral por último
router.get('/:product_id', getStockController);

export default router;
