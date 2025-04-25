const Book = require('../models/Book');

const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching books' });
  }
};

const addBook = async (req, res) => {
  const { title, author, publishedYear } = req.body;

  if (!title || !author || !publishedYear) {
    return res.status(400).json({ error: 'All fields (title, author, publishedYear) are required' });
  }

  try {
    const book = await Book.create({ title, author, publishedYear });
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: 'Error creating book' });
  }
};

const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(400).json({ error: 'Error updating book' });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting book' });
  }
};

module.exports = {
  getBooks,
  addBook,
  updateBook,
  deleteBook
};