import React, { useState, useEffect } from 'react';
import ClientInfo from './ClientInfo';
import './App.css';

function FlatItem({ item, onFlatItemClick }) {
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const response = await fetch(
          `api/vtest/HousingStock?streetId=${item?.id}`
        );
        const data = await response.json();
        console.log(data, 'datahouse');
        setApartments(data);
      } catch (error) {
        console.error('Error fetching apartments:', error);
      }
    };

    fetchApartments();
  }, [item?.id]);

  return (
    <div style={{ marginLeft: 20 }}>
      {apartments &&
        apartments.map((apartment) => (
          <ClientInfo
            key={apartment.id}
            apartment={apartment}
            onFlatItemClick={onFlatItemClick}
          />
        ))}
    </div>
  );
}

export default FlatItem;
