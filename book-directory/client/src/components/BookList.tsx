import React, { useEffect, useState } from 'react';
import { Book } from '../types';
import EditBook from './EditBook';
import DeleteBook from './DeleteBook';

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/books');
      const data = await response.json();
      setBooks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {books.map((book) => (
        <div key={book._id} className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-2">{book.title}</h2>
          <p className="text-gray-600">Author: {book.author}</p>
          <p className="text-gray-600">Year: {book.publishedYear}</p>
          <p className="text-gray-600">Genre: {book.genre}</p>
          <p className="text-gray-600 mt-2">{book.description}</p>
          <div className="flex justify-end mt-4 space-x-2">
            <EditBook book={book} onUpdate={fetchBooks} />
            <DeleteBook bookId={book._id!} onDelete={fetchBooks} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookList;