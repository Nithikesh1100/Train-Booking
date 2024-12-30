// src/components/reservation/SeatGrid.js
'use client';
import React from 'react';
import { motion } from 'framer-motion';

export function SeatGrid({ seats, onSeatSelect, selectedSeats }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.2,
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 }
  };

  // Function to determine if a seat is in the last row
  const isLastRowSeat = (index) => {
    const row = Math.floor(index / 7);
    const col = index % 7;
    return row === 10 && col >= 3;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-7 gap-2 p-4"
      >
        {seats.map((seat, index) => {
          // Skip rendering seats that don't exist in the last row
          if (isLastRowSeat(index)) return null;

          return (
            <motion.button
              key={index}
              variants={item}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSeatSelect(index)}
              disabled={seat === 'X'}
              className={`
                aspect-square rounded-lg p-2
                flex items-center justify-center
                text-sm font-medium transition-colors
                ${seat === 'X' 
                  ? 'bg-red-100 text-red-800 cursor-not-allowed'
                  : selectedSeats.includes(index)
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-white hover:bg-blue-50 shadow-sm hover:shadow-md'
                }
                ${Math.floor(index / 7) === 10 ? 'col-span-1' : ''}
              `}
            >
              <div className="relative">
                <span>{index + 1}</span>
                {seat === 'X' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <span className="text-red-500">✕</span>
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </motion.div>
      
      <div className="mt-4 flex justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 rounded"></div>
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
}