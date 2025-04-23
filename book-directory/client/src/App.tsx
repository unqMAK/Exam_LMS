import React, { useState, useEffect } from 'react';

interface Book {
  _id?: string;
  title: string;
  author: string;
  publishedYear: number;
}

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/books');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBook) {
        // Update existing book
        await fetch(`http://localhost:5000/api/books/${editingBook._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            author,
            publishedYear: Number(publishedYear)
          }),
        });
        setEditingBook(null);
      } else {
        // Add new book
        await fetch('http://localhost:5000/api/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            author,
            publishedYear: Number(publishedYear)
          }),
        });
      }
      setTitle('');
      setAuthor('');
      setPublishedYear('');
      fetchBooks();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const startEdit = (book: Book) => {
    setEditingBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setPublishedYear(book.publishedYear.toString());
  };

  const cancelEdit = () => {
    setEditingBook(null);
    setTitle('');
    setAuthor('');
    setPublishedYear('');
  };

  const deleteBook = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/books/${id}`, {
        method: 'DELETE',
      });
      fetchBooks();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Book Directory</h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="number"
          placeholder="Published Year"
          value={publishedYear}
          onChange={(e) => setPublishedYear(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button type="submit" style={{ padding: '5px 10px', marginRight: '5px' }}>
          {editingBook ? 'Update Book' : 'Add Book'}
        </button>
        {editingBook && (
          <button type="button" onClick={cancelEdit} style={{ padding: '5px 10px' }}>
            Cancel
          </button>
        )}
      </form>

      <div>
        {books.map((book) => (
          <div key={book._id} style={{ 
            border: '1px solid #ddd', 
            padding: '10px', 
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3>{book.title}</h3>
              <p>Author: {book.author}</p>
              <p>Year: {book.publishedYear}</p>
            </div>
            <div>
              <button 
                onClick={() => startEdit(book)}
                style={{ 
                  padding: '5px 10px', 
                  backgroundColor: '#4CAF50', 
                  color: 'white', 
                  border: 'none',
                  marginRight: '5px' 
                }}
              >
                Edit
              </button>
              <button 
                onClick={() => deleteBook(book._id!)}
                style={{ 
                  padding: '5px 10px', 
                  backgroundColor: '#ff4444', 
                  color: 'white', 
                  border: 'none' 
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;