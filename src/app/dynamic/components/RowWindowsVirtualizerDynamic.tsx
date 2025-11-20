'use client'

import React from 'react'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import { faker } from '@faker-js/faker'
import './index.css'

const randomNumber = (min: number, max: number) =>
  faker.number.int({ min, max })

const rows = Array.from({ length: 400 }, () =>
  Math.floor(20 + Math.random() * 10)
);

const sentences = new Array(10000)
  .fill(true)
  .map(() => faker.lorem.sentence(randomNumber(20, 70)))

export default function RowWindowsVirtualizerDynamic() {
  const count = sentences.length
  const virtualizer = useWindowVirtualizer({
    count,
    estimateSize: () => 45,
  })

  return (
    <div className='List'>
      <div
        style={{
          height: virtualizer.getTotalSize(),
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            data-index={virtualRow.index}
            ref={virtualizer.measureElement}
            className={
              virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'
            }
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              // height: `${rows[virtualRow.index]}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <div style={{ padding: '10px 0' }}>
              <div>Row {virtualRow.index}</div>
              <div>{sentences[virtualRow.index]}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
