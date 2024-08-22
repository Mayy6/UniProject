import React, { useState } from 'react';
import axios from "axios";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Username:', username);
        console.log('Password:', password);

        try {
            const response = await axios.post("http://localhost:1808/api/login", {
                username,
                password
            })
                .then(response => {
                    if (response.status === 200) {
                        const token = response.data.jwt;
                        localStorage.setItem('token', token);
                        alert('Login successful');
                        window.location.href = '/dashboard'
                    }
                })
        } catch (error) {
            alert('Login failed');
            console.error('Login failed', error);

        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
