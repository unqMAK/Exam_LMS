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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      console.log('Fetching books from:', `${apiUrl}/books`);
      const response = await fetch(`${apiUrl}/books`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while fetching books';
      console.error('Error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      if (editingBook) {
        const response = await fetch(`${apiUrl}/books/${editingBook._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            author,
            publishedYear: Number(publishedYear)
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setEditingBook(null);
      } else {
        const response = await fetch(`${apiUrl}/books`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            author,
            publishedYear: Number(publishedYear)
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      setTitle('');
      setAuthor('');
      setPublishedYear('');
      fetchBooks();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while saving the book';
      console.error('Error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
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
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/books/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchBooks();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while deleting the book';
      console.error('Error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Book Directory</h1>
      
      {error && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '20px', 
          backgroundColor: '#ffebee', 
          color: '#c62828',
          border: '1px solid #ef9a9a'
        }}>
          {error}
        </div>
      )}

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
        <button 
          type="submit" 
          style={{ 
            padding: '5px 10px', 
            marginRight: '5px',
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : (editingBook ? 'Update Book' : 'Add Book')}
        </button>
        {editingBook && (
          <button type="button" onClick={cancelEdit} style={{ padding: '5px 10px' }}>
            Cancel
          </button>
        )}
      </form>

      {isLoading && !books.length ? (
        <div>Loading books...</div>
      ) : (
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
      )}
    </div>
  );
}

export default App;