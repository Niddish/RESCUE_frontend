import * as React from "react";
import Box from "@mui/material/Box";
import Node from "./Node_4_GPU";
import "../css/DataParallelBar.css"; 

export default function DataParallelBar({ nodesForRow, gpuList, selectedParallelisms, showPlaceholderGPUs }) {
  const [hoveredGPU, setHoveredGPU] = React.useState(null);

  const filteredNodesForRow = showPlaceholderGPUs
    ? nodesForRow
    : nodesForRow.filter(([nodeName, gpus]) => {
        return gpus.some(gpuData => {
          const isNoData =
            !gpuData ||
            !gpuData.info ||
            !gpuData.id ||
            (typeof gpuData.id === "string" && gpuData.id.toLowerCase().includes("no data")) ||
            (typeof nodeName === "string" && nodeName.toLowerCase().includes("not detected"));
          return !isNoData;
        });
      });

  if (filteredNodesForRow.length === 0) return null;

  return (
    <Box className="scrollContainer">
      {filteredNodesForRow.map(([nodeName, gpus], index) => (
        <Node
          key={index}
          nodeName={nodeName}
          gpus={gpus}
          gpuList={gpuList}
          hoveredGPU={hoveredGPU}
          setHoveredGPU={setHoveredGPU}
          selectedParallelisms={selectedParallelisms}
          showPlaceholderGPUs={showPlaceholderGPUs} 
        />
      ))}
    </Box>
  );
}
