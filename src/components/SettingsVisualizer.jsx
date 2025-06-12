import React, { useState, useEffect } from "react";
import "../css/settingsvisualizer.css";

const SettingsVisualizer = ({
  gpuTopology,
  apiEndpoint,
  refreshInterval = 5,
  showPlaceholderGPUs,       
  setShowPlaceholderGPUs    
}) => {
  const [countdown, setCountdown] = useState(refreshInterval);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev <= 1 ? refreshInterval : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [refreshInterval]);

  let totalUsage = 0;
  let count = 0;
  if (gpuTopology && gpuTopology.topology) {
    Object.values(gpuTopology.topology).forEach(gpuArray => {
      gpuArray.forEach(gpu => {
        if (gpu.info && typeof gpu.info.utilization_pct === "number") {
          totalUsage += gpu.info.utilization_pct;
          count++;
        }
      });
    });
  }
  const averageUsage = count > 0 ? (totalUsage / count).toFixed(2) : "N/A";

  return (
    <div className="settings-visualizer">
      <div className="setting-item">
        <span className="setting-label">Refresh Countdown:</span> {countdown} second{countdown !== 1 ? "s" : ""}
      </div>
      <div className="setting-item">
        <span className="setting-label">Average GPU Usage:</span> {averageUsage}%
      </div>
      <div className="setting-item">
        <span className="setting-label">Data Source URL:</span> {apiEndpoint}
      </div>
      <div className="setting-item">
        <label>
          <input
            type="checkbox"
            checked={showPlaceholderGPUs}
            onChange={(e) => setShowPlaceholderGPUs(e.target.checked)}
          />
          Show Placeholder GPUs
        </label>
      </div>
    </div>
  );
};

export default SettingsVisualizer;
