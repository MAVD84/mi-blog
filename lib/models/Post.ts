import { Schema, model, models, Types } from 'mongoose'

export interface IPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  author: Types.ObjectId
  categories: Types.ObjectId[]
  published: boolean
  publishedAt?: Date
  readingTime?: number
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new Schema<IPost>(
  {
    title:       { type: String, required: true },
    slug:        { type: String, required: true, unique: true },
    excerpt:     { type: String, required: true, maxlength: 300 },
    content:     { type: String, required: true },
    coverImage:  { type: String },
    author:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
    categories:  [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    published:   { type: Boolean, default: false },
    publishedAt: { type: Date },
    readingTime: { type: Number },
  },
  { timestamps: true }
)

// Calcular tiempo de lectura antes de guardar
PostSchema.pre('save', function (next) {
  const wordsPerMinute = 200
  const wordCount = this.content.trim().split(/\s+/).length
  this.readingTime = Math.ceil(wordCount / wordsPerMinute)
  if (this.published && !this.publishedAt) {
    this.publishedAt = new Date()
  }
  next()
})

// slug no va aquí — ya tiene unique:true arriba
PostSchema.index({ published: 1, publishedAt: -1 })
PostSchema.index({ categories: 1 })

export const Post = models.Post || model<IPost>('Post', PostSchema)