import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import Login from './component/Login.jsx'
import Dashboard from './component/Dashboard.jsx';
import {Typography} from "@mui/material";

function App() {
  

    return (
      <Router>
            <div className="App">
                <Typography component="h1" variant="h2"
                            sx={{
                                backgroundImage: 'linear-gradient(13.54deg, rgba(0, 163, 255, 0.1) 36.27%, rgba(0, 163, 255, 0.25) 78.76%, rgba(0, 163, 255, 0.15) 100%)',
                                backgroundColor: '#07070e',
                                color: '#15eafd',
                                padding: 1,
                            }}>
                    InfluxUI-PG01
                </Typography>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard"  element={<Dashboard />} />
                </Routes>
            </div>
        </Router>
    )
  }
  
  export default App;
  