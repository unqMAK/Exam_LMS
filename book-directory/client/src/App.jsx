import React, { useState, useEffect } from 'react';

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [editingBook, setEditingBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/books`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to fetch books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const bookData = {
        title,
        author,
        publishedYear: Number(publishedYear),
      };
      
      if (editingBook) {
        const response = await fetch(`${apiUrl}/books/${editingBook._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookData),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setEditingBook(null);
      } else {
        const response = await fetch(`${apiUrl}/books`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookData),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      setTitle('');
      setAuthor('');
      setPublishedYear('');
      await fetchBooks();
    } catch (error) {
      console.error('Error adding/updating book:', error);
      setError('Failed to add/update book. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/books/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
      setError('Failed to delete book. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (book) => {
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

  useEffect(() => {
    fetchBooks();
  }, []);

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
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
          disabled={loading}
        >
          {loading ? 'Loading...' : (editingBook ? 'Update Book' : 'Add Book')}
        </button>
        {editingBook && (
          <button type="button" onClick={cancelEdit} style={{ padding: '5px 10px' }}>
            Cancel
          </button>
        )}
      </form>

      {loading && !books.length ? (
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
                  onClick={() => handleDelete(book._id)}
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