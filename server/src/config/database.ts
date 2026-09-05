import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase() {
  mongoose.set('strictQuery', true);

  await mongoose.connect(env.MONGODB_URI, {
    dbName: 'codexnova',
    serverSelectionTimeoutMS: 20_000,
  });
  console.log('MongoDB connected');
}
