import React, { useState } from "react";
import "../css/ParallelismFilter.css"; 

const ParallelismFilter = ({ onChange }) => {
  const [selectedParallelisms, setSelectedParallelisms] = useState({
    data: false,
    model: false,
    pipeline: false,
  });

  const handleCheckboxChange = (type) => {
    const updatedSelection = { ...selectedParallelisms, [type]: !selectedParallelisms[type] };
    setSelectedParallelisms(updatedSelection);
    onChange(updatedSelection); 
  };

  return (
    <div className="parallelism-filter">
      <label>
        <input type="checkbox" checked={selectedParallelisms.data} onChange={() => handleCheckboxChange("data")} />
        Data Parallelism
      </label>
      <label>
        <input type="checkbox" checked={selectedParallelisms.model} onChange={() => handleCheckboxChange("model")} />
        Model Parallelism
      </label>
      <label>
        <input type="checkbox" checked={selectedParallelisms.pipeline} onChange={() => handleCheckboxChange("pipeline")} />
        Pipeline Parallelism
      </label>
    </div>
  );
};

export default ParallelismFilter;
