'use client'

import React from 'react'

export function CautionTape() {
  const tapeText = [
    'HACK 2027',
    '\u2022',
    'INNOVATION ZONE',
    '\u2022',
    '24-HOUR HACKATHON',
    '\u2022',
    'BUILD THE FUTURE',
    '\u2022',
    'DO NOT CROSS',
    '\u2022',
    'SIMATS ENGINEERING',
    '\u2022',
    'LIMITLESS INNOVATION',
    '\u2022',
  ]

  // Duplicate items 4 times to ensure seamless infinite looping on ultra-wide screens
  const fullTape = [...tapeText, ...tapeText, ...tapeText, ...tapeText]

  return (
    <div className="caution-tape-wrapper" aria-hidden="true">
      <div className="caution-tape-track">
        <div className="caution-tape-content">
          {fullTape.map((item, idx) => (
            <span
              key={`tape-1-${idx}`}
              className={
                item === '\u2022'
                  ? 'tape-bullet'
                  : item === 'HACK 2027' || item === 'DO NOT CROSS'
                    ? 'tape-highlight'
                    : 'tape-text'
              }
            >
              {item}
            </span>
          ))}
        </div>
        <div className="caution-tape-content" aria-hidden="true">
          {fullTape.map((item, idx) => (
            <span
              key={`tape-2-${idx}`}
              className={
                item === '\u2022'
                  ? 'tape-bullet'
                  : item === 'HACK 2027' || item === 'DO NOT CROSS'
                    ? 'tape-highlight'
                    : 'tape-text'
              }
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
