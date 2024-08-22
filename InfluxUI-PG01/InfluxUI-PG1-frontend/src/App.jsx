import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import Login from './component/Login.jsx'
import Dashboard from './component/Dashboard.jsx';

function App() {
  

    return (
      <Router>
            <div className="App">
                <h1>InfluxUI-PG01</h1>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard"  element={<Dashboard />} />
                </Routes>
            </div>
        </Router>
    )
  }
  
  export default App;
  