import React, { useState } from 'react';
import axios from 'axios';
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    Avatar,
    Snackbar,
    Alert,
    createTheme,
    ThemeProvider
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import userData from '../users.json';

const theme = createTheme({});

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();

    const handleSubmit_back = async (event) => {
        event.preventDefault();
        console.log('Username:', username);
        console.log('Password:', password);
        try {
            await axios.post("http://localhost:1808/api/login", {
                username,
                password
            })
                .then(response => {
                    if (response.status === 200) {
                        const token = response.data.jwt;
                        localStorage.setItem('token', token);
                        const name = response.data.userName
                        localStorage.setItem('name', name);
                        console.log("Login successful");
                        setErrorMessage("");
                        alert('Login successful');
                        window.location.href = '/dashboardnew'
                    }
                })
        } catch (error) {
            setErrorMessage("Incorrect username or password");
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const user = userData.users.find(u => u.username === username.trim() && u.password === password);

        if (user) {
            console.log("Login successful");
            setErrorMessage("");
            setOpenSnackbar(true);
            setTimeout(() => {
                navigate('/dashboardnew');
            }, 1000);
        } else {
            setErrorMessage("Incorrect username or password");
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
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
                            <form onSubmit={handleSubmit_back}>
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
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                />
                                {errorMessage && (
                                    <Alert severity="error" sx={{ mt: 2 }}>
                                        {errorMessage}
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

                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={2000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
                    sx={{
                        position: 'fixed',
                        top: 'calc(50% - 400px)',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '250px', 
                        fontSize: '1.0rem',
                        textAlign: 'center',
                        padding: '16px',
                    }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity="success"
                        sx={{
                            width: '100%',
                            fontSize: '1.0rem',
                            textAlign: 'center',
                            padding: '16px',
                        }}
                    >
                        Login successful!
                    </Alert>
                </Snackbar>
            </Container>
        </ThemeProvider>
    );
}

export default Login;
