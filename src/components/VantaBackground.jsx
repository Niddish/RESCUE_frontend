import React, { useEffect, useRef, useState } from "react";
import GLOBE from "vanta/dist/vanta.globe.min.js"; 
import * as THREE from "three";

const VantaBackground = () => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        GLOBE({
          el: vantaRef.current,
          THREE, 
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
 
          backgroundColor: 0xffffff,  
          color: 0xcc0033,            
          color2: 0x000000,          
          scale: 1.0,
          scaleMobile: 1.0,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div
      ref={vantaRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1, 
      }}
    />
  );
};

export default VantaBackground;
