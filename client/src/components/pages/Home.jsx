
function Home() {
  const handleLogin = () => {
    window.location.href = '/auth/github'; // Adjust URL to match your backend
  };

  return (
    <div>
      <h1>Welcome to Your App</h1>
      <button onClick={handleLogin}>Login with GitHub</button>
    </div>
  );
}

export default Home;
