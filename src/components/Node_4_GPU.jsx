import { Box, Tooltip } from "@mui/material";
import React from "react";
import gpu from "../assets/gpu.png";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; 
import "tippy.js/animations/scale.css"; 

function getHighlightStyles(currentGPUInfo, hoveredGPUInfo, selectedParallelisms) {
  if (!hoveredGPUInfo) return {};

  const { data: dp, model: mp, pipeline: pp } = currentGPUInfo.parallelism || {};
  const { data: hdp, model: hmp, pipeline: hpp } = hoveredGPUInfo.parallelism || {};

  const boxShadows = [];
  let brightness = 1.0;

  if (currentGPUInfo.globalIndex === hoveredGPUInfo.globalIndex) {
    boxShadows.push("0 0 6px 3px black");
    brightness = 1.5;
  }

  if (selectedParallelisms.data && dp && dp === hdp) {
    boxShadows.push("0 0 8px 2px red");
    brightness = Math.max(brightness, 1.4);
  }

  if (selectedParallelisms.model && mp && mp === hmp) {
    boxShadows.push("0 0 8px 2px red");
    brightness = Math.max(brightness, 1.4);
  }

  if (selectedParallelisms.pipeline && pp && pp === hpp) {
    boxShadows.push("0 0 8px 2px red");
    brightness = Math.max(brightness, 1.4);
  }

  if (boxShadows.length === 0) {
    return {};
  }

  return {
    boxShadow: boxShadows.join(", "),
    filter: `brightness(${brightness})`,
    transition: "filter 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  };
}

const Node = ({
  nodeName,
  gpus = [],
  hoveredGPU,
  setHoveredGPU,
  selectedParallelisms,
  showPlaceholderGPUs    
}) => {
  return (
    <Box display="flex" justifyContent="center" width="100%">
      <Box
        bgcolor="white"
        border={8}
        borderColor="black"
        width={126}
        height={126}
        position="relative"
      >
        {gpus.map((gpuData, index) => {
          const info = gpuData.info || {};
          const {
            globalIndex,
            name,
            id,
            memory_used_MB,
            memory_total_MB,
            utilization_pct,
            temperature_C,
            clock_rate_MHz,
          } = info;

          const isNoData =
            !gpuData ||
            !gpuData.info ||
            !gpuData.id ||
            (typeof gpuData.id === "string" &&
              gpuData.id.toLowerCase().includes("no data")) ||
            (typeof nodeName === "string" &&
              nodeName.toLowerCase().includes("not detected"));

          //if we're not showing placeholders, skip rendering GPUs with no data
          if (!showPlaceholderGPUs && isNoData) {
            return null;
          }

          const highlightStyles = isNoData
            ? {}
            : getHighlightStyles(info, hoveredGPU, selectedParallelisms);

          return (
            <Tippy
              key={index}
              content={
                isNoData ? (
                  <div style={{ fontFamily: "Arial, sans-serif", fontSize: "14px" }}>
                    GPU not detected
                  </div>
                ) : (
                  <div
                    style={{
                      fontFamily: "Arial, sans-serif",
                      textAlign: "left",
                      fontSize: "14px",
                    }}
                  >
                    <strong>{name}</strong> (ID: {id}) <br />
                    Memory: {memory_used_MB}MB / {memory_total_MB}MB <br />
                    Utilization: {utilization_pct}% <br />
                    Temp: {temperature_C}°C <br />
                    Clock Rate: {clock_rate_MHz} MHz <br />
                    Node: {nodeName}
                  </div>
                )
              }
              animation="scale"
              placement="top"
              arrow={true}
              theme="light-border"
            >
              <Box
                component="img"
                src={gpu}
                alt="Gpu"
                position="absolute"
                top={index < 2 ? 13 : 63}
                left={index % 2 === 0 ? 13 : 63}
                width={50}
                height={50}
                onMouseEnter={() => {
                  if (!isNoData) {
                    setHoveredGPU(info);
                  }
                }}
                onMouseLeave={() => {
                  setHoveredGPU(null);
                }}
                sx={{
                  objectFit: "cover",
                  cursor: isNoData ? "default" : "pointer",
                  opacity: isNoData ? 0.3 : 1,
                  ...highlightStyles,
                }}
              />
            </Tippy>
          );
        })}
      </Box>
    </Box>
  );
};

export default Node;
