"use client";
import { useState, useEffect } from "react";

import FilterComponent from "../../admin/components/filter/filter_july1";


export default function Dashboard() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);

  return (
    <div>
      
      <FilterComponent /> {/* Use the category component here */}
    </div>
  );
}
