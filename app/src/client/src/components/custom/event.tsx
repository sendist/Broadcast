import React from 'react';

interface EventProps {
  masjid: string;
}

const Event: React.FC<EventProps> = ({ masjid }) => (
  <div className="bg-green-700 text-white rounded px-2 py-1 text-sm mb-1 overflow-hidden overflow-ellipsis whitespace-nowrap">
    <span>{masjid}</span>
  </div>
);

export default Event;