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
<<<<<<< Updated upstream
=======
    const { buckets, measurements, fields, setBuckets, setMeasurements, setFields, initialBuckets, initialMeasurements, initialFields } = useFetchedData();

    const [selectedBuckets, setSelectedBuckets] = useState([]);
    const [selectedMeasurements, setSelectedMeasurements] = useState([]);
    const [selectedFields, setSelectedFields] = useState([]);
    const [visualizationData, setVisualizationData] = useState(null);

    //generate code based on fetched elements
    const [generatedCode, setGeneratedCode] = useState("");

    // Drag and Drop feature
    const handleDrop = (type, item) => {
        if (type === 'bucket') {
            // Ensure the bucket is not already in the selected list
            if (!selectedBuckets.includes(item.label)) {
                setSelectedBuckets(prevBuckets => [...prevBuckets, item.label]);
                setBuckets(prevBuckets => prevBuckets.filter(bucket => bucket !== item.label));
            }
        } else if (type === 'measurement') {
            if (!selectedMeasurements.includes(item.label)) {
                setSelectedMeasurements(prevMeasurements => [...prevMeasurements, item.label]);
                setMeasurements(prevMeasurements => prevMeasurements.filter(measurement => measurement !== item.label));
            }
        } else if (type === 'field') {
            if (!selectedFields.includes(item.label)) {
                setSelectedFields(prevFields => [...prevFields, item.label]);
                setFields(prevFields => prevFields.filter(field => field !== item.label));
            }
        }
    };

    // Clear All function
    const clearAll = () => {
        // Reset selected items and generated code
        setSelectedBuckets([]);
        setSelectedMeasurements([]);
        setSelectedFields([]);
        setGeneratedCode("");

        //Reset data
        setBuckets(initialBuckets);
        setMeasurements(initialMeasurements);
        setFields(initialFields);
    }

    // Function to update the generated code
    useEffect(() => {
        const updateGeneratedCode = () => {
            let code = "";
            if (selectedBuckets && selectedBuckets.length > 0) {
                selectedBuckets.forEach(bucket => {
                    code += `from(bucket: "${bucket}")\n`;
                });
            }
            // Code for time range
            // code += "    |> range(start: -1h)\n";

            if (selectedMeasurements && selectedMeasurements.length > 0) {
                selectedMeasurements.forEach(measurement => {
                    code += `    |> filter(fn: (r) => r._measurement == "${measurement}")\n`;
                });
            }

            if (selectedFields && selectedFields.length > 0) {
                selectedFields.forEach(field => {
                    code += `    |> filter(fn: (r) => r._field == "${field}")\n`;
                });
            }

            setGeneratedCode(code);
        };

        updateGeneratedCode();

    }, [selectedBuckets, selectedMeasurements, selectedFields]);

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======

    const runQuery = async () => {
        try {
            await handleSubmit();

            const dataToSend = {
                buckets: selectedBuckets,
                measurements: selectedMeasurements,
                fields: selectedFields,
                query: generatedCode
            };

            const response = await axios.post("http://localhost:1808/api/runQuery", dataToSend);
            if (response.status === 200) {
                setVisualizationData(response.data);
            }
        } catch (error) {
            console.error("Error running query", error);
        }
    };

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                <Button variant="contained" color="error" style={{margin: "0 5px"}}>Clear All</Button>
                <Button variant="contained" style={{margin: "0 5px"}}>Copy Cpde</Button>
                <Button variant="contained" color="success" style={{margin: "0 5px"}}>Run Query</Button>
=======
                <Button variant="contained" color="error" style={{margin: "0 5px"}} onClick={clearAll}>Clear All</Button>
                <Button variant="contained" style={{margin: "0 5px"}}>Copy Code</Button>
                <Button variant="contained" color="success" style={{margin: "0 5px"}} onClick={runQuery}>Run Query</Button>
>>>>>>> Stashed changes
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
