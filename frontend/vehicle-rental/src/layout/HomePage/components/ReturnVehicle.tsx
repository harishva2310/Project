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

    
};

export default ReturnVehicle;