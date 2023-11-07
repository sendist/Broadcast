import React from 'react';

interface EventProps {
  jadwal: string;
  masjid: string;
}

const Event: React.FC<EventProps> = ({ jadwal, masjid }) => (
  <div className="bg-green-700 text-white rounded px-2 py-1 text-sm mb-1 flex justify-between">
    <span className='font-bold'>{jadwal}</span>
    <span>{masjid}</span>
  </div>
);

export default Event;