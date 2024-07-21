import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Carousel } from 'react-bootstrap';
import { SpinnerLoading } from "../../../util/SpinnerLoading";
import VehicleModel from "../../../model/VehicleModel";
import { fetchVehicleData } from "../../../service/FetchVehicleCache";
import blobToBase64 from "../../../util/ConvertBlobtoBase64";
import { ReturnVehicle } from "./ReturnVehicle";


const MyCarousel: React.FC = () => {
  const [vehicles, setVehicles] = useState<VehicleModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadVehicles() {
      try {
        const data = await fetchVehicleData();
        setVehicles(data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    }

    loadVehicles();
  }, []);

  if (loading) {
    return <SpinnerLoading />;
  }

  /*const chunkArray = (array: any[], chunkSize: number) => {
      const chunks = [];
      for (let i = 0; i < array.length; i += chunkSize) {
          chunks.push(array.slice(i, i + chunkSize));
      }
      return chunks;
  };

  const vehicleChunks = chunkArray(vehicles, 3);

  return (
      <>
          <div className="homepage-carousel-title">
              <h3>Find your next ride with us.</h3>
          </div>
          <Carousel 
          
          className="homepage-carousel">
              {vehicleChunks.map((vehicleChunk, index) => (
                  <Carousel.Item key={index} className="carousel-item">
                      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                          {vehicleChunk.map(vehicle => (
                              <ReturnVehicle key={vehicle.vehicle_id} vehicle={vehicle} />
                          ))}
                      </div>
                  </Carousel.Item>
              ))}
          
          </Carousel>
      </>
  );*/

  return (
    <>
      <div id="vehicleCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          {vehicles.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#vehicleCarousel"
              data-bs-slide-to={index}
              className={index === 0 ? 'active' : ''}
              aria-current={index === 0 ? 'true' : 'false'}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>
        <div className="carousel-inner">
          {vehicles.map((vehicle, index) => (
            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
              <img src={`data:image/jpg;base64,${vehicle.img}`} className="d-block w-100" alt="Vehicle Image" />
              <div className="carousel-caption d-none d-md-block">
                <h5>{vehicle.vehicle_name}</h5>
                <p>{vehicle.vehicle_description}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#vehicleCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#vehicleCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      


    </>
  );


};

export default MyCarousel;