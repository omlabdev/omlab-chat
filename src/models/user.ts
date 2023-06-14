import { Document, Model, model, Schema } from 'mongoose'
import { randomBytes, pbkdf2Sync } from 'crypto'

function generateRandomString(length: number = 16): string {
  return randomBytes(length).toString('hex')
}

function generteHashedPassword(password: string, salt: string): string {
  return pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
}

// Schema
const UserSchema = new Schema<UserBaseDocument, UserModel>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
})

interface User {
  email: String
  password: String
  salt: String
}

UserSchema.pre('validate', function(next) {
  if (!this.isModified('password')) return next()
  // Get a new salt
  const salt = generateRandomString()
  // Hash the password
  const password = generteHashedPassword(this.password.toString(), salt)
  // Set the new password & salt
  this.password = password
  this.salt = salt
  return next()
})

interface UserBaseDocument extends User, Document {
  checkPassword(password: string): boolean
}

// Methods
UserSchema.methods.checkPassword = function(this: UserBaseDocument, password: string) {
  if ((!password) || (!this.salt)) return false
  return (this.password === generteHashedPassword(password, this.salt.toString()))
}

// For model
interface UserModel extends Model<UserBaseDocument> {}

// Default export
export default model<UserBaseDocument, UserModel>('User', UserSchema)