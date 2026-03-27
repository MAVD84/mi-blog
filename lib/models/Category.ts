import { Schema, model, models } from 'mongoose'

export interface ICategory {
  _id: string
  name: string
  slug: string
  description?: string
  color?: string
}

const CategorySchema = new Schema<ICategory>(
  {
    name:        { type: String, required: true, unique: true },
    slug:        { type: String, required: true, unique: true },
    description: { type: String },
    color:       { type: String, default: '#c0392b' },
  },
  { timestamps: true }
)

export const Category = models.Category || model<ICategory>('Category', CategorySchema)
