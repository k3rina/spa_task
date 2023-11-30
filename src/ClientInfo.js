import { useState } from 'react';
import { MdClose } from 'react-icons/md';
import './App.css';

function ClientInfo({ apartment, onFlatItemClick }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [open, setOpen] = useState(false);

  const handleApartmentClick = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://dispex.org/api/vtest/HousingStock/clients?addressId=${apartment?.addressId}`
      );
      const data = await response.json();
      console.log(data, 'apartmentDetails');
      setClients(data);
    } catch (error) {
      console.error('Error fetching apartment details:', error);
    } finally {
      setLoading(false); 
    }
  };

  const handleCloseClick = async (bindid, event) => {
    try {
      const response = await fetch(
        `https://dispex.org/api/vtest/HousingStock/bind_client/${bindid}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        setClients(() => clients.filter((client) => client.bindId !== bindid));
      } else {
        console.error('Failed to delete client:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  return (
    <div style={{ marginLeft: 20, cursor: 'pointer' }} className="client-info">
      <div
        onClick={(event) => {
          event.stopPropagation();
          handleApartmentClick();
          onFlatItemClick(event);
          setOpen((prev) => !prev);
        }}
      >
        квартира {apartment?.flat}
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        open && (
          <div
            style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}
            className="client-info-list"
          >
            {clients.map((client) => (
              <div
                className="client-info-item"
                onClick={(e) => e.stopPropagation()}
                key={client.id}
                style={{
                  flex: '0 0 calc(33.33% - 20px)',
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  boxSizing: 'border-box',
                  padding: '10px',
                  margin: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                }}
              >
                <p>Жилец: {client?.name}</p>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    handleCloseClick(client?.bindId);
                  }}
                  style={{
                    backgroundColor: '#E81B1B',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <MdClose
                    style={{
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                    }}
                  />
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default ClientInfo;
