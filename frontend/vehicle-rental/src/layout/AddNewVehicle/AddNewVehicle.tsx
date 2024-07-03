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
  const defaultApiUrl = "http://vehicle-rental-service:8080";
  const apiUrl = process.env.REACT_APP_API || defaultApiUrl;
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
      const response = await axios.post(`/api/vehicles`, formData, {
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
    <form onSubmit={handleSubmit} className="row g-3 needs-validation" noValidate>
      <div className="col-md-4">
        <label htmlFor="vehicle_name" className="form-label">Vehicle Name:</label>
        <input
          type="text"
          id="vehicle_name"
          name="vehicle_name"
          className="form-control"
          value={vehicle.vehicle_name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="col-md-4">
      <label htmlFor="vehicle_type" className="form-label">Vehicle Type:</label>
      
        <input
          type="text"
          id="vehicle_type"
          name="vehicle_type"
          className="form-control"
          value={vehicle.vehicle_type}
          onChange={handleChange}
          required
        />
      </div>
      <div className="col-md-6">
      <label htmlFor="vehicle_description" className="form-label">Vehicle Description:</label>
      
        <textarea
          id="vehicle_description"
          name="vehicle_description"
          className="form-control"
          value={vehicle.vehicle_description}
          onChange={handleChange}
          required
        />
      </div>
      <div className="col-md-3">
      <label htmlFor="day_rate" className="form-label">Day Rate:</label>
      <input
        type="number"
        id="day_rate"
        name="day_rate"
        className="form-control"
        value={vehicle.day_rate}
        onChange={handleChange}
        required
      />
      </div>
      <div className="col-md-3">
      <label htmlFor="img" className="form-label">Vehicle Image:</label>
      <input type="file" id="img" name="img" className="form-control" onChange={handleImageChange} />
      </div>
      <div className="col-12">
      <button type="submit" className="btn btn-primary">Add Vehicle</button>
      </div>
    </form>
  );
};

export default AddNewVehicle;