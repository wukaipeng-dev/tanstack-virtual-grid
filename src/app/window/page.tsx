"use client";

import * as React from "react";

import "./index.css";

import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useInfiniteQuery } from "@tanstack/react-query";

async function fetchServerPage(
  limit: number,
  offset: number = 0,
): Promise<{ rows: Array<string>; nextOffset: number }> {
  const rows = new Array(limit)
    .fill(0)
    .map((_, i) => `Async loaded row #${i + offset * limit}`);

  await new Promise((r) => setTimeout(r, 500));

  return { rows, nextOffset: offset + 1 };
}

function Example() {
  const listRef = React.useRef<HTMLDivElement | null>(null);

  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["projects"],
    queryFn: (ctx) => fetchServerPage(10, ctx.pageParam),
    getNextPageParam: (lastGroup) => lastGroup.nextOffset,
    initialPageParam: 0,
  });

  const allRows = data ? data.pages.flatMap((d) => d.rows) : [];

  const rowVirtualizer = useWindowVirtualizer({
    count: 10000,
    estimateSize: () => 35,
    overscan: 5,
    scrollMargin: listRef.current?.offsetTop ?? 0,
  });

  console.log('scrollMargin', listRef.current?.offsetTop);

  React.useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= allRows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allRows.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  return (
    <>
      <div ref={listRef} className="List">
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const isLoaderRow = virtualRow.index > allRows.length - 1;
            const post = allRows[virtualRow.index];

            return (
              <div
                key={virtualRow.index}
                className={
                  virtualRow.index % 2 ? "ListItemOdd" : "ListItemEven"
                }
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  // transform: `translateY(${virtualRow.start}px)`,
                  transform: `translateY(${
                    virtualRow.start - rowVirtualizer.options.scrollMargin
                  }px)`,
                }}
              >
                {isLoaderRow
                  ? hasNextPage
                    ? "Loading more..."
                    : "Nothing more to load"
                  : post}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default function Window() {
  return (
    <div>
      <p>
        In many cases, when implementing a virtualizer with a window as the
        scrolling element, developers often find the need to specify a
        "scrollMargin." The scroll margin is a crucial setting that defines the
        space or gap between the start of the page and the edges of the list.
      </p>
      <br />
      <br />
      <h3>Window scroller</h3>
      <Example />
      <br />
      <br />
      {process.env.NODE_ENV === "development" ? (
        <p>
          <strong>Notice:</strong> You are currently running React in
          development mode. Rendering performance will be slightly degraded
          until this application is built for production.
        </p>
      ) : null}
    </div>
  );
}
