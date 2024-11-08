import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import React, { useState } from 'react';
import DragDropPage from './DragDropPage';
import { Box, Typography } from '@mui/material';
import CodeArea from './CodeArea';
import axios from "axios";

const DashboardNew = () => {
    const name = localStorage.getItem("name")
    if (!name) {
        window.location.href = '/'
    }
    const [grafanaUrl, setGrafanaUrl] = useState("");
    const [showGraph, setShowGraph] = useState(false);
    const handleFirstAction = (query) => {
        console.log(query)
        const submit = query;
        try {
            axios.post("http://localhost:1808/api/query/grafana", {
                submit
            })
                .then(response => {
                    if (response.status === 200) {
                        console.log(response);
                        setShowGraph(true);
                        const uniqueParam = `&uniqParam=${Date.now()}`;  // 创建一个基于当前时间的唯一参数
                        setGrafanaUrl(response.data + uniqueParam);
                    }
                })
        } catch (error) {
            console.log("no")
        }
    };
    const handleSecondAction = () => {
        console.log("second")
    };
  return (
    <DndProvider backend={HTML5Backend}>
      <Box 
        style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          height: 'calc(100vh - 60px)',
          overflow: 'hidden' 
        }}
      >
        <Box 
          style={{
            flexBasis: '40%',
            padding: '10px', 
            borderRight: '1px solid #ccc', 
            overflowY: 'scroll', 
            maxHeight: '100%' 
          }}
        >
          <DragDropPage onQueryAction={handleFirstAction} onSecondAction={handleSecondAction}/>
        </Box>

        <Box 
          style={{ 
            flexBasis: '60%',  
            display: 'flex', 
            flexDirection: 'column', 
            padding: '10px', 
          }}
        >
            <Box
                style={{
                    flexBasis: '50%',
                    padding: '10px',
                    borderBottom: '1px solid #ccc',
                }}
            >
                <Typography variant="h6">Graph Area</Typography>
                {showGraph ? (
                    <iframe src={grafanaUrl}
                    width="100%" height="90%"></iframe>
                ) : (
                    <p>hello my friend!</p>
                )}

            </Box>

            <Box
                style={{
                    flexBasis: '50%',
                    padding: '10px',
                }}
            >
                <CodeArea/>
            </Box>
        </Box>
      </Box>
    </DndProvider>
  );
};

export default DashboardNew;
