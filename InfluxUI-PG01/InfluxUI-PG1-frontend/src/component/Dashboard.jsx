import React from 'react';
import axios from "axios";
import {Button,TextField,Typography,Box} from "@mui/material";

function Dashboard() {
    const handleSubmit = async (event) => {
        event.preventDefault();
        // console.log('Username:', username);
        // console.log('Password:', password);

        try {
            const response = await axios.get("http://localhost:1808/api/hello")
                .then(response => {
                    if (response.status === 200) {
                        const token = response.data;
                        // localStorage.setItem('token', token);
                        alert(token);
                        // window.location.href = '/dashboard'
                    }
                })
        } catch (error) {
            if (error.response && error.response.status === 403) {
                window.location.href = '/'
            } else {
                console.error('Unexpected error occurred', error);
            }

        }
    };
    return (
        <div>
            <Typography>Dashboard</Typography>
            <p>Welcome to the dashboard!</p>
            <form onSubmit={handleSubmit}>
                <Button variant="contained" type="submit">access to the api</Button>
            </form>


        </div>
    );
}

export default Dashboard;
