import React, { useState, useEffect } from "react";
import SidebarPanel from "./components/SideBarPanel";
import DataParallelBar from "./components/DataParallelBar";
import ParallelismFilter from "./components/ParallelismFilter";

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
    fetch("/gpu_topology.json")
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
  }, []);

  const processNodes = (data) => {
    if (!data || !data.parallel_settings || !data.topology) return;

    const { data_parallel_size, model_parallel_size, pipe_parallel_size } = data.parallel_settings;
    const nodeEntries = Object.entries(data.topology);
    const totalNodes = nodeEntries.length;
    const totalGPUs = totalNodes * 4; 

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
            <h1 style={{
              color: "white",
              fontFamily: "Arial, sans-serif",
              fontSize: "26px",
              fontWeight: "bold",
              textAlign: "center",
            }}>
              GPU Visualization
            </h1>
          </div>
          <ParallelismFilter onChange={setSelectedParallelisms} />
        </SidebarPanel>
        <SidebarPanel style={{ height: "auto", marginTop: "10px"}}>
        <img 
            src="src/assets/ruECE.png"  
            alt="ruECE" 
            style={{ 
              width: "100%",
              marginTop: "10px",   
            }} 
          />
          </SidebarPanel>

      </div>
    
    </div>
  );
}  

export default App;
