import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()
const { DB_DSN } = process.env

class Database {
  private static connection: mongoose.Mongoose | undefined

  static async connect(): Promise<mongoose.Mongoose> {
    if (Database.connection) return Database.connection
    Database.connection = await mongoose.connect(DB_DSN || '')
    return this.connect()
  }
}

export default Database