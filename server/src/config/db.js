import mongoose from 'mongoose';

let memoryServer = null;

/**
 * Connects to MongoDB. When MONGO_URI is not set, starts an in-memory
 * MongoDB instance so the project runs without any local database install.
 * Returns true when the in-memory fallback is used.
 */
export async function connectDB() {
  let uri = process.env.MONGO_URI;
  let inMemory = false;

  if (!uri) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('MONGO_URI is required in production');
    }
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri('halden');
    inMemory = true;
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log(`MongoDB connected${inMemory ? ' (in-memory)' : ''}`);
  return inMemory;
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) await memoryServer.stop();
}
