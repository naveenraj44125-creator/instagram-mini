import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Instagram Mini</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-input"
            required
          />
          <button type="submit" className="btn btn-primary">
            Log In
          </button>
        </form>
        <p style={{ marginTop: '20px', color: '#8e8e8e', fontSize: '14px' }}>
          Just enter any username to get started!
        </p>
      </div>
    </div>
  );
};

export default Login;
