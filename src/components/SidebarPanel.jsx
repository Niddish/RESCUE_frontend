import "../css/SidebarPanel.css";
import React from "react";


const SidebarPanel = ({ children, height = "100vh", style }) => {
  return (
    <div
      className="sidebar-panel" 
      style={{
        height, 
        ...style, 
      }}
    >
      {children}
    </div>
  );
};

export default SidebarPanel;
