import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useOktaAuth } from '@okta/okta-react';
import { CustomUserClaims, UserClaims } from '@okta/okta-auth-js';
import { useNavigate } from 'react-router-dom';

interface Vehicle {
  vehicle_name: string;
  vehicle_type: string;
  vehicle_description: string;
  day_rate: number;
  img: File | null;
}

const AddNewVehicle: React.FC = () => {

  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState<UserClaims<CustomUserClaims> | null>(null);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle>({
    vehicle_name: '',
    vehicle_type: '',
    vehicle_description: '',
    day_rate: 0,
    img: null,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    console.log(authState, oktaAuth)
    if (!authState || !authState.isAuthenticated) {
      // When user isn't authenticated, forget any user info
      setUserInfo(null);
    } else {

      oktaAuth.token.getUserInfo().then(info => {
        console.log(info)
        setUserInfo(info);
      }).catch((err) => {
        console.error(err);
      });
    }
  }, [authState, oktaAuth]);


  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setVehicle({ ...vehicle, [event.target.name]: event.target.value });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageFile((prevImageFile) => event.target.files?.[0] || prevImageFile);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(authState!==null) {
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
      const response = await axios.post(`/api/vehicles?user_email=${userInfo?.email}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authState.accessToken?.accessToken}`
        },
      });
      console.log(response.data);
      // Handle success, e.g., clear form or show success message
      setAlertMessage({ type: 'success', message: 'Vehicle added successfully' });
      // Clear form
      setVehicle({
        vehicle_name: '',
        vehicle_type: '',
        vehicle_description: '',
        day_rate: 0,
        img: null,
      });
      setImageFile(null);
    } catch (error) {
      console.error(error);
      setAlertMessage({ type: 'danger', message: 'Failed to add vehicle. Please try again.' });
      // Handle errors, e.g., display error message to user
    }
  }
  };

  if (authState?.accessToken?.claims.userType === undefined) {
    navigate("/home");
  }

  return (
    <section data-bs-version="5.1" className="form6 cid-uhCi1uTZNI" id="form6-7">

      <div className="mbr-overlay"></div>
      <div className="container">
        <div className="mbr-section-head">
          <h3 className="mbr-section-title mbr-fonts-style align-center mb-0 display-2">
            <strong>Add New Vehicle</strong>
          </h3>
          <h4 className="mbr-section-subtitle mbr-fonts-style align-center mb-0 mt-2 display-5">
            Register new vehicles here
          </h4>
        </div>
        <div className="row justify-content-center mt-4">
          <div className="col-lg-8 mx-auto mbr-form">
          {alertMessage && (
              <div className={`alert alert-${alertMessage.type}`} role="alert">
                {alertMessage.message}
              </div>
            )}
            <form onSubmit={handleSubmit} className="mbr-form form-with-styler mx-auto" noValidate>
              
              <div className="dragArea row">
              <div className="col-lg-12 col-md-12 col-sm-12 form-group mb-3" data-for="vehicle_name">
                
                <input
                  type="text"
                  id="vehicle_name"
                  name="vehicle_name"
                  className="form-control"
                  value={vehicle.vehicle_name}
                  onChange={handleChange}
                  placeholder='Vehicle Name'
                  required
                />
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 form-group mb-3" data-for="vehicle_type">
                

                <input
                  type="text"
                  id="vehicle_type"
                  name="vehicle_type"
                  className="form-control"
                  value={vehicle.vehicle_type}
                  onChange={handleChange}
                  placeholder='Vehicle Type'
                  required
                />
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 form-group mb-3" data-for="vehicle_description">
                

                <textarea
                  id="vehicle_description"
                  name="vehicle_description"
                  className="form-control"
                  value={vehicle.vehicle_description}
                  onChange={handleChange}
                  placeholder='Vehicle Description'
                  required
                />
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 form-group mb-3" data-for="day_rate">
                
                <input
                  type="text"
                  id="day_rate"
                  name="day_rate"
                  className="form-control"
                  value={vehicle.day_rate}
                  onChange={handleChange}
                  placeholder='Rate Per Day'
                  required
                />
              </div>

              <div className="col-lg-12 col-md-12 col-sm-12 form-group mb-3" data-for="img">
                <label htmlFor="img" className="form-label">Vehicle Image:</label>
                <input type="file" id="img" name="img" className="form-control" onChange={handleImageChange} placeholder='Vehicle Image'/>
              </div>
              <div className="col-auto mbr-section-btn align-center">
                <button type="submit" className="btn btn-primary display-4">Add Vehicle</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddNewVehicle;