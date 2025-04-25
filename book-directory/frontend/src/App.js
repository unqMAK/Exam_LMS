const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://exam-lms.onrender.com';

const fetchBooks = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/books`);
    // ...existing code...
  } catch (error) {
    console.error('Error:', error);
  }
};

const onSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(`${BACKEND_URL}/api/books`, {
      method: 'POST',
      // ...existing code...
    });
    // ...existing code...
  } catch (error) {
    console.error('Error:', error);
  }
};
