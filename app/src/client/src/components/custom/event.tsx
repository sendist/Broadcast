import React from 'react';

interface EventProps {
  masjid: string;
}

const Event: React.FC<EventProps> = ({ masjid }) => (
  <div className="bg-green-700 text-white rounded px-1 md:px-2 md:py-1 text-[8px] sm:text-xs md:text-base mb-1 overflow-hidden overflow-ellipsis whitespace-nowrap">
    <span>{masjid}</span>
  </div>
);

export default Event;