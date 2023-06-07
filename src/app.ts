import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import path from 'path'

// Controllers
import ChatController from './controllers/chat.controller'
import AdminController from './controllers/admin.controller'

// Server
const app = express()

// Body parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Cookie parser
app.use(cookieParser())

// CORS
// app.use(cors({
//   credentials: true,
//   origin: (origin, callback) => callback(null, true),
// }))

// Needed for HTTPS detection
app.enable('trust proxy')

// Template language
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// Static files
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.get('/', ChatController.chat)
app.post('/', ChatController.messagePost)
app.get('/admin', AdminController.admin)

export default app
