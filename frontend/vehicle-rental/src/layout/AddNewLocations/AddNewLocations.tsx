import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useOktaAuth } from '@okta/okta-react';
import { CustomUserClaims, UserClaims } from '@okta/okta-auth-js';
import { useNavigate } from 'react-router-dom';
import VehicleLocationModel from '../../model/VehicleLocationModel';
import LocationModel from '../../model/LocationModel';
import VehicleModel from '../../model/VehicleModel';
import { fetchLocationData } from '../../service/LocationService';
import { fetchVehicleData } from '../../service/FetchVehicle';
interface Location {
    location_name: string;
    location_description: string;
    location_address: string;
    location_city: string;
    location_state: string;
    location_country: string;
    location_zip: string;
}

const AddNewLocations: React.FC = () => {

    const { authState, oktaAuth } = useOktaAuth();
    const [userInfo, setUserInfo] = useState<UserClaims<CustomUserClaims> | null>(null);
    const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);
    const navigate = useNavigate();
    
    const [selectedLocation, setSelectedLocation] = useState<string>('');
    const [selectedVehicle, setSelectedVehicle] = useState<string>('');
    const [vehicles, setVehicles] = useState<VehicleModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [locations, setLocations] = useState<Location>({
        location_name: '',
        location_description: '',
        location_address: '',
        location_city: '',
        location_state: '',
        location_country: '',
        location_zip: ''
    });

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
        setLocations({ ...locations, [event.target.name]: event.target.value });
    };

    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData();
        if (authState!== null) {
        formData.append('location_name', locations.location_name);
        formData.append('location_address', locations.location_address);
        formData.append('location_city', locations.location_city);
        formData.append('location_country', locations.location_country);
        formData.append('location_description', locations.location_description);
        formData.append('location_state', locations.location_state);
        formData.append('location_zip', locations.location_zip);
        //formData.append('userEmail',  userInfo?.email);
        try {
            const response = await axios.post(`/api/locations?userEmail=${userInfo?.email}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`
                },
            });
            console.log(response.data);
            // Handle success, e.g., clear form or show success message
            setAlertMessage({ type: 'success', message: 'Location added successfully' });
            // Clear form
            setLocations({
                location_name: '',
                location_description: '',
                location_address: '',
                location_city: '',
                location_state: '',
                location_country: '',
                location_zip: ''
            });

        } catch (error) {
            console.error(error);
            setAlertMessage({ type: 'danger', message: 'Failed to add  Location. Please try again.' });
            // Handle errors, e.g., display error message to user
        }
    } else {
        setAlertMessage({ type: 'danger', message: 'Please select a valid vehicle and location.' });
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
            <strong>Add New Locations</strong>
          </h3>
          <h4 className="mbr-section-subtitle mbr-fonts-style align-center mb-0 mt-2 display-5">
            Register new locations here
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
              <div className="col-lg-12 col-md-12 col-sm-12 form-group mb-3" data-for="location_name">
                
                <input
                  type="text"
                  id="location_name"
                  name="location_name"
                  className="form-control"
                  value={locations.location_name}
                  onChange={handleChange}
                  placeholder='Location Name'
                  required
                />
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 form-group mb-3" data-for="location_address">
                

                <input
                  type="text"
                  id="location_address"
                  name="location_address"
                  className="form-control"
                  value={locations.location_address}
                  onChange={handleChange}
                  placeholder='Location Address'
                  required
                />
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 form-group mb-3" data-for="location_city">
                

                <textarea
                  id="location_city"
                  name="location_city"
                  className="form-control"
                  value={locations.location_city}
                  onChange={handleChange}
                  placeholder='Location City'
                  required
                />
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 form-group mb-3" data-for="location_country">
                
                <input
                  type="text"
                  id="location_country"
                  name="location_country"
                  className="form-control"
                  value={locations.location_country}
                  onChange={handleChange}
                  placeholder='Location Country'
                  required
                />
              </div>

              <div className="col-lg-12 col-md-12 col-sm-12 form-group mb-3" data-for="location_description">
                
                <input
                  type="text"
                  id="location_description"
                  name="location_description"
                  className="form-control"
                  value={locations.location_description}
                  onChange={handleChange}
                  placeholder='Location Description'
                  required
                />
              </div>

              <div className="col-lg-12 col-md-12 col-sm-12 form-group mb-3" data-for="location_state">
                
                <input
                  type="text"
                  id="location_state"
                  name="location_state"
                  className="form-control"
                  value={locations.location_state}
                  onChange={handleChange}
                  placeholder='Location State'
                  required
                />
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 form-group mb-3" data-for="location_zip">
                
                <input
                  type="text"
                  id="location_zip"
                  name="location_zip"
                  className="form-control"
                  value={locations.location_zip}
                  onChange={handleChange}
                  placeholder='Location Zip COde'
                  required
                />
              </div>
              <div className="col-auto mbr-section-btn align-center">
                <button type="submit" className="btn btn-primary display-4">Add Location</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
    );
};

export default AddNewLocations;