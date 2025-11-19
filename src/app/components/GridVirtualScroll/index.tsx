import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

interface GridVirtualScrollProps {
  lanes: number;
}

export default function GridVirtualScroll({ lanes }: GridVirtualScrollProps) {
  const gridVirtualScrollRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useWindowVirtualizer({
    count: 10000,
    estimateSize: () => 100,
    overscan: 5,
    debug: true,
    scrollMargin: gridVirtualScrollRef.current?.offsetTop ?? 0,
  });

  return (
    <div
      ref={gridVirtualScrollRef}
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
        position: "relative",
        width: "100%",
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => (
        <div
          key={virtualRow.index}
          data-index={virtualRow.index}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100px",
            height: "100px",
            transform: `translateY(${virtualRow.start}px)`,
          }}
        >
          {virtualRow.index}
        </div>
      ))}
    </div>
  );
}
