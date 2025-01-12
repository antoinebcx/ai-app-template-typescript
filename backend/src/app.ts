import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import apiRoutes from './routes/api';
import { errorHandler } from './middlewares/error';

const app = express();

app.use(cors({
  origin: config.CORS_ORIGIN,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.use(errorHandler);

const startServer = () => {
  try {
    app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
