import React, { useEffect, useState } from 'react';
import FlatItem from './FlatItem';
import './App.css';

function StreetItem({ item }) {
  const [isOpen, setIsOpen] = useState(false);
  const [houses, setHouses] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [selectedFlat, setSelectedFlat] = useState(null);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await fetch(`api/vtest/Request/houses/${item.id}`);
        const data = await response.json();
        setHouses(data);
      } catch (error) {
        console.error('Error fetching houses:', error);
      }
    };

    if (isOpen) {
      fetchHouses();
    }
  }, [isOpen, item.id]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setSelectedHouse(null);
    setSelectedFlat(null);
  };

  const handleHouseClick = (house, event) => {
    event.stopPropagation();
    setSelectedHouse((prevSelectedHouse) =>
      prevSelectedHouse === house ? null : house
    );
    setSelectedFlat(null);
  };

  const handleFlatItemClick = (event, apartment) => {
    event.stopPropagation();

    console.log('Flat item clicked:', apartment);
  };

  return (
    <div>
      <div className="street-item" onClick={handleToggle}>
        {item?.prefix?.shortName} {item?.name}
      </div>
      {isOpen && houses && (
        <div style={{ marginLeft: 20 }}>
          {houses.map((house) => (
            <div
              key={house.id}
              onClick={(event) => handleHouseClick(house, event)}
              className="street-item"
              style={{ marginLeft: 20 }}
            >
              {item?.prefix?.shortName} {item?.name} {house.name}
              <div style={{ marginLeft: 20 }}>
                {selectedHouse === house && (
                  <FlatItem
                    house={house}
                    item={item}
                    onFlatItemClick={(event) =>
                      handleFlatItemClick(event, house)
                    }
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StreetItem;
