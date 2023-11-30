import React from 'react';
import StreetItem from './StreetItem';

function StreetList({ data }) {
  return (
    <div>
      {data.map((street) => (
        <StreetItem key={street.id} item={street} />
      ))}
    </div>
  );
}

export default StreetList;
