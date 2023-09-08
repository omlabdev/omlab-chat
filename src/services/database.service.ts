import mongoose from 'mongoose'

const { DB_DSN } = process.env

class Database {
  private static connection: mongoose.Mongoose | undefined

  static async connect(): Promise<mongoose.Mongoose> {
    if (Database.connection) return Database.connection
    Database.connection = await mongoose.connect(DB_DSN || '')
    return Database.connect()
  }

  static async close() {
    return await (await Database.connect()).connection.close()
  }
}

export default Database