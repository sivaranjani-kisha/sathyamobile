"use client";
import { useState, useEffect } from "react";

import ProductPrebook from "@/components/prebook/prebook";


export default function Dashboard() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);

  return (
    <div>
      
      <ProductPrebook /> 
    </div>
  );
}
