import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './component/Login.jsx';
import Dashboard from './component/Dashboard.jsx';
import Header from './component/Header/Header.jsx';
import DashboardNew from './component/DashboardNew.jsx';
import { FluxQueryProvider } from './FluxQueryContext'; 

function App() {
    return (
        <FluxQueryProvider> 
            <>
                <Header />
                <Router>
                    <div className="App" style={{ paddingTop: '60px' }}>
                        <Routes>
                            <Route path="/" element={<Login />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/dashboardnew" element={<DashboardNew />} />
                        </Routes>
                    </div>
                </Router>
            </>
        </FluxQueryProvider>
    );
}

export default App;

