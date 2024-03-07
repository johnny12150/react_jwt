import './App.css';
import React, { useState, useEffect } from 'react';

const fetchLogin = async () => {
  try {
    // add {credentials: 'include'} to set cookie
    const response = await fetch('http://localhost:4000/test_signup', {credentials: 'include'});
    if (!response.ok) {
      console.log(response);
      throw new Error('Network response was not ok');
    }
    const token = await response.json();
    return 'token' in token;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error; // Rethrow the error if you want to handle it outside
  }
};

const fetchUserData = async (isLogin: boolean) => {
  try {
    const response = await fetch('http://localhost:4000/login', {credentials: 'include'});
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const user_data = await response.json();
    return user_data.res_;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error; // Rethrow the error if you want to handle it outside
  }
};

// notice: JS can't access http-only cookies
function checkCookieExists(cookieName: string): boolean {
  // Split document.cookie on semicolons and trim each item
  const cookies = document.cookie.split(';').map(cookie => cookie.trim());
  // Check if any cookie string starts with the cookie name followed by an equals sign
  return cookies.some(cookie => cookie.startsWith(`${cookieName}=`));
}

function App() {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(checkCookieExists('access_token'));
  const [logoutStatus, setLogoutStatus] = useState<string>('');

  useEffect(() => {
    fetchLogin()
        .then(setIsLogin)
        .catch((error) => setError(error.message));
  }, []);

  useEffect(() => {
    if (isLogin) {  // Avoid calling this before signup
      fetchUserData(isLogin)
          .then(setUser)
          .catch((error) => setError(error.message))
          .finally(() => setLoading(false));
    }
  }, [isLogin]);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:4000/logout', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setLogoutStatus('Logout successful');
      } else {
        setLogoutStatus('Logout failed. Please try again.');
      }
    } catch (error) {
      setLogoutStatus(`Logout error: ${error}`);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data found.</div>;

  return (
      <div>
        <h1>{user}</h1>
        <button onClick={handleLogout}>Logout</button>
        {logoutStatus && <div>{logoutStatus}</div>}
      </div>
  );
}

export default App;
