"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

// Generate sample data
const generateData = (rows: number, cols: number) => {
  return Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: cols }, (_, colIndex) => ({
      id: `${rowIndex}-${colIndex}`,
      row: rowIndex,
      col: colIndex,
      value: `R${rowIndex}C${colIndex}`,
    }))
  );
};

const ROW_COUNT = 1000;
const COL_COUNT = 20;
const ROW_HEIGHT = 50;
const COL_WIDTH = 150;

export default function Home() {
  const parentRef = useRef<HTMLDivElement>(null);
  const data = generateData(ROW_COUNT, COL_COUNT);

  const rowVirtualizer = useVirtualizer({
    count: ROW_COUNT,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
  });

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-2xl font-bold text-black dark:text-zinc-50">
          TanStack Virtual Grid Example
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {ROW_COUNT.toLocaleString()} rows × {COL_COUNT} columns
        </p>
      </header>

      <div
        ref={parentRef}
        className="flex-1 overflow-auto"
        style={{ height: "calc(100vh - 100px)" }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: `${COL_COUNT * COL_WIDTH}px`,
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = data[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className="flex border-b border-zinc-200 dark:border-zinc-800">
                  {row.map((cell) => (
                    <div
                      key={cell.id}
                      className="flex items-center border-r border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
                      style={{
                        width: COL_WIDTH,
                        height: ROW_HEIGHT,
                      }}
                    >
                      <span className="truncate">{cell.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
