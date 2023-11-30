import React, { useState, useEffect } from 'react';
import StreetList from './StreetList';
import ClientForm from './ClientForm';

function App() {
  const [streets, setStreets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('api/vtest/Request/streets');
        const data = await response.json();
        setStreets(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <ClientForm updateStreets={setStreets} />

      <StreetList data={streets} />
    </div>
  );
}

export default App;
