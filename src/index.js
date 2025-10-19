import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import saleRoutes from './routes/saleRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import customerRoutes from './routes/customerRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/sales', saleRoutes);
app.use('/stock', stockRoutes);
app.use('/customers', customerRoutes);

app.get('/', (req, res) => {
  res.send('DNCommerce API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
