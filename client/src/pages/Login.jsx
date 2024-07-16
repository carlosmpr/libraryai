import React from 'react';

function Login() {
  const handleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/github'; // Adjust URL to match your backend
  };

  return (
    <div>
      <h1>Login with GitHub</h1>
      <button onClick={handleLogin}>Login with GitHub</button>
    </div>
  );
}

export default Login;
