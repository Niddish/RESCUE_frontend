import * as React from "react";
import Box from "@mui/material/Box";
import Node from "./Node_4_GPU";

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
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: "100%",
        height: "auto",
        maxHeight: "150px",
        backgroundColor: "#5C5555",
        overflowX: "scroll",
        overflowY: "hidden",
        whiteSpace: "nowrap",
        gap: "10px",
        marginBottom: "10px",
        "&::-webkit-scrollbar": { height: "8px" },
        "&::-webkit-scrollbar-track": { background: "#5C5555", borderRadius: "10px" },
        "&::-webkit-scrollbar-thumb": {
          background: "linear-gradient(180deg,rgb(160, 152, 152),rgb(90, 100, 100))",
          borderRadius: "10px"
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "linear-gradient(180deg,rgb(160, 152, 152),rgb(90, 100, 100))"
        }
      }}
    >
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
