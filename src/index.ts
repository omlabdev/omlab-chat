import dotenv from 'dotenv'

import Database from './services/database.service'

import app from './app'

// Load env variables
dotenv.config()
const { PORT } = process.env

// Start the web server
Database.connect().then(() => {
  app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
})

