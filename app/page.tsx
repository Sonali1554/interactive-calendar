"use client";
import { useState, useEffect } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  addMonths,
  subMonths,
} from "date-fns";

export default function Home() {
  // Date range
  const [range, setRange] = useState<{
    start: number | null;
    end: number | null;
  }>({
    start: null,
    end: null,
  });

  // Notes
  const [note, setNote] = useState("");

  // Current month
  const [currentDate, setCurrentDate] = useState(new Date());

  // Load notes
  useEffect(() => {
    const savedNote = localStorage.getItem("note");
    if (savedNote) setNote(savedNote);
  }, []);

  // Save notes
  useEffect(() => {
    localStorage.setItem("note", note);
  }, [note]);

  // Handle date selection
  const handleSelect = (day: number) => {
    if (!range.start || range.end) {
      setRange({ start: day, end: null });
    } else {
      if (day < range.start) {
        setRange({ start: day, end: range.start });
      } else {
        setRange({ start: range.start, end: day });
      }
    }
  };

  // Month navigation
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  // Generate calendar
  const startMonth = startOfMonth(currentDate);
  const endMonth = endOfMonth(currentDate);

  const startDate = startOfWeek(startMonth);
  const endDate = endOfWeek(endMonth);

  const days = [];
  let day = startDate;

  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-xl w-[350px] md:w-[750px] overflow-hidden">
        
        {/* HERO SECTION */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
            className="w-full h-48 object-cover"
          />

          <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-3 flex items-center gap-2">
            
            <button
              onClick={prevMonth}
              className="px-2 py-1 bg-white text-blue-500 rounded hover:bg-gray-200"
            >
              ←
            </button>

            <div className="text-center">
              <h2>{format(currentDate, "yyyy")}</h2>
              <h1 className="text-lg font-bold">
                {format(currentDate, "MMMM")}
              </h1>
            </div>

            <button
              onClick={nextMonth}
              className="px-2 py-1 bg-white text-blue-500 rounded hover:bg-gray-200"
            >
              →
            </button>

          </div>
        </div>

        {/* CONTENT */}
        <div className="grid md:grid-cols-2 gap-4 p-4">
          
          {/* NOTES */}
          <div>
            <h3 className="font-semibold mb-2">Notes</h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write notes..."
              className="w-full h-40 border p-2 rounded"
            />
          </div>

          {/* CALENDAR */}
          <div>
            <h3 className="font-semibold mb-2">Calendar</h3>

            {/* Week Days */}
            <div className="grid grid-cols-7 mb-2 text-sm font-semibold text-center">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (d) => (
                  <div key={d}>{d}</div>
                )
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, i) => {
                const formattedDay = format(day, "d");
                const dayNumber = parseInt(formattedDay);

                const isStart = range.start === dayNumber;
                const isEnd = range.end === dayNumber;
                const isInRange =
                  range.start &&
                  range.end &&
                  dayNumber > range.start &&
                  dayNumber < range.end;

                const isCurrentMonth =
                  format(day, "MM") === format(currentDate, "MM");

                return (
                  <div
                    key={i}
                    onClick={() =>
                      isCurrentMonth && handleSelect(dayNumber)
                    }
                    className={`p-2 text-center rounded cursor-pointer text-sm
                      ${!isCurrentMonth ? "text-gray-400" : ""}
                      ${isStart || isEnd ? "bg-blue-600 text-white" : ""}
                      ${isInRange ? "bg-blue-300" : ""}
                      ${
                        !isStart &&
                        !isEnd &&
                        !isInRange &&
                        isCurrentMonth
                          ? "bg-gray-200 hover:bg-blue-200"
                          : ""
                      }
                    `}
                  >
                    {formattedDay}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}