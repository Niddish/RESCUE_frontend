import React, { useState, useEffect } from "react";
import SidebarPanel from "./components/SideBarPanel";
import DataParallelBar from "./components/DataParallelBar";
import ParallelismFilter from "./components/ParallelismFilter";
import SettingsVisualizer from "./components/SettingsVisualizer";

//ENDPOINT TO BE UPDATED
const API_ENDPOINT = "YOUR ENDPOINT HERE";

const App = () => {
  const [gpuTopology, setGpuTopology] = useState(null);
  const [nodeRows, setNodeRows] = useState([]);
  const [gpuList, setGpuList] = useState([]);
  const [selectedParallelisms, setSelectedParallelisms] = useState({
    data: false,
    model: false,
    pipeline: false,
  });

  useEffect(() => {
    const fetchData = () => {
      fetch(API_ENDPOINT + '?t=' + Date.now(), { cache: "no-cache" })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to load GPU topology JSON");
          }
          return response.json();
        })
        .then(data => {
          setGpuTopology(data);
          processNodes(data);
        })
        .catch(error => console.error("Error loading GPU topology:", error));
    };
  
    //fetch immediately and then every 5 seconds
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);
  const processNodes = (data) => {
    if (!data || !data.parallel_settings || !data.topology) return;

    const { data_parallel_size, model_parallel_size, pipe_parallel_size } = data.parallel_settings;
    const nodeEntries = Object.entries(data.topology);
    const totalNodes = nodeEntries.length;
    const totalGPUs = totalNodes * 4; //assuming 4 GPUs per node

    const nodesPerRow = totalNodes / data_parallel_size;
    const rows = [];
    let globalGpuIndex = 0;
    let fullGpuList = [];

    for (let i = 0; i < totalNodes; i += nodesPerRow) {
      const rowNodes = nodeEntries.slice(i, i + nodesPerRow);

      rowNodes.forEach(([nodeName, gpus]) => {
        gpus.forEach((gpu) => {
          gpu.info = gpu.info || {};
          gpu.info.globalIndex = globalGpuIndex++;

          gpu.info.parallelism = {
            data: `DP-${Math.floor(gpu.info.globalIndex / (totalGPUs / data_parallel_size))}`,
            model: `MP-${Math.floor(gpu.info.globalIndex % data_parallel_size / model_parallel_size)}`,
            pipeline: `PP-${Math.floor(gpu.info.globalIndex % data_parallel_size / pipe_parallel_size)}`,
          };

          fullGpuList.push({
            nodeName,
            gpuData: gpu.info,
            globalIndex: gpu.info.globalIndex,
          });
        });
      });

      rows.push(rowNodes);
    }

    setGpuList(fullGpuList);
    setNodeRows(rows);
  };

  if (!gpuTopology) {
    return <div>Loading GPU data...</div>;
  }

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f0ebeb" }}>
      <SidebarPanel>
        {nodeRows.map((nodesForRow, i) => (
          <DataParallelBar
            key={i}
            nodesForRow={nodesForRow}
            gpuList={gpuList}
            selectedParallelisms={selectedParallelisms}
          />
        ))}
      </SidebarPanel>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SidebarPanel style={{ height: "25vh" }}>
          <div style={{ flex: 1 }}>
            <h1
              style={{
                color: "white",
                fontFamily: "Arial, sans-serif",
                fontSize: "26px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Topology Visualization
            </h1>
          </div>
          <ParallelismFilter onChange={setSelectedParallelisms} />
        </SidebarPanel>
        <div style={{ display: "flex" }}>
        <SidebarPanel style={{ height: "auto", marginTop: "10px" , width: "16vw" }}>
          <img 
            src="src/assets/ruECE.png"  
            alt="ruECE" 
            style={{ 
              width: "100%",
              marginTop: "10px",   
            }} 
          />
        </SidebarPanel>
        <SidebarPanel style={{ height: "auto", marginTop: "10px" , width: "16vw" }}>
          <div style={{ flex: 1 }}>
            <h1
              style={{
                color: "white",
                fontFamily: "Arial, sans-serif",
                fontSize: "26px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Settings/Statistics
            </h1>
          </div>
          <SettingsVisualizer gpuTopology={gpuTopology} apiEndpoint={API_ENDPOINT} />
        </SidebarPanel>
        </div>
      </div>
    </div>
  );
};

export default App;
