import dotenv from 'dotenv'

import app from './app'

// Load env variables
dotenv.config()
const { PORT } = process.env

// Start the web server
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

