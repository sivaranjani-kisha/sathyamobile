"use client";
import { useState, useEffect } from "react";

import AllstoreComponent from "@/components/all-store/all-store";


export default function Dashboard() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);

  return (
    <div>
      
      <AllstoreComponent /> 
    </div>
  );
}
