import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import path from 'path'

// Controllers
import ChatController from './controllers/chat.controller'
import AdminController from './controllers/admin.controller'
import UserController from './controllers/user.controller'
import AuthMiddleware from './middleware/auth.middleware'

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

// Login
app.get('/login', AuthMiddleware.noAuth ,UserController.signin)
app.post('/login', AuthMiddleware.noAuth ,UserController.signinPost)

// Chat
app.get('/', AuthMiddleware.auth, ChatController.home)
app.get('/store', ChatController.store)
app.get('/widget', AuthMiddleware.auth, ChatController.widget)
app.get('/reset', AuthMiddleware.auth, ChatController.reset)
app.get('/json', AuthMiddleware.auth, ChatController.messages)
app.post('/', AuthMiddleware.auth, ChatController.messagePost)

// Admin
app.get('/admin', AuthMiddleware.auth, AdminController.admin)
app.post('/admin', AuthMiddleware.auth, AdminController.messagePost)
app.delete('/admin', AuthMiddleware.auth, AdminController.messageDelete)

export default app
