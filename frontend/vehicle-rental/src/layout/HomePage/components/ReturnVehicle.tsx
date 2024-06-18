// ReturnVehicle.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import VehicleModel from './../../../model/VehicleModel';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

interface ReturnVehicleProps {
    vehicle: VehicleModel;
}

export const ReturnVehicle: React.FC<ReturnVehicleProps> = ({ vehicle }) => {



    //console.log(vehicle);
    return (

        <Card className='card'>
            <Card.Img variant="top" src={`data:image/jpg;base64,${vehicle.img}`} className='card-img' />
            <Card.Body className='card-body'>
                <Card.Title className='card-title'>{vehicle.vehicle_name}</Card.Title>
                <Card.Text className='card-text'>
                    {vehicle.vehicle_description}
                </Card.Text>

            </Card.Body>
        </Card>
    );

    /*return (
        <div id="vehicleCarousel" class="carousel slide">
  <div class="carousel-indicators">
    <button type="button" data-bs-target="#vehicleCarousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#vehicleCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#vehicleCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
  </div>
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src={`data:image/jpg;base64,${vehicle.img}`} class="d-block w-100" alt="...">
      <div class="carousel-caption d-none d-md-block">
        <h5>{vehicle.vehicle_name}</h5>
        <p>{vehicle.vehicle_description}</p>
      </div>
    </div>
    
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#vehicleCarousel" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#vehicleCarousel" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>
    );*/
};

export default ReturnVehicle;