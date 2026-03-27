import mongoose, { Schema, model, models } from 'mongoose'

export interface IUser {
  _id: string
  name: string
  email: string
  password: string
  role: 'admin' | 'author'
  avatar?: string
  bio?: string
  createdAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ['admin', 'author'], default: 'author' },
    avatar:   { type: String },
    bio:      { type: String },
  },
  { timestamps: true }
)

export const User = models.User || model<IUser>('User', UserSchema)
