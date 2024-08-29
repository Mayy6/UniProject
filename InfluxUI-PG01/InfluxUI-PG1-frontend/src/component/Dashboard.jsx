import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, TextField, Typography, Box } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./Dashboard.css";
import DragItem from "./DragItem";
import DropItem from "./DropItem";
import { useFetchedData } from "./useFetchedData";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import {
  AccountBalanceOutlined,
  SearchOutlined,
  FilterAltOutlined,
} from "@mui/icons-material";

function Dashboard() {
  const {
    buckets,
    measurements,
    tags,
    fields,
    setBuckets,
    setMeasurements,
    setTags,
    setFields,
    initialBuckets,
    initialMeasurements,
    initialTags,
    initialFields,
  } = useFetchedData();

  const [selectedBuckets, setSelectedBuckets] = useState([]);
  const [selectedMeasurements, setSelectedMeasurements] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);

  //generate code based on fetched elements
  const [generatedCode, setGeneratedCode] = useState("");

  // Drag and Drop feature
  const handleDrop = (type, item) => {
    if (type === "bucket") {
      // Ensure the bucket is not already in the selected list
      if (!selectedBuckets.includes(item.label)) {
        setSelectedBuckets((prevBuckets) => [...prevBuckets, item.label]);
        setBuckets((prevBuckets) =>
          prevBuckets.filter((bucket) => bucket !== item.label)
        );
      }
    } else if (type === "measurement") {
      if (!selectedMeasurements.includes(item.label)) {
        setSelectedMeasurements((prevMeasurements) => [
          ...prevMeasurements,
          item.label,
        ]);
        setMeasurements((prevMeasurements) =>
          prevMeasurements.filter((measurement) => measurement !== item.label)
        );
      }
    } else if (type === "tag") {
      if (!selectedTags.includes(item.label)) {
        setSelectedTags((prevTags) => [...prevTags, item.label]);
        setTags((prevTags) => prevTags.filter((tag) => tag !== item.label));
      }
    } else if (type === "field") {
      if (!selectedFields.includes(item.label)) {
        setSelectedFields((prevFields) => [...prevFields, item.label]);
        setFields((prevFields) =>
          prevFields.filter((field) => field !== item.label)
        );
      }
    }
  };

  // Clear All function
  const clearAll = () => {
    // Reset selected items and generated code
    setSelectedBuckets([]);
    setSelectedMeasurements([]);
    setSelectedTags([]);
    setSelectedFields([]);
    setGeneratedCode("");

    //Reset data
    setBuckets(initialBuckets);
    setMeasurements(initialMeasurements);
    setTags(initialTags);
    setFields(initialFields);
  };

  // Function to update the generated code
  useEffect(() => {
    const updateGeneratedCode = () => {
      let code = "";
      if (selectedBuckets && selectedBuckets.length > 0) {
        selectedBuckets.forEach((bucket) => {
          code += `from(bucket: "${bucket}")\n`;
        });
      }
      // Code for time range
      // code += "    |> range(start: -1h)\n";

      if (selectedMeasurements && selectedMeasurements.length > 0) {
        selectedMeasurements.forEach((measurement) => {
          code += `    |> filter(fn: (r) => r._measurement == "${measurement}")\n`;
        });
      }

      if (selectedTags && selectedTags.length > 0) {
        selectedTags.forEach((tag) => {
          code += `    |> filter(fn: (r) => r._tag == "${tag}")\n`;
        });
      }

      if (selectedFields && selectedFields.length > 0) {
        selectedFields.forEach((field) => {
          code += `    |> filter(fn: (r) => r._field == "${field}")\n`;
        });
      }

      setGeneratedCode(code);
    };

    updateGeneratedCode();
  }, [selectedBuckets, selectedMeasurements, selectedTags, selectedFields]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log('Username:', username);
    // console.log('Password:', password);

    try {
      const response = await axios
        .get("http://localhost:1808/api/hello")
        .then((response) => {
          if (response.status === 200) {
            const token = response.data;
            // localStorage.setItem('token', token);
            alert(token);
            // window.location.href = '/dashboard'
          }
        });
    } catch (error) {
      if (error.response && error.response.status === 403) {
        window.location.href = "/";
      } else {
        console.error("Unexpected error occurred", error);
      }
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="dashboard-container">
        {/* User Buckets */}
        <div className="user-box">
          <div className="filter-box">
            <div className="filter-title">
              <AccountBalanceOutlined sx={{ fontSize: 20 }} />
              <span className="filter-title-text">User's Buckests</span>
            </div>
            <div className="search-input">
              <input className="input-el" type="text" placeholder="Search" />
              <SearchOutlined sx={{ fontSize: 20 }} />
            </div>
            {buckets.map((bucket, index) => (
              <DragItem key={bucket} type="bucket" label={bucket} />
            ))}
          </div>

          {/* User Measurements */}
          <div className="filter-box">
            <div className="filter-title">
              <AccountBalanceOutlined sx={{ fontSize: 20 }} />
              <span className="filter-title-text">User's measurements</span>
            </div>
            <div className="search-input">
              <input className="input-el" type="text" placeholder="Search" />
              <SearchOutlined sx={{ fontSize: 20 }} />
            </div>
            {measurements.map((measurement, index) => (
              <DragItem
                key={measurement}
                type="measurement"
                label={measurement}
              />
            ))}
          </div>

          {/* User Tags */}
          <div className="filter-box">
            <div className="filter-title">
              <AccountBalanceOutlined sx={{ fontSize: 20 }} />
              <span className="filter-title-text">User's tags</span>
            </div>
            <div className="search-input">
              <input className="input-el" type="text" placeholder="Search" />
              <SearchOutlined sx={{ fontSize: 20 }} />
            </div>
            {tags.map((tag, index) => (
              <DragItem key={tag} type="tag" label={tag} />
            ))}
          </div>

          {/* User Fields */}
          <div className="filter-box">
            <div className="filter-title">
              <AccountBalanceOutlined sx={{ fontSize: 20 }} />
              <span className="filter-title-text">User's field</span>
            </div>
            <div className="search-input">
              <input className="input-el" type="text" placeholder="Search" />
              <SearchOutlined sx={{ fontSize: 20 }} />
            </div>
            {fields.map((field, index) => (
              <DragItem key={field} type="field" label={field} />
            ))}
          </div>
        </div>

        <div className="column-box">
          {/* Selected Buckets */}
          <div className="filter-box">
            <div className="filter-title">
              <AccountBalanceOutlined sx={{ fontSize: 20 }} />
              <span className="filter-title-text">Selected Buckests</span>
            </div>

            <div className="search-input">
              <input className="input-el" type="text" placeholder="Search" />
              <SearchOutlined sx={{ fontSize: 20 }} />
            </div>
            <DropItem
              acceptType="bucket"
              onDrop={(item) => handleDrop("bucket", item)}
            >
              {selectedBuckets.map((bucket, index) => (
                <div key={index}>{bucket}</div>
              ))}
            </DropItem>
          </div>

          {/* Selected Measurements */}
          <div className="filter-box">
            <div className="filter-title">
              <AccountBalanceOutlined sx={{ fontSize: 20 }} />
              <span className="filter-title-text">Selected measurement</span>
            </div>
            <div className="search-input">
              <input className="input-el" type="text" placeholder="Search" />
              <SearchOutlined sx={{ fontSize: 20 }} />
            </div>
            <DropItem
              acceptType="measurement"
              onDrop={(item) => handleDrop("measurement", item)}
            >
              {selectedMeasurements.map((measurement, index) => (
                <div key={index}>{measurement}</div>
              ))}
            </DropItem>
          </div>

          {/* Selected Tags */}
          <div className="filter-box">
            <div className="filter-title">
              <AccountBalanceOutlined sx={{ fontSize: 20 }} />
              <span className="filter-title-text">Selected tags</span>
            </div>
            <div className="search-input">
              <input className="input-el" type="text" placeholder="Search" />
              <SearchOutlined sx={{ fontSize: 20 }} />
            </div>
            <DropItem
              acceptType="tag"
              onDrop={(item) => handleDrop("tag", item)}
            >
              {selectedTags.map((tag, index) => (
                <div key={index}>{tag}</div>
              ))}
            </DropItem>
          </div>

          {/* Selected Fields */}
          <div className="filter-box">
            <div className="filter-title">
              <AccountBalanceOutlined sx={{ fontSize: 20 }} />
              <span className="filter-title-text">Selected fields</span>
            </div>
            <div className="search-input">
              <input className="input-el" type="text" placeholder="Search" />
              <SearchOutlined sx={{ fontSize: 20 }} />
            </div>
            <DropItem
              acceptType="field"
              onDrop={(item) => handleDrop("field", item)}
            >
              {selectedFields.map((field, index) => (
                <div key={index}>{field}</div>
              ))}
            </DropItem>
          </div>
        </div>

        {/* Code Generate Area */}
        <div className="column-box" style={{ width: "40%" }}>
          <div
            className="main-iner-box"
            style={{ height: "50%", marginTop: "5px" }}
          >
            <textarea
              className="text-area"
              placeholder="Write your query here"
              value={generatedCode}
              readOnly
            ></textarea>
            <div className="btn-box">
              <Button
                variant="contained"
                color="error"
                style={{ margin: "0 5px" }}
                onClick={clearAll}
              >
                Clear All
              </Button>
              <Button variant="contained" style={{ margin: "0 5px" }}>
                Copy Code
              </Button>
              <Button
                variant="contained"
                color="success"
                style={{ margin: "0 5px" }}
              >
                Run Query
              </Button>
            </div>
          </div>

          {/* Graph Area */}
          <div className="graph-box" style={{ height: "50%" }}>
            <div className="main-iner-title-box">
              <div className="filter-title">
                <AccountBalanceOutlined sx={{ fontSize: 20 }} />
                <span className="filter-title-text">Visualization</span>
              </div>

              <div className="main-iner-title-btn-box">
                <span style={{ marginRight: "20px" }}>Chart Type</span>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={10}
                  label="Age"
                  onChange={() => {}}
                  style={{ marginRight: "20px", width: "100px" }}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
                <Button
                  variant="contained"
                  color="success"
                  style={{ margin: "0 5px" }}
                >
                  Generate Graph
                </Button>
              </div>
            </div>

            <div className="visualization-box"></div>
          </div>
        </div>

        {/* Time Filter Area */}
        <div className="time-box">
          <div className="main-iner-title-box">
            <div className="filter-title">
              <FilterAltOutlined sx={{ fontSize: 20 }} />
              <span className="filter-title-text">Filter</span>
            </div>

            <div className="main-iner-title-btn-box">
              <Button
                variant="contained"
                color="error"
                style={{ margin: "0 5px" }}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                color="success"
                style={{ margin: "0 5px" }}
              >
                Run Filter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default Dashboard;
