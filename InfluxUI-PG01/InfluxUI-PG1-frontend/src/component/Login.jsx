import React, { useState } from 'react';
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    Avatar,
    Alert,
    FormControlLabel,
    Checkbox,
    createTheme,
    ThemeProvider
} from '@mui/material';
import axios from "axios";
import PersonIcon from '@mui/icons-material/Person';
import { enUS } from '@mui/material/locale';
import userData from '../users.json';
const theme = createTheme({}, enUS);



function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit_back = async (event) => {
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
    const handleSubmit = (e) => {
        e.preventDefault();

        const user = userData.users.find(u => u.username === username.trim() && u.password === password);

        if (user) {
            console.log("Login successful");
            setSuccessMessage("Login successful!");
            setErrorMessage("");
        } else {
            setErrorMessage("Incorrect username or password");
            setSuccessMessage("");
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <PersonIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    <Card sx={{ mt: 3, boxShadow: 5 }}>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    autoComplete="username"
                                    autoFocus
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={showPassword}
                                            onChange={() => setShowPassword(!showPassword)}
                                            color="primary"
                                        />
                                    }
                                    label="Show password"
                                />
                                {errorMessage && (
                                    <Alert severity="error" sx={{ mt: 2 }}>
                                        {errorMessage}
                                    </Alert>
                                )}
                                {successMessage && (
                                    <Alert severity="success" sx={{ mt: 2 }}>
                                        {successMessage}
                                    </Alert>
                                )}
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Login
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default Login;
