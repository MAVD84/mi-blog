import { Schema, model, models, Types } from 'mongoose'

export interface IComment {
  _id: string
  post: Types.ObjectId
  author: string
  email: string
  content: string
  approved: boolean
  createdAt: Date
}

const CommentSchema = new Schema<IComment>(
  {
    post:     { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    author:   { type: String, required: true },
    email:    { type: String, required: true, lowercase: true },
    content:  { type: String, required: true, maxlength: 1000 },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
)

CommentSchema.index({ post: 1, approved: 1 })

export const Comment = models.Comment || model<IComment>('Comment', CommentSchema)
