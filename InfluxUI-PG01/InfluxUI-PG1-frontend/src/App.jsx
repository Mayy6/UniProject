import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './component/Login.jsx';
import Dashboard from './component/Dashboard.jsx';
import Header from './component/Header/Header.jsx';
import { FluxQueryProvider } from './FluxQueryContext';  // 引入Context Provider

function App() {
    return (
        <FluxQueryProvider>  {/* 包裹整个应用 */}
            <>
                <Header />
                <Router>
                    <div className="App" style={{ paddingTop: '60px' }}>
                        <Routes>
                            <Route path="/" element={<Login />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                        </Routes>
                    </div>
                </Router>
            </>
        </FluxQueryProvider>
    );
}

export default App;
