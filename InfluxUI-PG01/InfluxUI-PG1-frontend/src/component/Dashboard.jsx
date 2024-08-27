import React from 'react';
import axios from "axios";
import {Button,TextField,Typography,Box} from "@mui/material";

import "./Dashboard.css";


import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { 
    AccountBalanceOutlined,
    SearchOutlined,
    FilterAltOutlined
} from '@mui/icons-material';


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
        <div className="dashsoard-container">

      <div className="column-box">
        <div className="filter-box">
            <div className="filter-title">
                <AccountBalanceOutlined sx={{ fontSize: 20 }} />
                <span className="filter-title-text">User's Buckests</span>
            </div>
            <div className="search-input">
                <input className="input-el" type="text" placeholder="Search" />
                <SearchOutlined sx={{ fontSize: 20 }} />
            </div>
        </div>

        <div className="filter-box">
            <div className="filter-title">
                <AccountBalanceOutlined sx={{ fontSize: 20 }} />
                <span className="filter-title-text">User's measurement</span>
            </div>
            <div className="search-input">
                <input className="input-el" type="text" placeholder="Search" />
                <SearchOutlined sx={{ fontSize: 20 }} />
            </div>
        </div>

        <div className="filter-box">
            <div className="filter-title">
                <AccountBalanceOutlined sx={{ fontSize: 20 }} />
                <span className="filter-title-text">User's field</span>
            </div>
            <div className="search-input">
                <input className="input-el" type="text" placeholder="Search" />
                <SearchOutlined sx={{ fontSize: 20 }} />
            </div>
        </div>

      </div>

      <div className="column-box">
        
        <div className="filter-box">
            <div className="filter-title">
                <AccountBalanceOutlined sx={{ fontSize: 20 }} />
                <span className="filter-title-text">Selected Buckests</span>
            </div>
            <div className="search-input">
                <input className="input-el" type="text" placeholder="Search" />
                <SearchOutlined sx={{ fontSize: 20 }} />
            </div>
        </div>

        <div className="filter-box">
            <div className="filter-title">
                <AccountBalanceOutlined sx={{ fontSize: 20 }} />
                <span className="filter-title-text">Selected measurement</span>
            </div>
            <div className="search-input">
                <input className="input-el" type="text" placeholder="Search" />
                <SearchOutlined sx={{ fontSize: 20 }} />
            </div>
        </div>

        <div className="filter-box">
            <div className="filter-title">
                <AccountBalanceOutlined sx={{ fontSize: 20 }} />
                <span className="filter-title-text">Selected fields</span>
            </div>
            <div className="search-input">
                <input className="input-el" type="text" placeholder="Search" />
                <SearchOutlined sx={{ fontSize: 20 }} />
            </div>
        </div>


      </div>

      <div className="column-box" style={{width: "40%"}}>
        
        <div className="main-iner-box" style={{height: "50%", marginTop: "5px"}}>
            <textarea className="text-area" placeholder="Write your query here" ></textarea>
            <div className="btn-box">
                <Button variant="contained" color="error" style={{margin: "0 5px"}}>Clear All</Button>
                <Button variant="contained" style={{margin: "0 5px"}}>Copy Cpde</Button>
                <Button variant="contained" color="success" style={{margin: "0 5px"}}>Run Query</Button>
            </div>
        </div>
        
        <div className="main-iner-box" style={{height: "40%"}}>


            <div className="main-iner-title-box">
                <div className="filter-title">
                    <AccountBalanceOutlined sx={{ fontSize: 20 }} />
                    <span className="filter-title-text">Visualization</span>
                </div>

                <div className="main-iner-title-btn-box">
                    <span style={{marginRight: "20px"}}>Chart Type</span>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={10}
                        label="Age"
                        onChange={()=>{}}
                        style={{marginRight: "20px", width: "100px"}}
                        >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                    <Button variant="contained" color="success" style={{margin: "0 5px"}}>Generate Graph</Button>
                </div>
            </div>
            

            <div className="visualization-box"></div>

        </div>

      </div>

      <div className="column-box">
        
            <div className="main-iner-title-box">
                <div className="filter-title">
                    <FilterAltOutlined sx={{ fontSize: 20 }} />
                    <span className="filter-title-text">Filter</span>
                </div>

                <div className="main-iner-title-btn-box">
                    <Button variant="contained" color="error" style={{margin: "0 5px"}}>Reset</Button>
                    <Button variant="contained" color="success" style={{margin: "0 5px"}}>Run Filter</Button>
                </div>
            </div>

      </div>

    </div>
    );
}

export default Dashboard;
