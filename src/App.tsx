import './App.css';
import React, { useState, useEffect } from 'react';

interface User {
  name: string;
}

const fetchLogin = async () => {
  try {
    // add {credentials: 'include'} to set cookie
    const response = await fetch('http://localhost:4000/test_signup', {credentials: 'include'});
    // if (!response.ok) {
    //   throw new Error('Network response was not ok');
    // }
    const token = await response.json();
    return 'token' in token;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error; // Rethrow the error if you want to handle it outside
  }
};

const fetchUserData = async () => {
  try {
    const response = await fetch('http://localhost:4000/login');
    // if (!response.ok) {
    //   throw new Error('Network response was not ok');
    // }
    const user_data = await response.json();
    return user_data.name;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error; // Rethrow the error if you want to handle it outside
  }
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    fetchLogin()
        .then(setIsLogin)
        .catch((error) => setError(error.message));
  }, [isLogin]);

  useEffect(() => {
    fetchUserData()
        .then(setUser)
        .catch((error) => setError(error.message))
        .finally(() => setLoading(false));
  }, [isLogin]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data found.</div>;

  return (
      <div>
        <h1>{user.name}</h1>
      </div>
  );
}

export default App;
