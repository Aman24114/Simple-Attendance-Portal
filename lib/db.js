import mongoose from 'mongoose';
const MONGODB_URI = process.env.MONGODB_URI;
// cache the connection across hot-reloads in dev
if (!global._mongoose) {
  global._mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. Define it in .env.local');
  }
  if (global._mongoose.conn) return global._mongoose.conn;
  if (!global._mongoose.promise) {
    global._mongoose.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'attendance_portal',
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  }
  try {
    global._mongoose.conn = await global._mongoose.promise;
    return global._mongoose.conn;
  } catch (error) {
    global._mongoose.promise = null;
    throw error;
  }
}
