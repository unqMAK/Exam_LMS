import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publishedYear: { type: Number, required: true }
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

export default mongoose.model('Book', bookSchema);