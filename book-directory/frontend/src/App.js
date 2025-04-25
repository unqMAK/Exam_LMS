const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://exam-lms.onrender.com';

const fetchBooks = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/books`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
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
      headers: {
        'Content-Type': 'application/json'
      },
      // ...existing code...
    });
    // ...existing code...
  } catch (error) {
    console.error('Error:', error);
  }
};
