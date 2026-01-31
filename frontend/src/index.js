import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";

/* 🎮 SIMPLE GAME COMPONENT */
function Game() {
  const [number] = useState(Math.floor(Math.random() * 10) + 1);
  const [guess, setGuess] = useState("");

  const checkGuess = () => {
    if (parseInt(guess) === number) {
      alert("🎉 Correct! You won!");
    } else {
      alert("❌ Wrong guess. Try again!");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>🎮 Guess the Number (1–10)</h2>

      <input
        type="number"
        placeholder="Enter your guess"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
      />
      <br /><br />

      <button onClick={checkGuess}>Check</button>
    </div>
  );
}

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const API = "https://project4-o77t.onrender.com/api/auth";

  const register = async () => {
    try {
      await axios.post(`${API}/register`, { email, password });
      alert("Registered");
    } catch (err) {
      alert(err.response?.data || "Register failed");
    }
  };

  const login = async () => {
    try {
      await axios.post(`${API}/login`, { email, password });
      setLoggedIn(true); // ✅ redirect to game
    } catch (err) {
      alert(err.response?.data || "Login failed");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>MERN Auth</h1>

      {!loggedIn ? (
        <>
          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <br /><br />

          <input
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br /><br />

          <button onClick={register}>Register</button>{" "}
          <button onClick={login}>Login</button>
        </>
      ) : (
        <Game />
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
