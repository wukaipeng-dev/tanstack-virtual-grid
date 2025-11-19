'use client'

import { useState } from "react";
import GridVirtualScroll from "../GridVirtualScroll";

export default function Portfolio() {
  const [lanes, setLanes] = useState(4);

  return (
    <GridVirtualScroll lanes={lanes} />
  );
}