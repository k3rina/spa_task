import { useState } from 'react';

const AddTenantForm = ({ updateStreets }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [apartmentId, setApartmentId] = useState(0);

  const [phoneError, setPhoneError] = useState('');
  const [err, setErr] = useState('');
  const [apartmentIdError, setApartmentIdError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name || !phone || !email || apartmentId <= 0) {
      setErr('Please fill in all fields with valid data.');
      return;
    }
    if (!/^[+\d]{3,}$/.test(phone)) {
      setPhoneError('Phone is not valid.');
      return;
    }

    if (!/^\d{6,}$/.test(apartmentId)) {
      setApartmentIdError('Apartment ID is not valid.');
      return;
    }

    try {
      const tenantResponse = await fetch(
        'https://dispex.org/api/vtest/HousingStock/client',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Id: 0,
            Name: name,
            Phone: phone,
            Email: email,
            BindId: 0,
          }),
        }
      );

      if (!tenantResponse.ok) {
        throw new Error(`Error adding tenant: ${tenantResponse.statusText}`);
      }

      const tenantResult = await tenantResponse.json();
      console.log('Tenant added successfully. Tenant Result:', tenantResult);

      const bindResponse = await fetch('/api/vtest/HousingStock/bind_client', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ClientId: tenantResult?.id,
          AddressId: apartmentId,
        }),
      });

      console.log('Bind Response:', bindResponse);

      if (!bindResponse.ok) {
        const errorText = await bindResponse.text();
        throw new Error(`Error binding client to apartment: ${errorText}`);
      }

      console.log('Bind Response:', bindResponse);

      const streetsResponse = await fetch('api/vtest/Request/streets');
      const streetsData = await streetsResponse.json();
      updateStreets(streetsData);

      setName('');
      setPhone('');
      setEmail('');
      setApartmentId(0);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      if (error instanceof Error && error.message) {
        console.error('Error message:', error.message);
      } else {
        console.error('Full error object:', error);
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <label htmlFor="name" style={{ marginBottom: '8px' }}>
          Имя:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ marginBottom: '16px', padding: '8px' }}
        />

        <label htmlFor="phone" style={{ marginBottom: '8px' }}>
          Телефон:
        </label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          style={{ marginBottom: '16px', padding: '8px' }}
        />

        <label htmlFor="email" style={{ marginBottom: '8px' }}>
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ marginBottom: '16px', padding: '8px' }}
        />

        <label htmlFor="apartmentId" style={{ marginBottom: '8px' }}>
          Apartment ID:
        </label>
        <input
          type="number"
          id="apartmentId"
          name="apartmentId"
          value={apartmentId}
          onChange={(e) => setApartmentId(e.target.value)}
          required
          style={{ marginBottom: '20px', padding: '8px' }}
        />
        <p style={{ color: 'red', marginBottom: '8px' }}>
          {err || apartmentIdError || phoneError}
        </p>
        <button
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',

            marginBottom: '40px',
          }}
        >
          Добавить жильца
        </button>
      </form>
    </div>
  );
};

export default AddTenantForm;
