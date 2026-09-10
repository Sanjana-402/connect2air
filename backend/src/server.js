import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import contactRoutes from './routes/contactRoutes.js';

const app = express();
const port = Number(process.env.PORT) || 5000;
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',').map((origin) => origin.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '100kb' }));

app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'Connect2Air API is running.',
    health: '/health',
    contactEndpoint: '/api/contact',
  });
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.use('/api/contact', contactRoutes);
app.use((_req, res) => res.status(404).json({ message: 'Route not found.' }));
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
});

async function startServer() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing. Add your MongoDB Atlas connection string to backend/.env.');
  }

  await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DB_NAME || 'connect2air',
    serverSelectionTimeoutMS: 10000,
  });

  console.log(`MongoDB connected to database: ${mongoose.connection.name}`);
  app.listen(port, () => console.log(`Connect2Air API listening on http://localhost:${port}`));
}

startServer().catch((error) => {
  console.error(`Unable to start Connect2Air API: ${error.message}`);
  process.exit(1);
});
