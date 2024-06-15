import React, { useState } from 'react';
import axios from 'axios';

interface Vehicle {
  vehicle_name: string;
  vehicle_type: string;
  vehicle_description: string;
  day_rate: number;
  img: File | null;
}

const AddNewVehicle: React.FC = () => {
  const [vehicle, setVehicle] = useState<Vehicle>({
    vehicle_name: '',
    vehicle_type: '',
    vehicle_description: '',
    day_rate: 0,
    img: null,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const apiUrl = process.env.REACT_APP_API;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setVehicle({ ...vehicle, [event.target.name]: event.target.value });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageFile((prevImageFile) => event.target.files?.[0] || prevImageFile);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('vehicle_name', vehicle.vehicle_name);
    formData.append('vehicle_type', vehicle.vehicle_type);
    formData.append('vehicle_description', vehicle.vehicle_description);
    formData.append('day_rate', vehicle.day_rate.toString());
    if (imageFile) {
      console.log(imageFile);
      formData.append('img', imageFile);
    }

    try {
      const response = await axios.post(`${apiUrl}/vehicles`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      // Handle success, e.g., clear form or show success message
    } catch (error) {
      console.error(error);
      // Handle errors, e.g., display error message to user
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="vehicle_name">Vehicle Name:</label>
      <input
        type="text"
        id="vehicle_name"
        name="vehicle_name"
        value={vehicle.vehicle_name}
        onChange={handleChange}
        required
      />

      <label htmlFor="vehicle_type">Vehicle Type:</label>
      <input
        type="text"
        id="vehicle_type"
        name="vehicle_type"
        value={vehicle.vehicle_type}
        onChange={handleChange}
        required
      />

      <label htmlFor="vehicle_description">Vehicle Description:</label>
      <textarea
        id="vehicle_description"
        name="vehicle_description"
        value={vehicle.vehicle_description}
        onChange={handleChange}
        required
      />

      <label htmlFor="day_rate">Day Rate:</label>
      <input
        type="number"
        id="day_rate"
        name="day_rate"
        value={vehicle.day_rate}
        onChange={handleChange}
        required
      />

      <label htmlFor="img">Vehicle Image:</label>
      <input type="file" id="img" name="img" onChange={handleImageChange} />

      <button type="submit">Add Vehicle</button>
    </form>
  );
};

export default AddNewVehicle;