import React, { useState } from 'react';
import {Button,TextField,Typography,Box} from "@mui/material";
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
        <Box
            sx={{
                width: '100%',
                maxWidth: '400px',
                margin: 'auto',
                padding: 4,
                backgroundColor: '#ffffff',
                borderRadius: 2,
                boxShadow: 3,
                marginTop: '30px'
            }}
            className="login-container">
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <TextField
                        className="textFiled"
                        label="username"
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <TextField
                        label="password"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <Button variant="contained"
                        sx={{
                            marginTop: '30px'
                        }}
                        type="submit">Login</Button>
            </form>
        </Box>
    );
}

export default Login;
